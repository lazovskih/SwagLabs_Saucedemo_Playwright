import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "@pages/BasePage";

/**
 * Internal page.
 * Handles navigation and shared components across internal pages.
 */
export abstract class InternalPage extends BasePage {
  // Page locators
  private readonly mainMenuButton: Locator;
  private readonly sideMenu: Locator;
  // private readonly allItemsMenu: Locator;
  // private readonly aboutMenu: Locator;
  private readonly logoutMenu: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;

  constructor(page: Page) {
    super(page);
    this.mainMenuButton = page.locator('#react-burger-menu-btn');
    this.sideMenu = page.locator(".bm-menu");
    // this.allItemsMenu = page.locator('[data-test="inventory-sidebar-link"]');
    // this.aboutMenu = page.locator('[data-test="about-sidebar-link"]');
    this.logoutMenu = page.locator("#logout_sidebar_link");
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
  }

  /**
   * Clicks the main sidebar menu button.
   */
  async clickMenuButton() {
    // Implementation that works better for webkit browser and others
    await expect(async () => {
      await this.mainMenuButton.click();
      await expect(this.sideMenu).toBeVisible({ timeout: 1000 });
    }).toPass();
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
