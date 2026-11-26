import { Locator, Page } from "@playwright/test";
import { InternalPage } from "@pages/InternalPage";
import { ProductActionsComponent } from "@pages/components/ProductActionsComponent";
import type { Product, CartButtonAction } from "@data-types";

/**
 * Cart page class. 
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
   * @param product - Product data object with the name of the product to find.
   * @param action - Action type: 'add' or 'remove'.
   * @returns Playwright locator for the specific button.
   */
  getButton(product: Product, action: CartButtonAction): Locator {
    return this.productActions.getButton(product, action);
  }

  /**
   * Removes a specific product from the cart by clicking its remove button.
   * @param product - Product data object to remove.
   */
  async removeProduct(product: Product) {
    await this.productActions.removeProduct(product);
  }

  /**
   * Retrieves a locator for a specific cart item row based on the product name.
   * @param product - Product data object with the name of the product to find.
   * @returns Locator for the specific cart item.
   */
  getProductItem(product: Product): Locator {
    return this.productActions.getProductItem(product);
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
   * Retrieves the item price locator for specified product.
   * @param product - Product data object with the name of the product to find.
   * @returns Locator of the item price.
   */
  getItemPrice(product: Product): Locator {
    return this.productActions.getItemPrice(product);
  }

  /**
   * Retrieves the item description locator for specified product.
   * @param product - Product data object with the name of the product to find.
   * @returns Locator of the item description.
   */
  getItemDescription(product: Product): Locator {
    return this.productActions.getItemDescription(product);
  }

  /**
   * Retrieves the item quantity locator for the specified product.
   * @param product - Product data object with the name of the product to find.
   * @returns Locator of the item quantity.
   */
  getItemQuantity(product: Product): Locator {
    return this.productActions.getItemQuantity(product);
  }

  /**
   * Opens the selected product's detail page by clicking its item name link.
   * @param product - Product data object with the name of the product to find.
   */
  async openItemPage(product: Product) {
    await this.productActions.getItemName(product).click();
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
}
