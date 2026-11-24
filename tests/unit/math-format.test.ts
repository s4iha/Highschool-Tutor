import { decodeUnicodeEscapes, formatMathAndUnicode } from "@/features/curriculum/utils/math-format";

describe("math-format utility", () => {
  describe("decodeUnicodeEscapes", () => {
    it("decodes \\u2218 (ring operator) into ∘", () => {
      const input = "What is the composite function (f \\u2218 g)(x)?";
      const result = decodeUnicodeEscapes(input);
      expect(result).toBe("What is the composite function (f ∘ g)(x)?");
    });

    it("decodes multiple unicode escape sequences in one string", () => {
      const input = "5 \\u00d7 10\\u00b2 \\u2260 400";
      const result = decodeUnicodeEscapes(input);
      expect(result).toBe("5 × 10² ≠ 400");
    });

    it("decodes \\u{...} ES6 code point escapes", () => {
      const input = "Operator: \\u{2218} and math: \\u{00b3}";
      const result = decodeUnicodeEscapes(input);
      expect(result).toBe("Operator: ∘ and math: ³");
    });

    it("returns empty string on null, undefined, or empty input", () => {
      // @ts-expect-error testing invalid inputs
      expect(decodeUnicodeEscapes(null)).toBe("");
      // @ts-expect-error testing invalid inputs
      expect(decodeUnicodeEscapes(undefined)).toBe("");
      expect(decodeUnicodeEscapes("")).toBe("");
    });

    it("preserves strings without unicode escapes unchanged", () => {
      const input = "Simple plain text string without any escapes.";
      expect(decodeUnicodeEscapes(input)).toBe(input);
    });
  });

  describe("formatMathAndUnicode", () => {
    it("decodes unicode escapes and formats exponents outside LaTeX", () => {
      const input = "What is the composite function (f \\u2218 g)(x) if f(x) = 2x + 1 and g(x) = x^2 - 3?";
      const result = formatMathAndUnicode(input);
      expect(result).toBe("What is the composite function (f ∘ g)(x) if f(x) = 2x + 1 and g(x) = x² - 3?");
    });

    it("formats multiple choice options with exponents nicely", () => {
      expect(formatMathAndUnicode("2x^2 - 5")).toBe("2x² - 5");
      expect(formatMathAndUnicode("4x^2 + 4x - 2")).toBe("4x² + 4x - 2");
      expect(formatMathAndUnicode("(x+1)^2")).toBe("(x+1)²");
      expect(formatMathAndUnicode("x^3 + 3x^2 + 3x + 1")).toBe("x³ + 3x² + 3x + 1");
    });

    it("preserves LaTeX equations when $ delimiters are present", () => {
      const input = "Evaluate the expression $(f \\circ g)(x) = 2x^2 - 5$ for $x = 3$.";
      const result = formatMathAndUnicode(input);
      // Exponents inside LaTeX should remain ^2 so KaTeX renders it natively
      expect(result).toBe("Evaluate the expression $(f \\circ g)(x) = 2x^2 - 5$ for $x = 3$.");
    });

    it("decodes unicode escapes even when LaTeX delimiters are present", () => {
      const input = "Evaluate $\\u221a{16}$ which equals 4.";
      const result = formatMathAndUnicode(input);
      expect(result).toBe("Evaluate $√{16}$ which equals 4.");
    });
  });
});
