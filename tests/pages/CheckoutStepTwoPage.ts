import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { parseCurrencyToNumber } from "../utilities/formatters";
export class CheckoutStepTwoPage extends BasePage {
  pageTitleText = "Checkout: Overview";
  pageUrl = "/checkout-step-two.html";

  // Checkout page elements - Step Two (overview)
  private readonly summaryInfo: Locator;
  private readonly summarySubtotal: Locator;
  private readonly summaryTax: Locator;
  private readonly summaryTotal: Locator;
  private readonly finishButton: Locator;
  private readonly cancelLink: Locator;

  constructor(page: Page) {
    super(page);

    // Step Two locators
    this.summaryInfo = page.locator('[data-test="summary-info"]');
    this.summarySubtotal = page.locator('[data-test="subtotal-label"]');
    this.summaryTax = page.locator('[data-test="tax-label"]');
    this.summaryTotal = page.locator('[data-test="total-label"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.cancelLink = page.locator('[data-test="cancel"]');
  }
  /**
   * Retrieves and parses the summary subtotal into a numeric value.
   * @returns Promise resolving to the numeric subtotal amount.
   */
  async getSubtotal(): Promise<number> {
    const rawText = await this.summarySubtotal.textContent();
    return parseCurrencyToNumber(rawText);
  }

  /**
   * Retrieves and parses the summary tax into a numeric value.
   * @returns Promise resolving to the numeric tax amount.
   */
  async getTax(): Promise<number> {
    const rawText = await this.summaryTax.textContent();
    return parseCurrencyToNumber(rawText);
  }

  /**
   * Retrieves and parses the summary total into a numeric value.
   * @returns Promise resolving to the numeric total amount.
   */
  async getTotal(): Promise<number> {
    const rawText = await this.summaryTotal.textContent();
    return parseCurrencyToNumber(rawText);
  }

  /**
   * Completes the order by clicking the finish button and waiting for page load.
   * @returns Promise that resolves when the finish action completes.
   */
  async finishOrder() {
    await this.finishButton.click();
    await this.isLoaded();
  }
}
