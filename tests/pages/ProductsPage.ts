import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

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
   * Get product ID
   * @param productName
   * @returns Normalized product id string
   */
  getProductId(productName: string) {
    return productName.toLowerCase().replace(/\s+/g, "-");
  }

  /**
   * Gets the 'Add to cart' button for a specified product.
   * @param productName - Name of the product.
   * @returns A Playwright locator for the product's add-to-cart button.
   */
  async getAddToCartButton(productName: string) {
    return this.page.locator(`[data-test="add-to-cart-${this.getProductId(productName)}"]`);
  }

  /**
   * Gets the 'Remove' button for a specified product.
   * @param productName - Name of the product.
   * @returns A Playwright locator for the product's add-to-cart button.
   */
  async getRemoveButton(productName: string) {
    return this.page.locator(`[data-test="remove-${this.getProductId(productName)}"]`);
  }

  /**
   * Clicks 'Add to cart' button for a specified product.
   * @param productName - Name of the product.
   */
  async addProductToCart(productName: string) {
    await (await this.getAddToCartButton(productName)).click();
  }

  /**
   * Clicks 'Add to cart' button for a specified products.
   * @param productNames - Array with names of the product.
   */
  async addProductsToCart(productNames: string[]) {
    for (const name of productNames) {
      await this.addProductToCart(name);
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
    await this.shoppingCartLink.click();
    await this.isLoaded();
  }
}
