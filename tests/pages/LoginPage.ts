import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

/**
 * Login page.
 * Handles login form and authentication.
 */
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
  readonly lockedOutMessageText = "Epic sadface: Sorry, this user has been locked out.";

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
    await this.loginButton.click();
  }
}
