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
   * Gets the number of occurrences of a product in the cart.
   * @param productName - Name of the product to count.
   * @returns A promise that resolves to the number of matching cart items.
   */
  async getProductCount(productName: string) {
    return this.cartItems.filter({ hasText: productName }).count();
  }

  /**
   * Get item count
   * @returns A promise that resolves to the number of cart items.
   */
  async getItemCount() {
    return this.cartItems.count();
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
   * @param productName - Name of the product.
   */
  async removeProduct(productName: string) {
    const productId = productName.toLowerCase().replace(/\s+/g, "-");
    await this.page.locator(`[data-test="remove-${productId}"]`).click();
  }

  /**
   * Continue shopping
   */
  async continueShopping() {
    this.continueShoppingButton.click();
    this.isLoaded();
  }
}
