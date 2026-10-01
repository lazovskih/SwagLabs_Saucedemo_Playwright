import { Locator, Page } from "@playwright/test";

export abstract class BasePage {
  readonly page: Page;
  abstract pageTitleText: string;
  abstract pageUrl: string;
  readonly pageTitle: Locator;

  private readonly mainMenuButton: Locator;
  private readonly sideMenu: Locator;
  private readonly allItemsMenu: Locator;
  private readonly AboutMenu: Locator;
  private readonly logoutMenu: Locator;

  readonly cartBadge: Locator;
  readonly cartLink: Locator;

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
  }

  /**
   * Navigates to the page URL and waits for page load completion.
   * @returns Promise that resolves when navigation and load state are complete.
   */
  async open() {
    await this.page.goto(this.pageUrl, { waitUntil: "domcontentloaded" });
    await this.isLoaded();
  }

  /**
   * Waits for the "load" event to fire.
   * @returns Promise that resolves when DOM content is loaded.
   */
  async isLoaded(): Promise<void> {
    return await this.page.waitForLoadState("load");
  }

  /**
   * Retrieves the current page URL.
   * @returns Promise resolving to the current URL string.
   */
  async getCurrentUrl() {
    return this.page.url();
  }

  /**
   * Clicks the main sidebar menu button.
   * @returns Promise that resolves when the menu button is clicked.
   */
  async clickMenuButton() {
    // Implementation that works better for webkit browser and others
    await this.mainMenuButton.click({ delay: 100, force: true });
    // await this.sideMenu.isVisible(); // TODO: remove
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
}
