/**
 * Options to configure currency parsing behavior.
 */
export interface CurrencyParseOptions {
  /** Currency symbol to match. Defaults to '$' */
  currencySymbol?: string;
  /** Allow negative currency values, e.g., -$5.00 or ($5.00). Defaults to false */
  allowNegative?: boolean;
}
/**
 * Extracts a numeric value by finding the index of the first digit,
 * slicing the number substring to the end of the text, and evaluating
 * any preceding minus sign.
 *
 * Designed for predictable DOM outputs like:
 * - "Tax: $1.92" -> 1.92
 * - "Estimated State Sales Tax: $1,249.92" -> 1249.92
 * - "Itemized Discount: -$15.50" -> -15.50
 *
 * @param rawText - The unparsed string extracted from the DOM.
 * @param options - Configurable parsing rules.
 * @returns The extracted floating-point number.
 * @throws Error if no digits are found or if the slice cannot be parsed.
 */
export function parseCurrencyToNumber(rawText: string | null | undefined, options: CurrencyParseOptions = {}): number {
  const { allowNegative = false } = options;

  if (!rawText || typeof rawText !== "string") {
    throw new Error(`[CurrencyParsingError]: Invalid input received: ${JSON.stringify(rawText)}. Expected non-empty string.`);
  }

  const trimmedText = rawText.trim();

  // 1. Locate the index of the very first digit (the delimiter pivot)
  const firstDigitIndex = trimmedText.search(/\d/);

  if (firstDigitIndex === -1) {
    throw new Error(`[CurrencyParsingError]: No numeric digits found in input string: "${rawText}".`);
  }

  // 2. Slice the number substring from the first digit to the end
  // Strip commas (thousands separators) and any trailing non-numeric artifacts
  const rawNumberPart = trimmedText.slice(firstDigitIndex).replace(/,/g, "").trim();

  // 3. Inspect the prefix substring (everything prior to the first digit) for a minus sign
  const prefix = trimmedText.slice(0, firstDigitIndex);
  const isNegative = allowNegative && prefix.includes("-");

  // 4. Parse the final sanitized numeric string
  const parsedValue = Number.parseFloat((isNegative ? "-" : "") + rawNumberPart);

  if (Number.isNaN(parsedValue)) {
    throw new Error(
      `[CurrencyParsingError]: Failed to parse extracted substring "${rawNumberPart}" from original: "${rawText}".`,
    );
  }

  return parsedValue;
}
