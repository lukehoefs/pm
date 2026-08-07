import { NextResponse } from "next/server";
import { getProduct, updateProduct } from "@/lib/store";
import { savePdf } from "@/lib/files";

type Params = { params: Promise<{ id: string }> };

// Vendor downloads can be slow; allow up to a minute on serverless hosts.
export const maxDuration = 60;

const MAX_BYTES = 30 * 1024 * 1024;

export async function POST(_request: Request, { params }: Params) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (!product.datasheetUrl) {
    return NextResponse.json(
      { error: "Product has no data sheet URL" },
      { status: 400 },
    );
  }
  let url: URL;
  try {
    url = new URL(product.datasheetUrl);
  } catch {
    return NextResponse.json({ error: "Invalid data sheet URL" }, { status: 400 });
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    return NextResponse.json({ error: "Unsupported URL scheme" }, { status: 400 });
  }

  // Vendor sites occasionally bounce a first request (WAF/rate limiting),
  // so try twice before reporting failure.
  let buffer: Buffer | null = null;
  let failure = "";
  for (let attempt = 0; attempt < 2 && !buffer; attempt++) {
    if (attempt > 0) await new Promise((r) => setTimeout(r, 1500));
    let response: Response;
    try {
      response = await fetch(url, {
        redirect: "follow",
        signal: AbortSignal.timeout(45_000),
        headers: { "User-Agent": "Mozilla/5.0 (submittal-library fetch)" },
      });
    } catch {
      failure = `Could not reach ${url.hostname}`;
      continue;
    }
    if (!response.ok) {
      failure = `Vendor returned HTTP ${response.status}`;
      continue;
    }
    const body = Buffer.from(await response.arrayBuffer());
    if (body.length > MAX_BYTES) {
      failure = "File too large";
      continue;
    }
    // Trust the magic bytes over the content-type header — some vendors
    // serve PDFs as octet-stream.
    if (body.subarray(0, 5).toString("latin1") !== "%PDF-") {
      failure = "URL did not return a PDF";
      continue;
    }
    buffer = body;
  }
  if (!buffer) {
    return NextResponse.json({ error: failure }, { status: 502 });
  }
  const filename = await savePdf("datasheets", product.id, buffer);
  const updated = await updateProduct(id, { datasheetFile: filename });
  return NextResponse.json(updated);
}
