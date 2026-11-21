import { Locator, Page } from "@playwright/test";
import { ProductActionsComponent } from "@pages/components/ProductActionsComponent";
import { InternalPage } from "./InternalPage";
import type { Product, CartButtonAction } from "@data-types";
/**
 * Inventory Item Page.
 * Exposes single item name, image and description.
 */
export class InventoryItemPage extends InternalPage {
  pageTitleText = "Products";
  pageUrl = "/inventory-item.html";
  private readonly productActions: ProductActionsComponent;

  // Page locators
  readonly backToProductsButton: Locator;
  readonly itemName: Locator;
  readonly itemPrice: Locator;
  readonly itemDescription: Locator;

  constructor(page: Page) {
    super(page);
    this.productActions = new ProductActionsComponent(page);
    this.backToProductsButton = page.locator('[data-test="back-to-products"]');
    this.itemName = this.productActions.itemName;
    this.itemPrice = this.productActions.itemPrice;
    this.itemDescription = this.productActions.itemDescription;
  }

  /**
   * Checks whether the Inventory Item details page is currently open
   * by verifying the URL pathname and 'Back to products' button visibility.
   * @returns Promise resolving to true if both conditions are met.
   */
  async itemPageOpened(): Promise<boolean> {
    const currentPathname = new URL(this.page.url()).pathname;
    const isUrlMatch = currentPathname === this.pageUrl;
    const isButtonVisible = await this.backToProductsButton.isVisible();
    return isUrlMatch && isButtonVisible;
  }

  /**
   * Navigates back to the Inventory page.
   */
  async backToProducts() {
    await this.backToProductsButton.click();
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
   */
  getImage(product: Product): Locator {
    return this.productActions.getImage(product);
  }

  /**
   * Adds a specified product to the shopping cart.
   * @param product - Product data object to add.
   */
  async addProduct(product: Product) {
    await this.productActions.addProduct(product);
  }

  /**
   * Removes a specific product from the cart by clicking its remove button.
   * @param product - Product data object to remove.
   */
  async removeProduct(product: Product) {
    await this.productActions.removeProduct(product);
  }
}
