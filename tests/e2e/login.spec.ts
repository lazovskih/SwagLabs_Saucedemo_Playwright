import { test, expect } from "@fixtures/pages.fixture";
import { env } from "@utilities/index";
import type { LoginPage } from "@pages/LoginPage";

/**
 * Test suite for login functionality and access control.
 * Covers scenarios for valid and invalid login attempts, as well as logout behavior.
 */
test.use({ storageState: { cookies: [], origins: [] } });

/**
 * Login Test Scenarios for SauceDemo
 */
test.describe("1. Login page", () => {
  /**
   * Scenario 1: Login as standard user with valid password - successful
   * Verify "Products" page opened
   */
  test("1.1. Login with valid credentials - successful", async ({ page, loginPage, inventoryPage }) => {
    // Login with valid credentials
    await loginPage.login(env.standardUser, env.demoPassword);

    // Verify Products page is displayed
    await expect(page, "Confirm Products page is displayed").toHaveURL(inventoryPage.pageUrl);

    // Verify Products page title
    await expect(inventoryPage.pageTitle, "Confirm page title is valid").toHaveText(inventoryPage.pageTitleText);
  });

  /**
   * Scenario 3-4: Login as user with invalid credentials - unsuccessful
   * Verify internal pages are not accessible
   */
  const invalidLoginScenarios = [
    {
      title: "1.2. Login with valid username and invalid password - unsuccessful",
      username: env.standardUser,
      password: "invalid_password",
      getExpectedError: (loginPage: LoginPage) => loginPage.errorMessageText,
    },
    {
      title: "1.3. Login with invalid username and valid password - unsuccessful",
      username: "invalid_user",
      password: env.demoPassword,
      getExpectedError: (loginPage: LoginPage) => loginPage.errorMessageText,
    },
    {
      title: "1.4. Login with locked out username - unsuccessful",
      username: env.lockedOutUser,
      password: env.demoPassword,
      getExpectedError: (loginPage: LoginPage) => loginPage.lockedOutMessageText,
    },
  ];
  for (const { title, username, password, getExpectedError } of invalidLoginScenarios) {
    test(title, async ({ page, loginPage }) => {
      await loginPage.login(username, password);
      await expect(loginPage.errorMessage, "Error message should be visible").toBeVisible();
      await expect(loginPage.errorMessage, "Error message text should match").toHaveText(getExpectedError(loginPage));
      await expect(page, "Should remain on login page").toHaveURL(/.*\/$/);
    });
  }

  /**
   * Scenario 5: Login as standard user, logout, verify internal pages are not accessible
   */
  test("1.5. Login, logout, verify internal pages are not accessible", async ({
    page,
    loginPage,
    inventoryPage,
    internalPages,
  }) => {
    // Login with valid credentials
    await loginPage.login(env.standardUser, env.demoPassword);

    // Verify Products page is displayed
    await expect(page, "Confirm Products page is displayed").toHaveURL(inventoryPage.pageUrl);

    // Click logout
    await inventoryPage.clickLogoutMenu();

    // Verify redirected to login page
    await expect(page).toHaveURL(/.*\/$/);

    for (const internalPage of internalPages) {

      // Try to navigate directly to each internal page
      await internalPage.open();

      // Verify redirected back to login page 
      await expect(page).toHaveURL(/.*\/$/);

      // Verify error message is displayed with valid reference to page URL
      const noAccessMessageText = loginPage.noAccessMessageText.replace("{pageUrl}", internalPage.pageUrl);
      await expect(loginPage.errorMessage, "Error message should be visible").toBeVisible();
      await expect(loginPage.errorMessage, "Error message text should match").toHaveText(noAccessMessageText);
    }
  });
});
