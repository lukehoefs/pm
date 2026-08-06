import { getDocumentProxy } from "unpdf";

export interface ParsedLine {
  qty: string;
  unit: string;
  description: string;
  rawLine: string;
}

const UNITS = [
  "EA",
  "EACH",
  "FT",
  "LF",
  "PC",
  "PCS",
  "CS",
  "BX",
  "BOX",
  "RL",
  "ROLL",
  "TON",
  "SET",
  "PR",
  "KIT",
];

const SKIP_PATTERNS =
  /\b(sub\s?total|total|sales\s+tax|tax|freight|shipping|handling|terms|net\s+\d+|page\s+\d+|quotation|quote\s+(no|number|date|#)|valid|remit|signature|thank\s+you|customer|bill\s+to|ship\s+to|phone|fax|email|www\.)\b/i;

/**
 * Rebuild visual text lines from pdf.js text items using their coordinates,
 * since extracted reading order does not follow table rows.
 */
export async function extractLines(pdfBytes: Uint8Array): Promise<string[]> {
  const doc = await getDocumentProxy(pdfBytes);
  const lines: string[] = [];
  for (let pageNo = 1; pageNo <= doc.numPages; pageNo++) {
    const page = await doc.getPage(pageNo);
    const content = await page.getTextContent();
    const rows = new Map<number, { x: number; str: string }[]>();
    for (const item of content.items) {
      if (!("str" in item) || !item.str.trim()) continue;
      const x = item.transform[4] as number;
      const y = item.transform[5] as number;
      // Bucket items whose baselines sit within ~3pt of each other.
      let key: number | undefined;
      for (const k of rows.keys()) {
        if (Math.abs(k - y) <= 3) {
          key = k;
          break;
        }
      }
      key ??= y;
      const row = rows.get(key) ?? [];
      row.push({ x, str: item.str });
      rows.set(key, row);
    }
    const sorted = [...rows.entries()].sort((a, b) => b[0] - a[0]);
    for (const [, items] of sorted) {
      const text = items
        .sort((a, b) => a.x - b.x)
        .map((i) => i.str)
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();
      if (text) lines.push(text);
    }
  }
  return lines;
}

const MONEY = /^\$?\d{1,3}(?:,\d{3})*\.\d{2,4}$/;

function stripTrailingPrices(text: string): { text: string; hadPrice: boolean } {
  const tokens = text.trim().split(/\s+/);
  let hadPrice = false;
  while (tokens.length > 0 && MONEY.test(tokens[tokens.length - 1])) {
    tokens.pop();
    hadPrice = true;
  }
  return { text: tokens.join(" "), hadPrice };
}

const unitPattern = UNITS.join("|");
// [line no] qty UNIT description...
const QTY_UNIT_RE = new RegExp(
  `^(?:\\d{1,3}\\s+)?(\\d{1,6}(?:\\.\\d+)?)\\s+(${unitPattern})\\b\\s+(.+)$`,
  "i",
);
// qty description... price [price]
const QTY_PRICE_RE = /^(\d{1,6})\s+(.{6,})$/;

export function parseQuoteLines(lines: string[]): ParsedLine[] {
  const items: ParsedLine[] = [];
  for (const rawLine of lines) {
    if (SKIP_PATTERNS.test(rawLine)) continue;

    const qtyUnit = QTY_UNIT_RE.exec(rawLine);
    if (qtyUnit) {
      const { text } = stripTrailingPrices(qtyUnit[3]);
      if (text.length >= 4 && /[a-zA-Z]{3,}/.test(text)) {
        items.push({
          qty: qtyUnit[1],
          unit: qtyUnit[2].toUpperCase(),
          description: text,
          rawLine,
        });
        continue;
      }
    }

    // Fallback: a qty followed by a description only counts as a line item
    // when the row ends in at least one price column.
    const qtyPrice = QTY_PRICE_RE.exec(rawLine);
    if (qtyPrice) {
      const { text, hadPrice } = stripTrailingPrices(qtyPrice[2]);
      if (hadPrice && text.length >= 6 && /[a-zA-Z]{3,}/.test(text)) {
        items.push({
          qty: qtyPrice[1],
          unit: "",
          description: text,
          rawLine,
        });
      }
    }
  }
  return items;
}

export async function parseQuotePdf(pdfBytes: Uint8Array): Promise<ParsedLine[]> {
  const lines = await extractLines(pdfBytes);
  return parseQuoteLines(lines);
}
