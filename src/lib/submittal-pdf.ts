import {
  PDFDocument,
  PDFFont,
  PDFPage,
  StandardFonts,
  rgb,
} from "pdf-lib";
import type { Product, Submittal, SubmittalItem } from "./types";
import { readPdf } from "./files";

const PAGE_W = 612;
const PAGE_H = 792;
const MARGIN = 54;

const INK = rgb(0.06, 0.09, 0.16);
const MUTED = rgb(0.39, 0.45, 0.55);
const ACCENT = rgb(0.06, 0.3, 0.36);
const LINE = rgb(0.85, 0.89, 0.93);

interface Fonts {
  regular: PDFFont;
  bold: PDFFont;
}

function wrapText(
  text: string,
  font: PDFFont,
  size: number,
  maxWidth: number,
): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) <= maxWidth) {
      current = candidate;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines.length > 0 ? lines : [""];
}

function sanitize(text: string): string {
  // WinAnsi-encodable only; swap common typography and drop the rest.
  return text
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, "-")
    .replace(/…/g, "...")
    .replace(/[^\x20-\x7E]/g, "");
}

function drawLabelValue(
  page: PDFPage,
  fonts: Fonts,
  label: string,
  value: string,
  x: number,
  y: number,
  maxWidth: number,
): number {
  page.drawText(label.toUpperCase(), {
    x,
    y,
    size: 8,
    font: fonts.bold,
    color: MUTED,
  });
  const lines = wrapText(sanitize(value || "-"), fonts.regular, 11, maxWidth);
  let cursor = y - 14;
  for (const line of lines) {
    page.drawText(line, { x, y: cursor, size: 11, font: fonts.regular, color: INK });
    cursor -= 14;
  }
  return cursor - 8;
}

function displayDate(iso: string): string {
  const d = iso ? new Date(iso) : new Date();
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function productLabel(product: Product | undefined): string {
  if (!product) return "-";
  const parts = [product.manufacturer, product.model].filter(Boolean);
  return parts.length > 0 ? parts.join(" ") : product.name;
}

function addCoverPage(
  doc: PDFDocument,
  fonts: Fonts,
  submittal: Submittal,
  itemCount: number,
): void {
  const page = doc.addPage([PAGE_W, PAGE_H]);

  page.drawRectangle({
    x: 0,
    y: PAGE_H - 10,
    width: PAGE_W,
    height: 10,
    color: ACCENT,
  });

  let y = PAGE_H - 130;
  page.drawText("SUBMITTAL PACKAGE", {
    x: MARGIN,
    y,
    size: 28,
    font: fonts.bold,
    color: ACCENT,
  });
  y -= 34;
  const nameLines = wrapText(
    sanitize(submittal.name),
    fonts.bold,
    18,
    PAGE_W - MARGIN * 2,
  );
  for (const line of nameLines) {
    page.drawText(line, { x: MARGIN, y, size: 18, font: fonts.bold, color: INK });
    y -= 24;
  }
  if (submittal.number) {
    page.drawText(sanitize(`Submittal No. ${submittal.number}`), {
      x: MARGIN,
      y,
      size: 12,
      font: fonts.regular,
      color: MUTED,
    });
    y -= 20;
  }

  page.drawLine({
    start: { x: MARGIN, y: y - 6 },
    end: { x: PAGE_W - MARGIN, y: y - 6 },
    thickness: 1,
    color: LINE,
  });
  y -= 40;

  const colW = (PAGE_W - MARGIN * 2 - 24) / 2;
  const leftX = MARGIN;
  const rightX = MARGIN + colW + 24;
  let leftY = y;
  let rightY = y;

  leftY = drawLabelValue(page, fonts, "Project", submittal.projectName, leftX, leftY, colW);
  leftY = drawLabelValue(page, fonts, "Contractor", submittal.contractor, leftX, leftY, colW);
  leftY = drawLabelValue(page, fonts, "Engineer of Record", submittal.engineer, leftX, leftY, colW);
  rightY = drawLabelValue(page, fonts, "Prepared By", submittal.preparedBy, rightX, rightY, colW);
  rightY = drawLabelValue(page, fonts, "Date", displayDate(submittal.updatedAt), rightX, rightY, colW);
  rightY = drawLabelValue(page, fonts, "Sections", String(itemCount), rightX, rightY, colW);

  if (submittal.notes) {
    drawLabelValue(
      page,
      fonts,
      "Notes",
      submittal.notes,
      MARGIN,
      Math.min(leftY, rightY) - 12,
      PAGE_W - MARGIN * 2,
    );
  }

  page.drawText(
    "Product data herein is submitted for review and approval prior to release of material.",
    {
      x: MARGIN,
      y: 72,
      size: 9,
      font: fonts.regular,
      color: MUTED,
    },
  );
}

function addTransmittalPages(
  doc: PDFDocument,
  fonts: Fonts,
  submittal: Submittal,
  items: SubmittalItem[],
  productById: Map<string, Product>,
): void {
  const cols = {
    sec: MARGIN,
    qty: MARGIN + 34,
    desc: MARGIN + 92,
    prod: MARGIN + 306,
    action: PAGE_W - MARGIN - 58,
  };
  const descW = cols.prod - cols.desc - 10;
  const prodW = cols.action - cols.prod - 10;

  let page: PDFPage | null = null;
  let y = 0;

  const startPage = () => {
    page = doc.addPage([PAGE_W, PAGE_H]);
    y = PAGE_H - 70;
    page.drawText("TRANSMITTAL / TABLE OF CONTENTS", {
      x: MARGIN,
      y,
      size: 14,
      font: fonts.bold,
      color: ACCENT,
    });
    y -= 18;
    page.drawText(
      sanitize(
        [submittal.name, submittal.number && `No. ${submittal.number}`]
          .filter(Boolean)
          .join(" - "),
      ),
      { x: MARGIN, y, size: 10, font: fonts.regular, color: MUTED },
    );
    y -= 26;
    page.drawText("SEC", { x: cols.sec, y, size: 8, font: fonts.bold, color: MUTED });
    page.drawText("QTY", { x: cols.qty, y, size: 8, font: fonts.bold, color: MUTED });
    page.drawText("DESCRIPTION", { x: cols.desc, y, size: 8, font: fonts.bold, color: MUTED });
    page.drawText("MANUFACTURER / MODEL", { x: cols.prod, y, size: 8, font: fonts.bold, color: MUTED });
    page.drawText("ACTION", { x: cols.action, y, size: 8, font: fonts.bold, color: MUTED });
    y -= 6;
    page.drawLine({
      start: { x: MARGIN, y },
      end: { x: PAGE_W - MARGIN, y },
      thickness: 1,
      color: LINE,
    });
    y -= 16;
  };

  startPage();
  items.forEach((item, index) => {
    const product = item.productId
      ? productById.get(item.productId)
      : undefined;
    const descLines = wrapText(sanitize(item.description), fonts.regular, 9, descW);
    const prodLines = wrapText(sanitize(productLabel(product)), fonts.regular, 9, prodW);
    const rowLines = Math.max(descLines.length, prodLines.length);
    const rowHeight = rowLines * 12 + 10;
    if (y - rowHeight < 60 || page === null) startPage();
    const p = page as PDFPage;

    p.drawText(String(index + 1), { x: cols.sec, y, size: 9, font: fonts.bold, color: INK });
    p.drawText(sanitize([item.qty, item.unit].filter(Boolean).join(" ")), {
      x: cols.qty,
      y,
      size: 9,
      font: fonts.regular,
      color: INK,
    });
    descLines.forEach((line, i) => {
      p.drawText(line, { x: cols.desc, y: y - i * 12, size: 9, font: fonts.regular, color: INK });
    });
    prodLines.forEach((line, i) => {
      p.drawText(line, { x: cols.prod, y: y - i * 12, size: 9, font: fonts.regular, color: INK });
    });
    p.drawRectangle({
      x: cols.action,
      y: y - 3,
      width: 46,
      height: 12,
      borderColor: LINE,
      borderWidth: 1,
    });
    y -= rowHeight;
    p.drawLine({
      start: { x: MARGIN, y: y + 6 },
      end: { x: PAGE_W - MARGIN, y: y + 6 },
      thickness: 0.5,
      color: LINE,
    });
  });
}

function addSectionDivider(
  doc: PDFDocument,
  fonts: Fonts,
  sectionNo: number,
  item: SubmittalItem,
  product: Product | undefined,
  hasDatasheet: boolean,
): void {
  const page = doc.addPage([PAGE_W, PAGE_H]);
  page.drawRectangle({
    x: 0,
    y: PAGE_H - 10,
    width: PAGE_W,
    height: 10,
    color: ACCENT,
  });

  let y = PAGE_H - 180;
  page.drawText(`SECTION ${sectionNo}`, {
    x: MARGIN,
    y,
    size: 24,
    font: fonts.bold,
    color: ACCENT,
  });
  y -= 36;
  const descLines = wrapText(
    sanitize(item.description),
    fonts.bold,
    16,
    PAGE_W - MARGIN * 2,
  );
  for (const line of descLines) {
    page.drawText(line, { x: MARGIN, y, size: 16, font: fonts.bold, color: INK });
    y -= 22;
  }
  y -= 18;

  const colW = PAGE_W - MARGIN * 2;
  y = drawLabelValue(
    page,
    fonts,
    "Quantity",
    [item.qty, item.unit].filter(Boolean).join(" "),
    MARGIN,
    y,
    colW,
  );
  if (product) {
    y = drawLabelValue(page, fonts, "Manufacturer", product.manufacturer, MARGIN, y, colW);
    y = drawLabelValue(page, fonts, "Model / Series", product.model, MARGIN, y, colW);
    y = drawLabelValue(page, fonts, "Category", product.category, MARGIN, y, colW);
  }

  if (!hasDatasheet) {
    page.drawText(
      product
        ? "Product data sheet not on file - upload one in the Product Library."
        : "No library product assigned - product data to follow under separate cover.",
      { x: MARGIN, y: y - 10, size: 10, font: fonts.regular, color: rgb(0.7, 0.26, 0.26) },
    );
  }
}

export interface GenerateResult {
  bytes: Uint8Array;
  warnings: string[];
}

export async function generateSubmittalPdf(
  submittal: Submittal,
  products: Product[],
): Promise<GenerateResult> {
  const warnings: string[] = [];
  const productById = new Map(products.map((p) => [p.id, p]));
  const items = submittal.items.filter((i) => i.include);

  const doc = await PDFDocument.create();
  const fonts: Fonts = {
    regular: await doc.embedFont(StandardFonts.Helvetica),
    bold: await doc.embedFont(StandardFonts.HelveticaBold),
  };
  doc.setTitle(sanitize(submittal.name || "Submittal Package"));

  addCoverPage(doc, fonts, submittal, items.length);
  addTransmittalPages(doc, fonts, submittal, items, productById);

  for (const [index, item] of items.entries()) {
    const product = item.productId ? productById.get(item.productId) : undefined;
    let datasheet: Buffer | null = null;
    if (product?.datasheetFile) {
      datasheet = await readPdf("datasheets", product.datasheetFile);
      if (!datasheet) {
        warnings.push(`Data sheet file missing for ${product.name}.`);
      }
    } else if (product) {
      warnings.push(`No data sheet on file for ${product.name}.`);
    } else {
      warnings.push(`Section ${index + 1} has no library product assigned.`);
    }

    addSectionDivider(doc, fonts, index + 1, item, product, datasheet !== null);

    if (datasheet) {
      try {
        const source = await PDFDocument.load(new Uint8Array(datasheet), {
          ignoreEncryption: true,
        });
        const pages = await doc.copyPages(source, source.getPageIndices());
        for (const p of pages) doc.addPage(p);
      } catch {
        warnings.push(
          `Could not read data sheet PDF for ${product?.name ?? "item"}; skipped.`,
        );
      }
    }
  }

  // Footer stamp on every page, done last so the count is final.
  const pages = doc.getPages();
  const label = sanitize(
    [submittal.number && `Submittal No. ${submittal.number}`, submittal.name]
      .filter(Boolean)
      .join(" - "),
  );
  pages.forEach((page, i) => {
    const { width } = page.getSize();
    const text = `${label}  |  Page ${i + 1} of ${pages.length}`;
    const size = 8;
    const textWidth = fonts.regular.widthOfTextAtSize(text, size);
    page.drawRectangle({
      x: 0,
      y: 0,
      width,
      height: 24,
      color: rgb(1, 1, 1),
      opacity: 0.85,
    });
    page.drawText(text, {
      x: (width - textWidth) / 2,
      y: 9,
      size,
      font: fonts.regular,
      color: MUTED,
    });
  });

  const bytes = await doc.save();
  return { bytes, warnings };
}
