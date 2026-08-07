import { NextResponse } from "next/server";
import { createProduct, listProducts, updateProduct } from "@/lib/store";
import { savePdf } from "@/lib/files";

export async function GET() {
  const products = await listProducts();
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const form = await request.formData();
  const name = form.get("name");
  if (typeof name !== "string" || !name.trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }
  const text = (key: string) => {
    const value = form.get(key);
    return typeof value === "string" ? value : "";
  };
  const keywords = text("keywords")
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);

  let product = await createProduct({
    name,
    manufacturer: text("manufacturer"),
    model: text("model"),
    category: text("category") || "Other",
    keywords,
    datasheetUrl: text("datasheetUrl").trim() || null,
  });

  const datasheet = form.get("datasheet");
  if (datasheet instanceof File && datasheet.size > 0) {
    if (!datasheet.name.toLowerCase().endsWith(".pdf")) {
      return NextResponse.json(
        { error: "Data sheet must be a PDF" },
        { status: 400 },
      );
    }
    const filename = await savePdf(
      "datasheets",
      product.id,
      Buffer.from(await datasheet.arrayBuffer()),
    );
    product = (await updateProduct(product.id, { datasheetFile: filename }))!;
  }

  return NextResponse.json(product, { status: 201 });
}
