import { Locator, Page } from "@playwright/test";
import type { Product, CartButtonAction } from "@data-types";
import { getProductId } from "@utilities/index";;
import { InternalPage } from "@pages/InternalPage";

export class ProductActionsComponent extends InternalPage {
  readonly page: Page;
  pageTitleText = "";
  pageUrl = "";

  // Component locators
  readonly inventoryItems: Locator;
  readonly itemName: Locator;
  readonly itemPrice: Locator;
  readonly itemDescription: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.inventoryItems = page.locator('[data-test="inventory-item"]');
    this.itemName = page.locator('[data-test="inventory-item-name"]');
    this.itemPrice = page.locator('[data-test="inventory-item-price"]');
    this.itemDescription = page.locator('[data-test="inventory-item-desc"]');
  }

  /**
   * Returns the 'Add to cart' or 'Remove' button locator for a specific product.
   * @param product - Product data object with the name of the product to find.
   * @returns Promise resolving to a Locator for the specific buttonm.
   */
  getButton(product: Product, action: CartButtonAction): Locator {
    const buttonPrefix = action === "add" ? "add-to-cart" : "remove";
    return this.page
      .locator(`[data-test="${buttonPrefix}-${getProductId(product)}"]`)
      .or(this.page.locator(`[data-test="${buttonPrefix}"]`));
  }

  /**
   * Returns the image locator for a specific product on either the Inventory page
   * ('inventory-item-<id>-img') or the Inventory Item detail page ('item-<id>-img').
   * @param product - Product data object with the name of the product to find.
   */
  getImage(product: Product): Locator {
    const productId = getProductId(product);
    return this.page
      .locator(`[data-test="inventory-item-${productId}-img"]`)
      .or(this.page.locator(`[data-test="item-${productId}-img"]`));
  }

  /**
   * Clicks 'Add to cart' for a single product.
   * @param product - Product data object with the name of the product to find.
   */
  async addProduct(product: Product) {
    await this.getButton(product, "add").click();
  }

  /**
   * Clicks 'Remove' for a single product.
   * @param product - Product data object with the name of the product to find.
   */
  async removeProduct(product: Product) {
    await this.getButton(product, "remove").click();
  }

  /**
   * Retrieves a locator for a specific cart item row based on the product name.
   * Can be used on both 'Products' and 'Shopping Cart' pages
   * @param product - Product data object with the name of the product to find.
   * @returns Locator for the specific cart item.
   */
  getProductItem(product: Product): Locator {
    return this.inventoryItems.filter({ hasText: product.name });
  }

  /**
   * Retrieves the item name locator for specified product.
   * @param product - Product data object with the name of the product to find.
   * @returns Locator of the item name.
   */
  getItemName(product: Product): Locator {
    return this.getProductItem(product).locator(this.itemName);
  }

  /**
   * Retrieves the item price locator for specified product.
   * @param product - Product data object with the name of the product to find.
   * @returns Locator of the item price.
   */
  getItemPrice(product: Product): Locator {
    return this.getProductItem(product).locator(this.itemPrice);
  }

  /**
   * Retrieves the item description locator for specified product.
   * @param product - Product data object with the name of the product to find.
   * @returns Locator of the item description.
   */
  getItemDescription(product: Product): Locator {
    return this.getProductItem(product).locator(this.itemDescription);
  }
}
