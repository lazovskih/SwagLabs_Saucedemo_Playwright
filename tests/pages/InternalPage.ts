import { Locator, Page, expect } from "@playwright/test";
import type { Product, CartButtonAction } from "@data-types";
import { getProductId } from "@helpers/index";
import { BasePage } from "@pages/BasePage";

export class InternalPage extends BasePage {
  pageTitleText = "Internal pages";
  pageUrl = "";

  readonly cartLink: Locator;

  private readonly mainMenuButton: Locator;
  private readonly sideMenu: Locator;
  private readonly allItemsMenu: Locator;
  private readonly aboutMenu: Locator;
  private readonly logoutMenu: Locator;

  readonly inventoryItems: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    super(page);
    this.mainMenuButton = page.locator('[data-test="open-menu"]');
    this.sideMenu = page.locator(".bm-menu");
    this.allItemsMenu = page.locator('[data-test="inventory-sidebar-link"]');
    this.aboutMenu = page.locator('[data-test="about-sidebar-link"]');
    this.logoutMenu = page.locator("#logout_sidebar_link");
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');

    // Inventory items locator is used on both 'Products', 'Shopping Cart', 'Checkout' pages
    this.inventoryItems = page.locator('[data-test="inventory-item"]');
  }

  /**
   * Clicks the main sidebar menu button.
   */
  async clickMenuButton() {
    // Implementation that works better for webkit browser and others
    await this.mainMenuButton.click();
    await expect(this.sideMenu).toBeVisible()
  }

  /**
   * Opens the sidebar menu and clicks the "Logout" link.
   */
  async clickLogoutMenu() {
    await this.clickMenuButton();
    await this.logoutMenu.click();
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
   * Clicks the shopping cart link to navigate to the cart page.
   */
  async viewCart() {
    await this.cartLink.click();
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
