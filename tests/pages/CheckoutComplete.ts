import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

/**
 * Checkout complete page.
 * Handles item summaries and order completion.
 */
export class CheckoutComplete extends BasePage {
  pageTitleText = "Checkout: Complete!";
  pageUrl = "/checkout-complete.html";

  // Page locators
  readonly completeTextElement: Locator;
  readonly backHomeButton: Locator;

  readonly completeHeader: Locator;
  readonly completeHeaderText = "Thank you for your order!";
  readonly completeText = "Your order has been dispatched, and will arrive just as fast as the pony can get there!";

  constructor(page: Page) {
    super(page);

    // Initialize locators using data-test attribute
    this.completeTextElement = page.locator('[data-test="complete-text"]');
    this.backHomeButton = page.locator('[data-test="back-home"]');
    this.completeHeader = page.locator('[data-test="complete-header"]');
  }
}
