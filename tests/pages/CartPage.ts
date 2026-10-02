import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

/**
 * Cart page.
 * Handles item summaries and order completion.
 */
export class CartPage extends BasePage {
  pageTitleText = "Your Cart";
  pageUrl = "/cart.html";

  // Page locators
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    super(page);
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
  }

  /**
   * Clicks the checkout button to initiate the checkout flow.
   * @returns Promise that resolves when the checkout button is clicked.
   */
  async startCheckout() {
    await this.checkoutButton.click();
  }

  /**
   * Clicks the continue shopping button to return to the inventory page.
   * @returns Promise that resolves when the continue shopping button is clicked.
   */
  async continueShopping() {
    await this.continueShoppingButton.click();
  }
}
