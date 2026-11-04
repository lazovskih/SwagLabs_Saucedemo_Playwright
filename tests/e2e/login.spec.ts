import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { ProductsPage } from "../pages/ProductsPage";
import { CartPage } from "../pages/CartPage";
import { CheckoutStepOnePage } from "../pages/CheckoutStepOnePage";
import { CheckoutStepTwoPage } from "../pages/CheckoutStepTwoPage";
import { CheckoutCompletePage } from "../pages/CheckoutCompletePage";
import { InternalPage } from "../pages/InternalPage";

/**
 * Test suite for login functionality and access control.
 * Covers scenarios for valid and invalid login attempts, as well as logout behavior.
 */

test.use({ storageState: { cookies: [], origins: [] } });
/**
 * Login Test Scenarios for SauceDemo
 */
test.describe("1. Login page", () => {
  let loginPage: LoginPage;
  let productsPage: ProductsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    productsPage = new ProductsPage(page);

    // Navigate to login page
    await loginPage.open();
  });

  /**
   * Scenario 1: Login as standard user with valid password - successful
   * Verify "Products" page opened
   */
  test("1.1. Login with valid credentials - successful", async ({ page }) => {
    // Login with valid credentials
    await loginPage.login(process.env.STANDARD_USER!, process.env.DEMO_PASSWORD!);

    // Verify Products page is displayed
    await expect(page, "Confirm Products page is displayed").toHaveURL(productsPage.pageUrl);

    // Verify Products page title
    await expect(productsPage.pageTitle, "Confirm page title is valid").toHaveText(productsPage.pageTitleText);
  });

  /**
   * Scenario 2: Login as standard user with invalid password - unsuccessful
   * Verify error message displayed
   */
  test("1.2. Login with valid username and invalid password - unsuccessful", async ({ page }) => {
    // Login with invalid password
    await loginPage.login(process.env.STANDARD_USER!, "invalid_password");

    // Verify error message is displayed
    await expect(loginPage.errorMessage, "Error message should be visible").toBeVisible();
    await expect(loginPage.errorMessage, "Error message text should match").toHaveText(loginPage.errorMessageText);

    // Verify still on login page
    await expect(page, "Should be redirected to login page").toHaveURL(/.*\/$/);
  });

  /**
   * Scenario 3: Login with invalid username and valid password - unsuccessful
   * Verify error message displayed
   */
  test("1.3. Login with invalid username and valid password - unsuccessful", async ({ page }) => {
    // Login with locked out username and valid password
    await loginPage.login("invalid_user", process.env.DEMO_PASSWORD!);

    // Verify error message is displayed
    await expect(loginPage.errorMessage, "Error message should be visible").toBeVisible();
    await expect(loginPage.errorMessage, "Error message text should match").toHaveText(loginPage.errorMessageText);

    // Verify still on login page
    await expect(page, "Should be redirected to login page").toHaveURL(/.*\/$/);
  });

  /**
   * Scenario 4: Login with locked out user and valid password - unsuccessful
   * Verify error message displayed
   */
  test("1.4. Login with locked out username - unsuccessful", async ({ page }) => {
    // Login with locked out username and valid password
    await loginPage.login(process.env.LOCKED_OUT_USER!, process.env.DEMO_PASSWORD!);

    // Verify error message is displayed
    await expect(loginPage.errorMessage, "Error message should be visible").toBeVisible();
    await expect(loginPage.errorMessage, "Error message text should match").toHaveText(loginPage.lockedOutMessageText);

    // Verify still on login page
    await expect(page, "Should be redirected to login page").toHaveURL(/.*\/$/);
  });

  /**
   * Scenario 5: Login as standard user, logout, verify Products page not accessible
   */
  test("1.5. Login, logout, verify Products page not accessible", async ({ page }) => {
    // Login with valid credentials
    await loginPage.login(process.env.STANDARD_USER!, process.env.DEMO_PASSWORD!);

    // Verify Products page is displayed
    await expect(page, "Confirm Products page is displayed").toHaveURL(productsPage.pageUrl);

    // Click logout
    await productsPage.clickLogoutMenu();

    // Verify redirected to login page
    await expect(page).toHaveURL(/.*\/$/);

    const InternalPages: InternalPage[] = [
      new ProductsPage(page),
      new CheckoutStepOnePage(page),
      new CheckoutStepTwoPage(page),
      new CheckoutCompletePage(page),
      new CartPage(page),
    ];

    for (const internalPage of InternalPages) {
      // Try to navigate directly to internal page
      await page.goto(internalPage.pageUrl);

      // Verify redirected back to login page (not accessible)
      await expect(page).toHaveURL(/.*\/$/);

      const noAccessMessageText = loginPage.noAccessMessageText.replace("{pageUrl}", internalPage.pageUrl);

      await expect(loginPage.errorMessage, "Error message should be visible").toBeVisible();
      await expect(loginPage.errorMessage, "Error message text should match").toHaveText(noAccessMessageText);
    }
  });
});
