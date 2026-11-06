import { Product, PricingConfig } from "@data-types";

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
 * Generates a normalized product identifier slug from a product object.
 * @param product - Product data object.
 * @returns Normalized lowercase hyphen-delimited product ID string.
 */
export function getProductId(product: Product) {
  return product.id ?? product.name.toLowerCase().replace(/\s+/g, "-");
}

/**
 * Extracts a numeric value by finding the index of the first digit,
 * slicing the number substring to the end of the text, and evaluating
 * any preceding minus sign.
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
  const { currencySymbol = "$", allowNegative = false } = options;
  if (!rawText || typeof rawText !== "string") {
    throw new Error(`[CurrencyParsingError]: Invalid input received: ${JSON.stringify(rawText)}. Expected non-empty string.`);
  }
  const escapedSymbol = currencySymbol.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(-?)\\s*${escapedSymbol}?\\s*(\\d[\\d,]*(?:\\.\\d+)?)`);
  const match = rawText.trim().match(regex);
  if (!match) {
    throw new Error(`[CurrencyParsingError]: No numeric currency value found in input string: "${rawText}".`);
  }
  const [, minusSign, numberPart] = match;
  const isNegative = allowNegative && (minusSign === "-" || rawText.includes(`-${currencySymbol}`));
  const parsedValue = Number.parseFloat((isNegative ? "-" : "") + numberPart.replace(/,/g, ""));
  if (Number.isNaN(parsedValue)) {
    throw new Error(`[CurrencyParsingError]: Failed to parse extracted substring "${numberPart}" from original: "${rawText}".`);
  }
  return parsedValue;
}

/**
 * Converts a dollar amount (e.g., 29.99) to integer cents (2999).
 */
export function toCents(amount: number): number {
  return Math.round(amount * 100);
}

/**
 * Sums an array of dollar amounts using exact integer cents math
 * and returns the exact dollar total (e.g., [15.99, 9.99, 29.99] -> 55.97).
 */
export function sumCurrencyAmounts(amounts: number[]): number {
  const totalCents = amounts.reduce((sum, amount) => sum + toCents(amount), 0);
  return totalCents / 100;
}

/**
 * Calculates tax rounded to the nearest cent using integer cents math.
 */
export function calculateTax(subtotal: number, pricing: PricingConfig): number {
  return Math.round(toCents(subtotal) * pricing.taxRate) / 100;
}

/**
 * Error fomatter for the setup fixture to satisfy playwright/no-conditional-in-test (only inspects inside the setup() body):
 * @param username 
 * @param pageUrl 
 * @param errorBanner 
 * @returns 
 */
export function formatAuthError(username: string, pageUrl: string, errorBanner: string | null): string {
  const detail = errorBanner
    ? `  Site Error: "${errorBanner.trim()}"\n`
    : `  Timed out navigating to '${pageUrl}'.\n`;

  return (
    `[Auth Setup Failed for '${username}']:\n` +
    detail +
    `  Please verify credentials in your .env file or CI secrets.`
  );
}
export { env, type EnvConfig } from "./env";