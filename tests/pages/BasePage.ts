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
    return (await this.getPageTitle()) == this.pageTitleText;
  }

  /**
   * Wait for a page to load
   * @returns load state promise<void>
   */
  async isLoaded(): Promise<void> {
    return await this.page.waitForLoadState("load");
  }

  /**
   * Get page title text
   * @returns page title text
   */
  async getPageTitle() {
    await this.pageTitle.waitFor({ state: "attached" });
    await this.pageTitle.waitFor({ state: "visible" });
    return await this.pageTitle.textContent();
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
   * Clicks on cart badge icon to open 'View cart' page
   */
  async clickJS(locator: Locator) {
    // 1. Ensure the element is attached to the DOM
    await locator.waitFor({ state: "attached" });
    await locator.waitFor({ state: "visible", timeout: 1000 });

    // 2. Explicitly scroll the element into view
    await locator.scrollIntoViewIfNeeded();

    // 3. Dispatch a native JavaScript click event directly on the DOM node
    await locator.evaluate((el: HTMLElement) => {
      el.dispatchEvent(
        new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
          view: window,
        }),
      );
    });
  }
}
