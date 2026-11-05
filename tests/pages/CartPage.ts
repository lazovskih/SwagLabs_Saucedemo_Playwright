import { Locator, Page } from "@playwright/test";
import { InternalPage } from "@pages/InternalPage";
import { ProductActionsComponent } from "@pages/components/ProductActionsComponent";
import type { Product, CartButtonAction } from "@data-types";
/**
 * Cart page.
 * Handles item summaries and order completion.
 */
export class CartPage extends InternalPage {
  pageTitleText = "Your Cart";
  pageUrl = "/cart.html";
  private readonly productActions: ProductActionsComponent;

  // Page locators
  readonly inventoryItems: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    super(page);
    this.productActions = new ProductActionsComponent(page);
    this.inventoryItems = this.productActions.inventoryItems;
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
  }

  /**
   * Returns the 'Add to cart' or 'Remove' button locator for a specific product.
   */
  getButton(product: Product, action: CartButtonAction): Locator {
    return this.productActions.getButton(product, action);
  }
  /**
   * Removes a specific product from the cart by clicking its remove button.
   * Can be used on both 'Products' and 'Shopping Cart' pages
   * @param product - Product data object to remove.
   */
  async removeProduct(product: Product) {
    await this.productActions.removeProduct(product);
  }

  /**
   * Clicks the checkout button to initiate the checkout flow.
   */
  async startCheckout() {
    await this.checkoutButton.click();
  }

  /**
   * Clicks the continue shopping button to return to the inventory page.
   */
  async continueShopping() {
    await this.continueShoppingButton.click();
  }

  /**
   * Gets the number of occurrences of a product in the cart.
   * Can be used on both 'Products' and 'Shopping Cart' pages
   * @param product - Product data object.
   * @returns Promise resolving to the number of matching cart items.
   */
  async getProductCount(product: Product) {
    return await this.productActions.getProductCount(product);
  }

  /**
   * Retrieves the total count of item rows currently displayed in the cart.
   * Can be used on both 'Products' and 'Shopping Cart' pages
   * @returns Promise resolving to the number of cart items.
   */
  async getItemCount() {
    return await this.productActions.getItemCount();
  }

  /**
   * Retrieves a locator for a specific cart item row based on the product name.
   * Can be used on both 'Products' and 'Shopping Cart' pages
   * @param product - Product data object with the name of the product to find.
   * @returns Promise resolving to a Locator for the specific cart item.
   */
  getProductItem(product: Product): Locator {
    return this.productActions.getProductItem(product);
  }
}
