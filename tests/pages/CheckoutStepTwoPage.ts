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
  readonly primaryHeader: Locator;

  constructor(page: Page) {
    super(page);

    // Initialize locators using data-test attribute - Step One
    this.primaryHeader = page.locator('[data-test="title"]');

    // Step Two locators
    this.summaryInfo = page.locator('[data-test="summary-info"]');
    this.summarySubtotal = page.locator('[data-test="subtotal-label"]');
    this.summaryTax = page.locator('[data-test="tax-label"]');
    this.summaryTotal = page.locator('[data-test="total-label"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.cancelLink = page.locator('[data-test="cancel"]');
  }
  /**
   * Get summary subtotal text
   * @returns
   */
  async getSubtotal(): Promise<number> {
    const rawText = await this.summarySubtotal.textContent();
    return parseCurrencyToNumber(rawText);
  }

  /**
   * Get summary tax text
   */
  async getTax(): Promise<number> {
    const rawText = await this.summaryTax.textContent();
    return parseCurrencyToNumber(rawText);
  }

  /**
   * Get summary total text
   */
  async getTotal(): Promise<number> {
    const rawText = await this.summaryTotal.textContent();
    return parseCurrencyToNumber(rawText);
  }

  /**
   * Click finish button
   */
  async clickFinish(): Promise<void> {
    await this.finishButton.click();
  }

  /**
   * Finish the order by clicking the finish button
   */
  async finishOrder() {
    await this.finishButton.click();
    await this.isLoaded();
  }
}
