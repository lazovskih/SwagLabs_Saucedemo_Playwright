import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class CartPage extends BasePage {
  pageTitleText = "Your Cart";
  pageUrl = "/cart.html";

  // Page locators
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;
  readonly primaryHeader: Locator;
  readonly completeHeader: Locator;

  constructor(page: Page) {
    super(page);
    this.cartItems = page.locator(".cart_item");
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
    this.primaryHeader = page.locator('[data-test="title"]');
    this.completeHeader = page.locator('[data-test="title"]');
  }

  /**
   * Get product count
   * @param productName
   * @returns item count on cart page Promise<number>
   */
  async getProductCount(productName: string) {
    return await this.cartItems.filter({ hasText: productName }).count();
  }

  /**
   * Get item count
   * @returns Promise<number> item coung on shopping cart icon
   */
  async getItemCount() {
    return await this.cartItems.count();
  }

  /**
   * Start checkout
   */
  async startCheckout() {
    await this.checkoutButton.click();
    await this.isLoaded();
  }

  /**
   * Remove product
   * @param productName product name text string
   */
  async removeProduct(productName: string) {
    const productId = productName.toLowerCase().replace(/\s+/g, "-");
    await this.page.locator(`[data-test="remove-${productId}"]`).click();
  }

  /**
   * Continue shopping
   */
  async continueShopping() {
    await this.continueShoppingButton.click();
  }
}
