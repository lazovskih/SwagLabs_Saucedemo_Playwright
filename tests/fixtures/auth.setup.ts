import { test as setup, expect } from "@playwright/test";
import { LoginPage } from "@pages/LoginPage";
import { InventoryPage } from "@pages/InventoryPage";
import { env, formatAuthError } from "@utilities/index";

const authFile = "playwright/.auth/user.json";

setup("authenticate", async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    // 1. Open Login page, enter credentials, submit.
    await loginPage.login(env.standardUser, env.demoPassword);

    // 2. Auto-wait for navigation; when it fails, extract the on-screen error message
    try {
        await expect(page).toHaveURL(new RegExp(inventoryPage.pageUrl), { timeout: 5000 })
    } catch {
        const errorBanner = await loginPage.errorMessage.textContent().catch(() => null);
        throw new Error(formatAuthError(env.standardUser, inventoryPage.pageUrl, errorBanner));
    }

    // 3. Save session state once successfully authenticated
    await page.context().storageState({ path: authFile });
});
