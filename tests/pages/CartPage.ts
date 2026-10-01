import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { getProductId } from "tests/utilities/formatters";
import { Product } from "@data-types";

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
   * @param product as product object
   * @returns A promise that resolves to the number of matching cart items.
   */
  async getProductCount(product: Product) {
    return await this.cartItems.filter({ hasText: product.Name }).count();
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
  }

  /**
   * Remove product
   * @param product as product object
   */
  async removeProduct(product: Product) {
    await this.page.locator(`[data-test="remove-${getProductId(product)}"]`).click();
  }

  /**
   * Continue shopping
   */
  async continueShopping() {
    await this.continueShoppingButton.click();
  }
}
