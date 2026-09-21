import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { parseCurrencyToNumber } from "../utilities/formatters";
export class CheckoutComplete extends BasePage {
  pageTitleText = "Checkout: Complete!";
  pageUrl = "/checkout-complete.html";

  // Checkout complete page elements
  private readonly completeTextElement: Locator;
  private readonly backHomeButton: Locator;
  readonly completeText = "Thank you for your order!";
  readonly primaryHeader: Locator;

  constructor(page: Page) {
    super(page);

    // Initialize locators using data-test attribute
    this.primaryHeader = page.locator('[data-test="title"]');

    // Complete page locators
    this.completeTextElement = page.locator('[data-test="complete-text"]');
    this.backHomeButton = page.locator('[data-test="back-home"]');
  }
  /**
   * Get complete text
   */
  async getCompleteText(): Promise<string | null> {
    return this.completeTextElement.textContent();
  }

  /**
   * Click back home button
   */
  async clickBackHome(): Promise<void> {
    this.backHomeButton.click();
  }

  /**
   * Check if checkout is complete
   */
  async isCheckoutComplete(): Promise<boolean> {
    return this.completeHeader.isVisible();
  }
}
