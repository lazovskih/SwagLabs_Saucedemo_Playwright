import { test as setup } from "@playwright/test";
import { LoginPage } from "@pages/LoginPage";
import { InventoryPage } from "@pages/InventoryPage";
import { env } from "@utilities/index";

const authFile = "playwright/.auth/user.json";

setup("authenticate", async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    await loginPage.login(env.standardUser, env.demoPassword);

    // 2. Auto-wait for navigation; if it fails, extract the on-screen error message
    try {
        await page.waitForURL(new RegExp(inventoryPage.pageUrl), { timeout: 5000 });
    } catch {
        const errorBanner = await loginPage.errorMessage.textContent().catch(() => null);
        throw new Error(
            `[Auth Setup Failed for '${env.standardUser}']:\n` +
            (errorBanner ? `  Site Error: "${errorBanner.trim()}"\n` : `  Timed out navigating to '${inventoryPage.pageUrl}'.\n`) +
            `  Please verify credentials in your .env file or CI secrets.`
        );
    }

    // 3. Save session state once successfully authenticated
    await page.context().storageState({ path: authFile });
});
