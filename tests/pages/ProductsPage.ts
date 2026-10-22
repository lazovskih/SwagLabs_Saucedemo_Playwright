import { BasePage } from "./BasePage";
import { Locator, Page } from "@playwright/test";
import { Product } from "@data-types";

/**
 * Products page.
 * Handles product browsing and inventory interactions.
 */
export class ProductsPage extends BasePage {
  pageTitleText = "Products";
  pageUrl = "/inventory.html";

  // Page locators
  readonly sortSelector: Locator;
  readonly itemNames: Locator;
  readonly itemPrices: Locator;

  constructor(page: Page) {
    super(page);
    this.sortSelector = page.locator('[data-test="product-sort-container"]');
    this.itemNames = page.locator('[data-test="inventory-item-name"]');
    this.itemPrices = page.locator('[data-test="inventory-item-price"]');
  }

  /**
   * Adds a specified product to the shopping cart and waits for the 'Remove' button to appear.
   * Can be used on both 'Products' page
   * @param product - Product data object to add.
   * @returns Promise that resolves when the product is added.
   */
  async addProductToCart(product: Product) {
    await this.getButton(product, "add").click();

    const removeProductButton = this.getButton(product, "remove");
    await removeProductButton.waitFor({ state: "visible" });
  }

  /**
   * Sequentially adds multiple products to the shopping cart.
   * Can be used on both 'Products' page
   * @param products - Array of product data objects to add.
   * @returns Promise that resolves when all products have been added.
   */
  async addProductsToCart(products: Product[]) {
    for (const product of products) {
      await this.addProductToCart(product);
    }
  }
}
