import { Locator, Page } from "@playwright/test";
import { Product } from "@data-types";
import { getProductId } from "@helpers/index";

export abstract class BasePage {
  readonly page: Page;
  abstract pageTitleText: string;
  abstract pageUrl: string;

  readonly pageTitle: Locator;
  readonly cartLink: Locator;

  private readonly mainMenuButton: Locator;
  private readonly sideMenu: Locator;
  private readonly allItemsMenu: Locator;
  private readonly AboutMenu: Locator;
  private readonly logoutMenu: Locator;

  readonly inventoryItems: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator('[data-test="title"]');
    this.mainMenuButton = page.locator('[data-test="open-menu"]');
    this.sideMenu = page.locator(".bm-menu");
    this.allItemsMenu = page.locator('[data-test="inventory-sidebar-link"]');
    this.AboutMenu = page.locator('[data-test="about-sidebar-link"]');
    this.logoutMenu = page.locator("#logout_sidebar_link");
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');

    // Inventory items locator is used on both 'Products', 'Shopping Cart', 'Checkout' pages
    this.inventoryItems = page.locator('[data-test="inventory-item"]');
  }

  /**
   * Navigates to the page URL and waits for page load completion.
   * @returns Promise that resolves when navigation and load state are complete.
   */
  async open() {
    await this.page.goto(this.pageUrl, { waitUntil: "domcontentloaded" });
    await this.page.waitForLoadState("load");
  }

  /**
   * Clicks the main sidebar menu button.
   * @returns Promise that resolves when the menu button is clicked.
   */
  async clickMenuButton() {
    // Implementation that works better for webkit browser and others
    await this.mainMenuButton.click({ delay: 100, force: true });
    await this.sideMenu.waitFor({ state: "visible" });
  }

  /**
   * Opens the sidebar menu and clicks the "Logout" link.
   * @returns Promise that resolves when the logout link is clicked.
   */
  async clickLogoutMenu() {
    await this.clickMenuButton();
    await this.logoutMenu.click();
  }

  /**
   * Gets the 'Add to cart' or 'Remove' button locator for a specified product.
   * Can be used on both 'Products' and 'Shopping Cart' pages
   * @param product - Product data object.
   * @returns Playwright locator for the product's 'Add to cart' or 'Remove' button.
   */
  getButton(product: Product, button: string) {
    const buttonText = button.toLowerCase().trim().includes("remove") ? "remove" : "add-to-cart";
    return this.page.locator(`[data-test="${buttonText}-${getProductId(product)}"]`);
  }

  /**
   * Clicks the shopping cart link to navigate to the cart page.
   * @returns Promise that resolves when the shopping cart link is clicked.
   */
  async viewCart() {
    await this.cartLink.click();
  }

  /**
   * Removes a specific product from the cart by clicking its remove button.
   * Can be used on both 'Products' and 'Shopping Cart' pages
   * @param product - Product data object to remove.
   * @returns Promise that resolves when the remove button is clicked.
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
    return await this.inventoryItems.filter({ hasText: product.Name }).count();
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
