import { Locator, Page } from "@playwright/test";
import { InternalPage } from "@pages/InternalPage";
import { ProductActionsComponent } from "@pages/components/ProductActionsComponent";
import type { Product, CartButtonAction } from "@data-types";

/**
 * Products page.
 * Handles product browsing and inventory interactions.
 */
export class InventoryPage extends InternalPage {
  pageTitleText = "Products";
  pageUrl = "/inventory.html";
  private readonly productActions: ProductActionsComponent;

  // Page locators
  readonly sortSelector: Locator;
  readonly inventoryItems: Locator;
  readonly itemName: Locator;
  readonly itemPrice: Locator;
  readonly itemDescription: Locator;

  constructor(page: Page) {
    super(page);
    this.productActions = new ProductActionsComponent(page);
    this.sortSelector = page.locator('[data-test="product-sort-container"]');
    this.inventoryItems = this.productActions.inventoryItems;
    this.itemName = this.productActions.itemName;
    this.itemPrice = this.productActions.itemPrice;
    this.itemDescription = this.productActions.itemDescription;
  }

  /**
   * Opens the specific product details page
   * @param product - Product data object with the name of the product to find.
   */
  async openItemPage(product: Product) {
    await this.getItemName(product).click();
  }

  /**
   * Returns the 'Add to cart' or 'Remove' button locator for a specific product.
   * @param product - Product data object with the name of the product to find.
   * @param action - Action type: 'add' or 'remove'.
   * @returns Playwright locator for the specific button.
   */
  getButton(product: Product, action: CartButtonAction): Locator {
    return this.productActions.getButton(product, action);
  }

  /**
   * Returns the image locator for a specific product on either the Inventory page
   * ('inventory-item-<id>-img') or the Inventory Item detail page ('item-<id>-img').
   * @param product - Product data object with the name of the product to find.
   */
  getImage(product: Product): Locator {
    return this.productActions.getImage(product);
  }

  /**
   * Adds a specified product to the shopping cart.
   * @param product - Product data object with the name of the product to find.
   */
  async addProduct(product: Product) {
    await this.productActions.addProduct(product);
  }

  /**
   * Sequentially adds multiple products to the shopping cart.
   * @param products - Array of product data objects to add.
   */
  async addProducts(products: Product[]) {
    for (const product of products) {
      await this.productActions.addProduct(product);
    }
  }

  /**
   * Removes a specific product from the cart by clicking its remove button.
   * @param product - Product data object with the name of the product to find.
   */
  async removeProduct(product: Product) {
    await this.productActions.removeProduct(product);
  }

  /**
   * Retrieves the item price locator for specified product.
   * @param product - Product data object with the name of the product to find.
   * @returns Locator of the item price.
   */
  getItemPrice(product: Product): Locator {
    return this.productActions.getItemPrice(product);
  }

  /**
   * Retrieves the item name locator for specified product.
   * @param product - Product data object with the name of the product to find.
   * @returns Locator of the item name.
   */
  getItemName(product: Product): Locator {
    return this.productActions.getItemName(product);
  }

  /**
   * Retrieves the item description locator for specified product.
   * @param product - Product data object with the name of the product to find.
   * @returns Locator of the item description.
   */
  getItemDescription(product: Product): Locator {
    return this.productActions.getItemDescription(product);
  }
}
