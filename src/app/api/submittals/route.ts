import { NextResponse } from "next/server";
import {
  createSubmittal,
  listProducts,
  listSubmittals,
  updateSubmittal,
} from "@/lib/store";
import { savePdf } from "@/lib/files";
import { parseQuotePdf } from "@/lib/quote-parser";
import { bestMatch } from "@/lib/match";
import { BRAND } from "@/lib/brand";
import type { SubmittalItem } from "@/lib/types";

export async function GET() {
  const submittals = await listSubmittals();
  return NextResponse.json(submittals);
}

export async function POST(request: Request) {
  const form = await request.formData();
  const quote = form.get("quote");
  if (!(quote instanceof File) || quote.size === 0) {
    return NextResponse.json(
      { error: "A quote PDF is required" },
      { status: 400 },
    );
  }
  if (!quote.name.toLowerCase().endsWith(".pdf")) {
    return NextResponse.json({ error: "Quote must be a PDF" }, { status: 400 });
  }
  const nameField = form.get("name");
  const name =
    typeof nameField === "string" && nameField.trim()
      ? nameField.trim()
      : quote.name.replace(/\.pdf$/i, "");

  const bytes = new Uint8Array(await quote.arrayBuffer());
  let parsed;
  try {
    parsed = await parseQuotePdf(bytes);
  } catch {
    return NextResponse.json(
      { error: "Could not read that PDF. Is it a text-based quote?" },
      { status: 422 },
    );
  }

  const products = await listProducts();
  const items: SubmittalItem[] = parsed.map((line, index) => {
    const match = bestMatch(line.description, products);
    return {
      id: crypto.randomUUID(),
      lineNo: index + 1,
      qty: line.qty,
      unit: line.unit,
      description: line.description,
      productId: match?.product.id ?? null,
      include: true,
      rawLine: line.rawLine,
    };
  });

  const created = await createSubmittal({
    name,
    items,
    preparedBy: BRAND.name,
  });
  const quoteFile = await savePdf("quotes", created.id, Buffer.from(bytes));
  const submittal = await updateSubmittal(created.id, {
    quoteFile,
    quoteFilename: quote.name,
  });
  return NextResponse.json(submittal ?? created, { status: 201 });
}
