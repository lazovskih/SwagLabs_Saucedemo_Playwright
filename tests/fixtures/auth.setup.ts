import { test as setup } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";

const authFile = "playwright/.auth/user.json";

setup("authenticate", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.usernameField.fill(process.env.STANDARD_USER!);
    await loginPage.passwordField.fill(process.env.DEMO_PASSWORD!);
    await loginPage.loginButton.click();

    // Ensure login is finished before writing storage state
    await page.waitForURL(/.*inventory.html/);

    await page.context().storageState({ path: authFile });
});
