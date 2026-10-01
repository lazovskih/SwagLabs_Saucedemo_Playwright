import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
export class CheckoutComplete extends BasePage {
  pageTitleText = "Checkout: Complete!";
  pageUrl = "/checkout-complete.html";

  // Page locators
  private readonly completeTextElement: Locator;
  private readonly backHomeButton: Locator;
  readonly primaryHeader: Locator;

  readonly completeText = "Thank you for your order!";

  constructor(page: Page) {
    super(page);

    // Initialize locators using data-test attribute
    this.primaryHeader = page.locator('[data-test="title"]');
    this.completeTextElement = page.locator('[data-test="complete-text"]');
    this.backHomeButton = page.locator('[data-test="back-home"]');
  }
  /**
   * Retrieves the order completion description text.
   * @returns Promise resolving to the completion text content, or null if not found.
   */
  async getCompleteText(): Promise<string | null> {
    return this.completeTextElement.textContent();
  }

  /**
   * Clicks the 'Back Home' button to return to the inventory page.
   * @returns Promise that resolves when the back home button is clicked.
   */
  async clickBackHome() {
    await this.backHomeButton.click();
  }

  /**
   * Checks if the checkout complete header is visible.
   * @returns Promise resolving to true if the complete header is visible, false otherwise.
   */
  async isCheckoutComplete(): Promise<boolean> {
    return this.completeHeader.isVisible();
  }
}
