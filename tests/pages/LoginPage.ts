import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class LoginPage extends BasePage {
  pageTitleText = "Swag Labs";
  pageUrl = ""; // Resolves to baseURL, since this is the root (login) page.

  // Page locators
  readonly usernameField: Locator;
  readonly passwordField: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly pageTitle: Locator;

  readonly errorMessageText = "Epic sadface: Username and password do not match any user in this service";
  readonly noAccessMessageText = "Epic sadface: You can only access '/inventory.html' when you are logged in.";

  constructor(page: Page) {
    super(page);
    // Initialize locators using data-test attribute
    this.usernameField = page.locator('[data-test="username"]');
    this.passwordField = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
    this.pageTitle = page.locator("div.login_logo");
  }

  /**
   * Navigates to the login page and submits credentials.
   * @param username - Username credential.
   * @param password - Password credential.
   * @returns Promise that resolves when credentials have been submitted.
   */
  async login(username: string, password: string) {
    await this.open();

    await this.usernameField.fill(username);
    await this.passwordField.fill(password);
    await this.page.waitForLoadState();
    await this.loginButton.click();
  }

  /**
   * Attempts login using locked-out user credentials from environment variables.
   * @returns Promise that resolves when the login attempt completes.
   */
  async loginAsLockedOutUser() {
    await this.login(process.env.LOCKED_OUT_USER!, process.env.DEMO_PASSWORD!);
  }

  /**
   * Checks if the login error message banner is visible.
   * @returns Promise resolving to true if error message is visible, false otherwise.
   */
  async isErrorMessageVisible() {
    return await this.errorMessage.isVisible();
  }

  /**
   * Retrieves the text content from the login error message element.
   * @returns Promise resolving to the error message text, or null if not present.
   */
  async getErrorMessageText() {
    return await this.errorMessage.textContent();
  }
}
