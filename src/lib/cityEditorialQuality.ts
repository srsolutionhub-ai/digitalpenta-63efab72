/** Count article/page prose, not navigation, structured data or source code. */
export function countEditorialWords(text: string): number {
  return (text.match(/[\p{L}\p{N}]+(?:[’'-][\p{L}\p{N}]+)*/gu) ?? []).length;
}

export function meetsCityPageDepth(text: string): boolean {
  return countEditorialWords(text) >= 3000;
}

export function repeatedEditorialParagraphs(texts: string[]): string[] {
  const seen = new Set<string>();
  const repeated = new Set<string>();
  for (const text of texts) {
    for (const paragraph of text.split(/\n\s*\n/)) {
      const normalized = paragraph.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, "").replace(/\s+/g, " ").trim();
      if (countEditorialWords(normalized) < 30) continue;
      if (seen.has(normalized)) repeated.add(normalized);
      seen.add(normalized);
    }
  }
  return [...repeated];
}