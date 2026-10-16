export function splitLines(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function splitParagraphs(text: string): string[][] {
  return text
    .split(/\n\s*\n/)
    .map(splitLines)
    .filter((lines) => lines.length > 0);
}

/** Pairs "건축 · 인테리어" with "Construction · Interior" by position. */
export function pairServices(services: string[]): { ko: string; en?: string }[] {
  const [ko = "", en = ""] = services;
  const koItems = ko.split("·").map((s) => s.trim()).filter(Boolean);
  const enItems = en.split("·").map((s) => s.trim()).filter(Boolean);
  return koItems.map((item, i) => ({ ko: item, en: enItems[i] }));
}

/** Strengths are stored as Korean items followed by their English translations. */
export function pairStrengths(strengths: string[]): { ko: string; en?: string }[] {
  const items = strengths.map((s) => s.trim()).filter(Boolean);
  if (items.length % 2 !== 0) return items.map((ko) => ({ ko }));
  const half = items.length / 2;
  return items.slice(0, half).map((ko, i) => ({ ko, en: items[half + i] }));
}
