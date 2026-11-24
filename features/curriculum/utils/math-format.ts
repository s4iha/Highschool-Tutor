/**
 * Utility for formatting mathematical text and sanitizing unicode escape sequences.
 *
 * Handles:
 * 1. Decoding literal unicode escapes (e.g., `\u2218` -> `∘`, `\u00d7` -> `×`, `\u00b2` -> `²`).
 * 2. Decoding variable length unicode escapes `\u{...}`.
 * 3. Normalizing superscript exponents (`^2` -> `²`, `^3` -> `³`) when outside LaTeX formulas for cleaner display.
 * 4. Preserving LaTeX syntax ($...$, $$...$$, \frac, \sqrt, \circ, etc.) for KaTeX rendering.
 */

const SUPERSCRIPT_MAP: Record<string, string> = {
  "0": "⁰",
  "1": "¹",
  "2": "²",
  "3": "³",
  "4": "⁴",
  "5": "⁵",
  "6": "⁶",
  "7": "⁷",
  "8": "⁸",
  "9": "⁹",
  "+": "⁺",
  "-": "⁻",
  "n": "ⁿ",
  "x": "ˣ",
};

/**
 * Decodes literal Unicode escape sequences like `\u2218` into actual characters (e.g. `∘`).
 */
export function decodeUnicodeEscapes(text: string): string {
  if (!text || typeof text !== "string") return "";

  // 1. Decode \u{XXXXX} (ES6 Unicode code point escapes)
  let result = text.replace(/\\u\{([0-9a-fA-F]+)\}/g, (_, hex) => {
    try {
      return String.fromCodePoint(parseInt(hex, 16));
    } catch {
      return _;
    }
  });

  // 2. Decode standard \uXXXX escapes (4 hex digits)
  result = result.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => {
    try {
      return String.fromCharCode(parseInt(hex, 16));
    } catch {
      return _;
    }
  });

  return result;
}

/**
 * Normalizes mathematical text for display:
 * - Decodes escaped unicode characters (\u2218 -> ∘, etc.)
 * - If not already using LaTeX $...$, gently formats simple carets like x^2 to x² for clean readability
 */
export function formatMathAndUnicode(text: string): string {
  if (!text || typeof text !== "string") return "";

  const decoded = decodeUnicodeEscapes(text);

  // If text already has LaTeX delimiters ($...$ or $$...$$), let KaTeX handle the inner math formulas directly.
  if (decoded.includes("$")) {
    return decoded;
  }

  // Convert simple variable exponents outside LaTeX (e.g. x^2 -> x², x^3 -> x³, 2x^2 -> 2x², (x+1)^2 -> (x+1)²)
  return decoded.replace(/([a-zA-Z]|\))(\^([0-9n+\-]+))/g, (_, base, _fullExp, expVal) => {
    const convertedExp = expVal
      .split("")
      .map((char: string) => SUPERSCRIPT_MAP[char] || char)
      .join("");
    return `${base}${convertedExp}`;
  });
}
