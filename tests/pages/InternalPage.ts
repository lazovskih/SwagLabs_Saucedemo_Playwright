import { Locator, Page } from "@playwright/test";
import { BasePage } from "@pages/BasePage";

/**
 * Internal page.
 * Handles navigation and shared components across internal pages.
 */
export abstract class InternalPage extends BasePage {
  // Page locators
  private readonly mainMenuButton: Locator;
  private readonly sideMenu: Locator;
  private readonly logoutMenu: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;

  constructor(page: Page) {
    super(page);
    this.mainMenuButton = page.locator('#react-burger-menu-btn');

    // In InternalPage.ts '.bm-menu-wrap[aria-hidden="false"]' targets React's open-menu state directly
    this.sideMenu = page.locator('.bm-menu-wrap[aria-hidden="false"]');

    this.logoutMenu = page.locator("#logout_sidebar_link");
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
  }

  /**
   * Clicks the main sidebar menu button and ensures the sidebar menu opens.
   */
  async clickMenuButton(): Promise<void> {
    await this.mainMenuButton.click();
    await this.sideMenu.waitFor({ state: "visible" });
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
