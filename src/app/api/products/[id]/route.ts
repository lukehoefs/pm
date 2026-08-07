import { NextResponse } from "next/server";
import { deleteProduct, getProduct, updateProduct } from "@/lib/store";
import { deletePdf } from "@/lib/files";
import type { Product } from "@/lib/types";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(product);
}

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;
  const body = await request.json();
  const patch: Partial<
    Pick<
      Product,
      "name" | "manufacturer" | "model" | "category" | "keywords" | "datasheetUrl"
    >
  > = {};
  if (typeof body.datasheetUrl === "string" || body.datasheetUrl === null) {
    patch.datasheetUrl =
      typeof body.datasheetUrl === "string"
        ? body.datasheetUrl.trim() || null
        : null;
  }
  if (typeof body.name === "string" && body.name.trim()) patch.name = body.name.trim();
  if (typeof body.manufacturer === "string") patch.manufacturer = body.manufacturer;
  if (typeof body.model === "string") patch.model = body.model;
  if (typeof body.category === "string") patch.category = body.category;
  if (Array.isArray(body.keywords)) {
    patch.keywords = body.keywords
      .filter((k: unknown): k is string => typeof k === "string")
      .map((k: string) => k.trim())
      .filter(Boolean);
  }
  const product = await updateProduct(id, patch);
  if (!product) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(product);
}

export async function DELETE(_request: Request, { params }: Params) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  await deleteProduct(id);
  if (product.datasheetFile) {
    await deletePdf("datasheets", product.datasheetFile);
  }
  return NextResponse.json({ ok: true });
}
