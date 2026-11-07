import { Locator, Page } from "@playwright/test";

export abstract class BasePage {
  readonly page: Page;
  abstract pageTitleText: string;
  abstract pageUrl: string;
  public pageTitle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator('[data-test="title"]');
  }

  /**
   * Navigates to the page URL and waits for page load completion.
   */
  async open() {
    await this.page.goto(this.pageUrl);
    await this.page.waitForLoadState("load");
  }
}
