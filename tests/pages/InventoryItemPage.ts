import { Locator, Page } from "@playwright/test";
import { InternalPage } from "@pages/InternalPage";
import { ProductActionsComponent } from "@pages/components/ProductActionsComponent";
import type { Product, CartButtonAction } from "@data-types";

/**
 * Inventory Item Page.
 * Exposes single item name, image and description
 */
export class InventoryItemPage extends InternalPage {
  pageTitleText = "Products";
  pageUrl = "/inventory-item.html";
  private readonly productActions: ProductActionsComponent;

  // Page locators
  readonly backToProductsButton: Locator;
  readonly itemDescription: Locator;
  readonly itemName: Locator;
  readonly itemPrice: Locator;

  constructor(page: Page) {
    super(page);
    this.productActions = new ProductActionsComponent(page);
    this.backToProductsButton = page.locator('[data-test="back-to-products"]');
    this.itemName = this.productActions.itemName;
    this.itemPrice = this.productActions.itemPrice;
    this.itemDescription = this.productActions.itemDescription;
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
   * @param product - Product data object.
   */
  getImage(product: Product): Locator {
    return this.productActions.getImage(product);
  }

  /**
   * Adds a specified product to the shopping cart and waits for the 'Remove' button to appear.
   * Can be used on both 'Products' page
   * @param product - Product data object to add.
   */
  async addProductToCart(product: Product) {
    await this.productActions.addProduct(product);
  }

  /**
   * Removes a specific product from the cart by clicking its remove button.
   * Can be used on both 'Products' and 'Shopping Cart' pages
   * @param product - Product data object to remove.
   */
  async removeProduct(product: Product) {
    await this.productActions.removeProduct(product);
  }
}
