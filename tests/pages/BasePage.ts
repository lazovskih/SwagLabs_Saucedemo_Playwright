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
   * Open page by the page URL
   * @returns load state promise<void>
   */
  async open() {
    await this.page.goto(process.env.URL + this.pageUrl, { waitUntil: "domcontentloaded" });
    await this.isLoaded();
  }

  /**
   * Confirms page opened
   * @returns boolean true if page title match the opened page title
   */
  async pageIsOpened() {
    return (await this.pageTitle.textContent()) == this.pageTitleText;
  }

  /**
   * Wait for a page to load
   * @returns load state promise<void>
   */
  async isLoaded(): Promise<void> {
    return await this.page.waitForLoadState("load");
  }

  /**
   * Get current URL
   * @returns Promise<string>
   */
  async getCurrentUrl() {
    return this.page.url();
  }

  /**
   * Click on menu button
   */
  async clickMenuButton() {
    await this.mainMenuButton.click({ delay: 100, force: true });
    await this.sideMenu.isVisible();
  }

  /**
   * Click on "Logout" menu link
   */
  async clickLogoutMenu() {
    await this.clickMenuButton();
    await this.logoutMenu.click();
  }

  /**
   * Get the complete header text after finishing the order
   */
  async getCompleteHeaderText() {
    return await this.completeHeader.textContent();
  }

  /**
   * Safe click to make sure button is clickable and the page loaded
   * This method added to support flaky tests on webkit
   * @param locator locator of the button
   */
  async SafeClick(locator: Locator) {
    // 1. Ensure the element is attached to the DOM
    await locator.waitFor({ state: "attached", timeout: 3000 });
    await locator.waitFor({ state: "visible", timeout: 3000 });

    // 2. Explicitly scroll the element into view
    await locator.scrollIntoViewIfNeeded();

    // 3. Click the button locator
    await locator.click({ force: true });

    // 4. Wait until page is loaded
    await this.isLoaded();
  }
}
