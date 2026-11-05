import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "@pages/BasePage";

export abstract class InternalPage extends BasePage {
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
   * Clicks the shopping cart link to navigate to the cart page.
   */
  async viewCart() {
    await this.cartLink.click();
  }
}
