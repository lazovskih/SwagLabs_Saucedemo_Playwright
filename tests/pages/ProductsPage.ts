import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { getProductId } from "tests/utilities/formatters";

export class ProductsPage extends BasePage {
  pageTitleText = "Products";
  pageUrl = "/inventory.html";

  // Page locators
  readonly inventoryItems: Locator;
  readonly cartBadge: Locator;
  readonly shoppingCartLink: Locator;
  readonly primaryHeader: Locator;

  constructor(page: Page) {
    super(page);
    this.inventoryItems = page.locator('[data-test="inventory-item"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.shoppingCartLink = page.locator('[data-test="shopping-cart-link"]');
    this.primaryHeader = page.locator('[data-test="title"]');
  }

  /**
   * Gets the 'Add to cart' button for a specified product.
   * @param productName - Name of the product.
   * @returns A Playwright locator for the product's add-to-cart button.
   */
  getAddToCartButton(productName: string) {
    return this.page.locator(`[data-test="add-to-cart-${getProductId(productName)}"]`);
  }

  /**
   * Gets the 'Remove' button for a specified product.
   * @param productName - Name of the product.
   * @returns A Playwright locator for the product's add-to-cart button.
   */
  getRemoveButton(productName: string) {
    return this.page.locator(`[data-test="remove-${getProductId(productName)}"]`);
  }

  /**
   * Clicks 'Add to cart' button for a specified product.
   * @param productName - Name of the product.
   */
  async addProductToCart(productName: string) {
    await this.getAddToCartButton(productName).click();

    const removeProductButton = this.getRemoveButton(productName);
    await removeProductButton.waitFor({ state: "attached" });
    await removeProductButton.waitFor({ state: "visible" });
  }

  /**
   * Clicks 'Add to cart' button for a specified products.
   * @param productNames - Array with names of the product.
   */
  async addProductsToCart(productNames: string[]) {
    for (const productName of productNames) {
      await this.addProductToCart(productName);
    }
  }

  /**
   * Get cart count
   * @returns Promise<number> count of the items on the cart badge icon
   */
  async getCartCount() {
    const count = await this.cartBadge.count();
    if (count === 0) return 0;
    const text = await this.cartBadge.textContent();
    return text ? Number(text.trim()) : 0;
  }
  /**
   * Clicks on cart badge icon to open 'View cart' page
   */
  async viewCart() {
    await this.SafeClick(this.shoppingCartLink);
  }
}
