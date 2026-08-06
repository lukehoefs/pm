import { NextResponse } from "next/server";
import { getSubmittal, listProducts } from "@/lib/store";
import { generateSubmittalPdf } from "@/lib/submittal-pdf";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const submittal = await getSubmittal(id);
  if (!submittal) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (submittal.items.filter((i) => i.include).length === 0) {
    return NextResponse.json(
      { error: "No included line items to generate from" },
      { status: 400 },
    );
  }
  const products = await listProducts();
  const { bytes, warnings } = await generateSubmittalPdf(submittal, products);
  const safeName =
    submittal.name.replace(/[^\w -]+/g, "").trim().replace(/\s+/g, "-") ||
    "submittal";
  return new NextResponse(new Uint8Array(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${safeName}-submittal.pdf"`,
      "X-Submittal-Warnings": encodeURIComponent(JSON.stringify(warnings)),
    },
  });
}
