import { NextResponse } from "next/server";
import { deleteSubmittal, getSubmittal, updateSubmittal } from "@/lib/store";
import { deletePdf } from "@/lib/files";
import type { Submittal, SubmittalItem, SubmittalStatus } from "@/lib/types";
import { SUBMITTAL_STATUSES } from "@/lib/types";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const submittal = await getSubmittal(id);
  if (!submittal) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(submittal);
}

function sanitizeItems(raw: unknown): SubmittalItem[] | undefined {
  if (!Array.isArray(raw)) return undefined;
  const items: SubmittalItem[] = [];
  for (const [index, entry] of raw.entries()) {
    if (typeof entry !== "object" || entry === null) return undefined;
    const item = entry as Record<string, unknown>;
    if (typeof item.description !== "string") return undefined;
    items.push({
      id: typeof item.id === "string" && item.id ? item.id : crypto.randomUUID(),
      lineNo: index + 1,
      qty: typeof item.qty === "string" ? item.qty : String(item.qty ?? ""),
      unit: typeof item.unit === "string" ? item.unit : "",
      description: item.description,
      productId: typeof item.productId === "string" ? item.productId : null,
      include: item.include !== false,
      rawLine: typeof item.rawLine === "string" ? item.rawLine : "",
    });
  }
  return items;
}

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;
  const body = await request.json();
  const patch: Partial<
    Pick<
      Submittal,
      | "name"
      | "number"
      | "projectId"
      | "projectName"
      | "contractor"
      | "engineer"
      | "preparedBy"
      | "notes"
      | "status"
      | "items"
    >
  > = {};
  if (typeof body.name === "string" && body.name.trim()) patch.name = body.name.trim();
  if (typeof body.number === "string") patch.number = body.number;
  if (typeof body.projectId === "string" || body.projectId === null) {
    patch.projectId = body.projectId;
  }
  if (typeof body.projectName === "string") patch.projectName = body.projectName;
  if (typeof body.contractor === "string") patch.contractor = body.contractor;
  if (typeof body.engineer === "string") patch.engineer = body.engineer;
  if (typeof body.preparedBy === "string") patch.preparedBy = body.preparedBy;
  if (typeof body.notes === "string") patch.notes = body.notes;
  if (SUBMITTAL_STATUSES.includes(body.status as SubmittalStatus)) {
    patch.status = body.status as SubmittalStatus;
  }
  const items = sanitizeItems(body.items);
  if (items) patch.items = items;

  const submittal = await updateSubmittal(id, patch);
  if (!submittal) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(submittal);
}

export async function DELETE(_request: Request, { params }: Params) {
  const { id } = await params;
  const submittal = await getSubmittal(id);
  if (!submittal) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  await deleteSubmittal(id);
  if (submittal.quoteFile) {
    await deletePdf("quotes", submittal.quoteFile);
  }
  return NextResponse.json({ ok: true });
}
