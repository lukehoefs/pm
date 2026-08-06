import { NextResponse } from "next/server";
import { getSubmittal } from "@/lib/store";
import { readPdf } from "@/lib/files";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const submittal = await getSubmittal(id);
  if (!submittal?.quoteFile) {
    return NextResponse.json({ error: "No quote on file" }, { status: 404 });
  }
  const data = await readPdf("quotes", submittal.quoteFile);
  if (!data) {
    return NextResponse.json({ error: "Quote file missing" }, { status: 404 });
  }
  return new NextResponse(new Uint8Array(data), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${submittal.quoteFilename || "quote.pdf"}"`,
    },
  });
}
