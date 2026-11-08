import { expect, Locator, Page } from "@playwright/test";
import { InternalPage } from "@pages/InternalPage";
import { InventoryItemPage } from "@pages/InventoryItemPage";
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
  private readonly inventoryItemPage: InventoryItemPage;

  // Page locators
  readonly sortSelector: Locator;
  readonly inventoryItems: Locator;
  readonly itemName: Locator;
  readonly itemPrice: Locator;
  readonly itemDescription: Locator;

  constructor(page: Page) {
    super(page);
    this.productActions = new ProductActionsComponent(page);
    this.inventoryItemPage = new InventoryItemPage(page);
    this.sortSelector = page.locator('[data-test="product-sort-container"]');
    this.inventoryItems = this.productActions.inventoryItems;
    this.itemName = this.productActions.itemName;
    this.itemPrice = this.productActions.itemPrice;
    this.itemDescription = page.locator('[data-test="inventory-item-desc"]');
  }

  /**
   * Opens the selected product details page
   * @param product - Product data object
   */
  async openItemPage(product: Product) {
    const productName = this.productActions.getProductItem(product).locator(this.itemName);

    await productName.locator("..").click();
    await expect(this.page).toHaveURL((url) => url.pathname === this.inventoryItemPage.pageUrl);
    await expect(this.inventoryItemPage.backToProductsButton).toBeVisible();
  }

  /**
   * Gets the 'Add to cart' or 'Remove' button locator for a specified product.
   * Can be used on both 'Products' and 'Shopping Cart' pages
   * @param product - Product data object.
   * @param action - action type: 'add', 'remove'.
   * @returns Playwright locator for the product's 'Add to cart' or 'Remove' button.
   */
  getButton(product: Product, action: CartButtonAction): Locator {
    return this.productActions.getButton(product, action);
  }

  /**
   * Returns the image locator for a specific product on either the Inventory page
   * ('inventory-item-<id>-img') or the Inventory Item detail page ('item-<id>-img').
   */
  getImage(product: Product): Locator {
    return this.productActions.getImage(product);
  }

  /**
   * Adds a specified product to the shopping cart and waits for the 'Remove' button to appear.
   * @param product - Product data object to add.
   */
  async addProductToCart(product: Product) {
    await this.productActions.addProduct(product);
  }

  /**
   * Sequentially adds multiple products to the shopping cart.
   * @param products - Array of product data objects to add.
   */
  async addProductsToCart(products: Product[]) {
    for (const product of products) {
      await this.productActions.addProduct(product);
    }
  }

  /**
   * Removes a specific product from the cart by clicking its remove button.
   * @param product - Product data object to remove.
   */
  async removeProduct(product: Product) {
    await this.productActions.removeProduct(product);
  }

  /**
   * Gets the number of occurrences of a product in the cart.
   * @param product - Product data object.
   * @returns Promise resolving to the number of matching cart items.
   */
  async getProductCount(product: Product) {
    return await this.productActions.getProductCount(product);
  }

  /**
   * Retrieves the total count of item rows currently displayed in the cart.
   * @returns Promise resolving to the number of cart items.
   */
  async getItemCount() {
    return await this.productActions.getItemCount();
  }

  /**
   * Retrieves the item price locator for specified product.
   * @returns Locator of the item price.
   */
  getItemPrice(product: Product) {
    return this.productActions.getProductItem(product).locator(this.itemPrice);
  }

  /**
   * Retrieves the item name locator for specified product.
   * @returns Locator of the item name.
   */
  getItemName(product: Product) {
    return this.productActions.getProductItem(product).locator(this.itemName);
  }

  /**
   * Retrieves the item description locator for specified product.
   * @returns Locator of the item description.
   */
  getItemDescription(product: Product) {
    return this.productActions.getProductItem(product).locator(this.itemDescription);
  }
}
