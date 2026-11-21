import { Product, PricingConfig } from "@data-types";

/**
 * Options to configure currency parsing behavior.
 */
export interface CurrencyParseOptions {
  /** Currency symbol to match. Defaults to '$' */
  currencySymbol?: string;
  /** Allow negative currency values (e.g., "-$5.00"). Defaults to false */
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
 * Parses a numeric currency value from a raw DOM text string using a regular expression.
 * Matches an optional minus sign, an optional currency symbol, and a comma-formatted
 * integer or decimal number, stripping thousands separators before converting to a float.
 *
 * Examples:
 * - `"Tax: $1.92"` -> `1.92`
 * - `"Estimated State Sales Tax: $1,249.92"` -> `1249.92`
 * - `"Itemized Discount: -$15.50"` (with `{ allowNegative: true }`) -> `-15.5`
 *
 * @param rawText - The unparsed string extracted from the DOM.
 * @param options - Optional configuration for currency symbol and negative value handling.
 * @returns The parsed floating-point currency amount.
 * @throws {Error} If `rawText` is empty/non-string, contains no matching numeric currency value, or fails to parse as a valid number.
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
 * Formats an authentication setup error message outside the `setup()` body
 * to satisfy `playwright/no-conditional-in-test`.
 * @param username - Username used during the authentication attempt.
 * @param pageUrl - Expected post-login URL pathname.
 * @param errorBanner - Error banner text extracted from the login page, if visible.
 * @returns Formatted multi-line error message string.
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