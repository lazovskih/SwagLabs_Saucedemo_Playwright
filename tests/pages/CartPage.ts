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
    // TODO: remove
    // 1. Ensure the element is attached to the DOM
    await this.checkoutButton.waitFor({ state: "attached" });
    await this.checkoutButton.waitFor({ state: "visible", timeout: 5000 });
    // 2. Explicitly scroll the element into view
    await this.checkoutButton.scrollIntoViewIfNeeded();

    // await this.shoppingCartLink.focus();
    await this.checkoutButton.click();
    await this.isLoaded();
  }

  /**
   * Clicks on cart badge icon to open 'View cart' page
   */
  async startCheckout_NEW2() {
    // TODO: remove
    // 1. Ensure the element is attached to the DOM
    await this.checkoutButton.waitFor({ state: "attached" });
    await this.checkoutButton.waitFor({ state: "visible", timeout: 5000 });
    // 2. Explicitly scroll the element into view
    await this.checkoutButton.scrollIntoViewIfNeeded();

    // await this.shoppingCartLink.focus();
    // await expect(this.shoppingCartLink).toBeVisible();

    // await this.shoppingCartLink.click();

    // 3. Dispatch a native JavaScript click event directly on the DOM node
    // await this.checkoutButton.evaluate((el: HTMLElement) => el.click());

    await this.checkoutButton.evaluate((el: HTMLElement) => {
      el.dispatchEvent(
        new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
          view: window,
        }),
      );
    });
    await this.isLoaded();
  }

  /**
   * Clicks on cart badge icon to open 'View cart' page
   */
  async startCheckout_NEW() {
    // // Use JS to dispatch click event (normal click failed on webKit)
    await this.clickJS(this.checkoutButton);
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
  async continueShopping_OLD() {
    // REMOVE
    this.continueShoppingButton.click();
    this.isLoaded();
  }

  /**
   * Continue shopping
   */
  async continueShopping() {
    // Use JS to dispatch click event (normal click failed on webKit)
    await this.clickJS(this.continueShoppingButton);
    await this.isLoaded();
    await this.isLoaded();
  }
}
