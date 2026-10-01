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

  constructor(page: Page) {
    super(page);
    this.cartItems = page.locator(".cart_item");
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
  }

  /**
   * Gets the number of occurrences of a product in the cart.
   * @param product - Product data object.
   * @returns Promise resolving to the number of matching cart items.
   */
  async getProductCount(product: Product) {
    return await this.cartItems.filter({ hasText: product.Name }).count();
  }

  /**
   * Retrieves the total count of item rows currently displayed in the cart.
   * @returns Promise resolving to the number of cart items.
   */
  async getItemCount() {
    return this.cartItems.count();
  }

  /**
   * Clicks the checkout button to initiate the checkout flow.
   * @returns Promise that resolves when the checkout button is clicked.
   */
  async startCheckout() {
    await this.checkoutButton.click();
  }

  /**
   * Removes a specific product from the cart by clicking its remove button.
   * @param product - Product data object to remove.
   * @returns Promise that resolves when the remove button is clicked.
   */
  async removeProduct(product: Product) {
    await this.page.locator(`[data-test="remove-${getProductId(product)}"]`).click();
  }

  /**
   * Clicks the continue shopping button to return to the inventory page.
   * @returns Promise that resolves when the continue shopping button is clicked.
   */
  async continueShopping() {
    await this.continueShoppingButton.click();
  }
}
