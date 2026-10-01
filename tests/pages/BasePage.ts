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

  abstract primaryHeader: Locator;
  readonly completeHeader: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator('[data-test="title"]');
    this.mainMenuButton = page.locator('[data-test="open-menu"]');
    this.sideMenu = page.locator(".bm-menu");
    this.allItemsMenu = page.locator('[data-test="inventory-sidebar-link"]');
    this.AboutMenu = page.locator('[data-test="about-sidebar-link"]');
    this.logoutMenu = page.locator("#logout_sidebar_link");
    this.completeHeader = page.locator('[data-test="complete-header"]');
  }

  /**
   * Navigates to the page URL and waits for page load completion.
   * @returns Promise that resolves when navigation and load state are complete.
   */
  async open() {
    await this.page.goto(this.pageUrl, { waitUntil: "load" });
    await this.isLoaded();
  }

  /**
   * Confirms whether the page title matches the expected page title.
   * @returns Promise resolving to true if page title matches the expected title, false otherwise.
   */
  async pageIsOpened() {
    return (await this.pageTitle.textContent()) == this.pageTitleText;
  }

  /**
   * Waits for the page DOMContentLoaded event to fire.
   * @returns Promise that resolves when DOM content is loaded.
   */
  async isLoaded(): Promise<void> {
    return await this.page.waitForLoadState("domcontentloaded");
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
    await this.mainMenuButton.click({ delay: 100, force: true });
    await this.sideMenu.isVisible();
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
   * Retrieves the complete header text after finishing an order.
   * @returns Promise resolving to the header text content, or null if not found.
   */
  async getCompleteHeaderText() {
    return await this.completeHeader.textContent();
  }
}
