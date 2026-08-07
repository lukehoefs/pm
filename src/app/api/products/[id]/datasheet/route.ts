import { NextResponse } from "next/server";
import { getProduct, updateProduct } from "@/lib/store";
import { readPdf, savePdf } from "@/lib/files";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product?.datasheetFile) {
    return NextResponse.json({ error: "No data sheet on file" }, { status: 404 });
  }
  const data = await readPdf("datasheets", product.datasheetFile);
  if (!data) {
    return NextResponse.json({ error: "Data sheet file missing" }, { status: 404 });
  }
  return new NextResponse(new Uint8Array(data), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${product.id}.pdf"`,
    },
  });
}

export async function POST(request: Request, { params }: Params) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const form = await request.formData();
  const file = form.get("datasheet");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "PDF file is required" }, { status: 400 });
  }
  if (!file.name.toLowerCase().endsWith(".pdf")) {
    return NextResponse.json({ error: "Data sheet must be a PDF" }, { status: 400 });
  }
  const filename = await savePdf(
    "datasheets",
    product.id,
    Buffer.from(await file.arrayBuffer()),
  );
  const updated = await updateProduct(id, { datasheetFile: filename });
  return NextResponse.json(updated);
}
