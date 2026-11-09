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
   * Waits for the browser to complete the current rendering & paint cycle
   * so React synthetic event listeners and controlled inputs are fully mounted.
   */
  async waitForPageMount(): Promise<void> {
    await this.page.evaluate(
      () => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))),
    );
  }

  /**
   * Navigates to the page URL and waits for React mount completion.
   */
  async open() {
    await this.page.goto(this.pageUrl);
  }
}
