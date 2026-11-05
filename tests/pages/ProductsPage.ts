import { Locator, Page } from "@playwright/test";
import { InternalPage } from "./InternalPage";
import type { Product, CartButtonAction } from "@data-types";
import { getProductId } from "@utilities/index";
/**
 * Products page parent is used by ProductsPage and CartPage.
 * Handles product removal and inventory interactions.
 */
export abstract class ProductsPage extends InternalPage {
  readonly itemNames: Locator;
  readonly itemPrices: Locator;

  constructor(page: Page) {
    super(page);
    this.itemNames = page.locator('[data-test="inventory-item-name"]');
    this.itemPrices = page.locator('[data-test="inventory-item-price"]');
  }
  /**
   * Gets the 'Add to cart' or 'Remove' button locator for a specified product.
   * Can be used on both 'Products' and 'Shopping Cart' pages
   * @param product - Product data object.
   * @param button - Button type: 'add', 'remove'.
   * @returns Playwright locator for the product's 'Add to cart' or 'Remove' button.
   */
  getButton(product: Product, button: CartButtonAction) {
    const buttonText = button.toLowerCase().includes("add") ? "add-to-cart" : "remove";
    return this.page.locator(`[data-test="${buttonText}-${getProductId(product)}"]`);
  }

  /**
   * Gets the image locator for a specified product.
   * Can be used on both 'Products' and 'Shopping Cart' pages
   * @param product - Product data object.
   * @returns Playwright locator for the product's image.
   */
  getImage(product: Product, pageIdentifier: ProductsPage) {
    const itemImageSuffix = ""
    return this.page.locator(`[data-test="${itemImageSuffix}-${getProductId(product)}"]`);
  }
  /**
  * Removes a specific product from the cart by clicking its remove button.
  * Can be used on both 'Products' and 'Shopping Cart' pages
  * @param product - Product data object to remove.
  */
  async removeProduct(product: Product) {
    await this.getButton(product, "remove").click();
  }

  /**
   * Gets the number of occurrences of a product in the cart.
   * Can be used on both 'Products' and 'Shopping Cart' pages
   * @param product - Product data object.
   * @returns Promise resolving to the number of matching cart items.
   */
  async getProductCount(product: Product) {
    return await this.inventoryItems.filter({ hasText: product.name }).count();
  }

  /**
   * Retrieves the total count of item rows currently displayed in the cart.
   * Can be used on both 'Products' and 'Shopping Cart' pages
   * @returns Promise resolving to the number of cart items.
   */
  async getItemCount() {
    return this.inventoryItems.count();
  }
}
