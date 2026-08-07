import type { Product } from "./types";

const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "for",
  "of",
  "or",
  "the",
  "to",
  "w",
  "with",
  "x",
]);

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/["”]/g, " in ")
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 0 && !STOP_WORDS.has(t));
}

function tokenWeight(token: string): number {
  // Sizes and short codes ("8", "mj") are weaker signals than real words.
  return token.length >= 3 && !/^\d+$/.test(token) ? 1 : 0.5;
}

function productTokens(product: Product): Set<string> {
  return new Set([
    ...tokenize(product.name),
    ...tokenize(product.manufacturer),
    ...tokenize(product.model),
    ...tokenize(product.category),
    ...product.keywords.flatMap(tokenize),
  ]);
}

/** Score how well a quote-line description matches a product, 0..1. */
export function scoreMatch(description: string, product: Product): number {
  const descTokens = [...new Set(tokenize(description))];
  if (descTokens.length === 0) return 0;
  const prodTokens = productTokens(product);
  let matched = 0;
  let total = 0;
  for (const token of descTokens) {
    const weight = tokenWeight(token);
    total += weight;
    if (prodTokens.has(token)) matched += weight;
  }
  return total > 0 ? matched / total : 0;
}

const MATCH_THRESHOLD = 0.45;

export function bestMatch(
  description: string,
  products: Product[],
): { product: Product; score: number } | null {
  let best: { product: Product; score: number } | null = null;
  for (const product of products) {
    const score = scoreMatch(description, product);
    if (score >= MATCH_THRESHOLD && (!best || score > best.score)) {
      best = { product, score };
    }
  }
  return best;
}
