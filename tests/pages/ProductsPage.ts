import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { getProductId } from "tests/utilities/formatters";
import { Product } from "@data-types";

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
   * @param product as product object
   * @returns Playwright locator for the product's add-to-cart button
   */
  getAddToCartButton(product: Product) {
    return this.page.locator(`[data-test="add-to-cart-${getProductId(product)}"]`);
  }

  /**
   * Gets the 'Remove' button for a specified product.
   * @param product as product object
   * @returns Playwright locator for the product's add-to-cart button
   */
  getRemoveButton(product: Product) {
    return this.page.locator(`[data-test="remove-${getProductId(product)}"]`);
  }

  /**
   * Clicks 'Add to cart' button for a specified product.
   * @param product as product object
   */
  async addProductToCart(product: Product) {
    await this.getAddToCartButton(product).click();

    const removeProductButton = this.getRemoveButton(product);
    await removeProductButton.waitFor({ state: "attached" });
    await removeProductButton.waitFor({ state: "visible" });
  }

  /**
   * Clicks 'Add to cart' button for a specified products.
   * @param products as array with products objects
   */
  async addProductsToCart(products: Product[]) {
    for (const product of products) {
      await this.addProductToCart(product);
    }
  }

  /**
   * Get cart count
   * @returns Promise<number> count of items on the cart badge icon
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
  }
}
