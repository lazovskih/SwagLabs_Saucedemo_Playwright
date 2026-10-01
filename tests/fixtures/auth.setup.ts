import { test as setup, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { ProductsPage } from "../pages/ProductsPage";

const authFile = "playwright/.auth/user.json";

setup("authenticate", async ({ page }) => {
    const username = process.env.STANDARD_USER;
    const password = process.env.DEMO_PASSWORD;

    // 1. Fail fast if environment variables are not configured
    if (!username || !password) {
        throw new Error(
            `[Auth Setup Error]: Missing credentials.\n` +
            `Please ensure STANDARD_USER and DEMO_PASSWORD are set in your .env file or environment variables.`
        );
    }

    const loginPage = new LoginPage(page);
    const productsPage = new ProductsPage(page);

    await loginPage.login(username, password);

    // 2. Auto-wait for navigation; if it fails, extract the on-screen error message
    try {
        await page.waitForURL(new RegExp(productsPage.pageUrl), { timeout: 5000 });
    } catch {
        const errorBanner = await loginPage.errorMessage.textContent().catch(() => null);
        throw new Error(
            `[Auth Setup Failed for '${username}']:\n` +
            (errorBanner ? `  Site Error: "${errorBanner.trim()}"\n` : `  Timed out navigating to '${productsPage.pageUrl}'.\n`) +
            `  Please verify credentials in your .env file or CI secrets.`
        );
    }

    // 3. Save session state once successfully authenticated
    await page.context().storageState({ path: authFile });
});
