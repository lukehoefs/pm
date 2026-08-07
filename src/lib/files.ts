import { promises as fs } from "fs";
import path from "path";
import { DATA_DIR } from "./data-dir";

export type FileKind = "datasheets" | "quotes";

function dirFor(kind: FileKind): string {
  return path.join(DATA_DIR, kind);
}

function safeName(name: string): string {
  const base = path.basename(name);
  if (!/^[\w.-]+$/.test(base) || base.includes("..")) {
    throw new Error(`Invalid file name: ${name}`);
  }
  return base;
}

export async function savePdf(
  kind: FileKind,
  id: string,
  data: Buffer | Uint8Array,
): Promise<string> {
  const filename = `${safeName(id)}.pdf`;
  await fs.mkdir(dirFor(kind), { recursive: true });
  await fs.writeFile(path.join(dirFor(kind), filename), data);
  return filename;
}

export async function readPdf(
  kind: FileKind,
  filename: string,
): Promise<Buffer | null> {
  try {
    return await fs.readFile(path.join(dirFor(kind), safeName(filename)));
  } catch {
    return null;
  }
}

export async function deletePdf(kind: FileKind, filename: string): Promise<void> {
  try {
    await fs.unlink(path.join(dirFor(kind), safeName(filename)));
  } catch {
    // Already gone — nothing to clean up.
  }
}
