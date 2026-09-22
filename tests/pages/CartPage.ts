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
    // 1. Ensure the element is attached to the DOM
    // await this.checkoutButton.waitFor({ state: "attached" });
    // await this.checkoutButton.waitFor({ state: "visible", timeout: 5000 });

    // 2. Explicitly scroll the element into view
    await this.checkoutButton.scrollIntoViewIfNeeded();

    // await this.shoppingCartLink.focus();
    await this.checkoutButton.click();
    await this.isLoaded();
  }

  /**
   * Remove product
   * @param productName
   */
  async removeProduct(productName: string) {
    const productId = productName.toLowerCase().replace(/\s+/g, "-");
    await this.page.locator(`[data-test="remove-${productId}"]`).click();
  }

  /**
   * Continue shopping
   */
  async continueShopping() {
    // 1. Ensure the element is attached to the DOM
    // await this.continueShoppingButton.waitFor({ state: "attached" });
    // await this.continueShoppingButton.waitFor({ state: "visible", timeout: 5000 });

    // 2. Explicitly scroll the element into view
    await this.continueShoppingButton.scrollIntoViewIfNeeded();

    // await this.shoppingCartLink.focus();
    await this.continueShoppingButton.click();
    await this.isLoaded();
  }
}
