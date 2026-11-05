import { test as setup, expect } from "@playwright/test";
import { LoginPage } from "@pages/LoginPage";
import { InventoryPage } from "@pages/InventoryPage";
import { env } from "@utilities/index";

const authFile = "playwright/.auth/user.json";

setup("authenticate", async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    // 1. Open Login page, enter credentials, submit.
    await loginPage.login(env.standardUser, env.demoPassword);

    // 2. Verify no login error banner appeared and navigation succeeded
    await expect(
        loginPage.errorMessage,
        `[Auth Setup Failed for '${env.standardUser}']: Verify credentials in .env or CI secrets.`,
    ).toBeHidden();
    await expect(page).toHaveURL(new RegExp(inventoryPage.pageUrl), { timeout: 5000 });

    // 3. Save session state once successfully authenticated
    await page.context().storageState({ path: authFile });
});
