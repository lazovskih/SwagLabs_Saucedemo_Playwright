import { test as setup } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { ProductsPage } from "../pages/ProductsPage";

const authFile = "playwright/.auth/user.json";

setup("authenticate", async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productsPage = new ProductsPage(page);

    await loginPage.open();
    await loginPage.login(process.env.STANDARD_USER!, process.env.DEMO_PASSWORD!);

    const pageUrlRegex = `.*${productsPage.pageUrl}`;
    const currentPageUrl = page.url();
    if (currentPageUrl.match(pageUrlRegex)) {
        await page.context().storageState({ path: authFile });
    } else {
        throw new Error(`Auth setup failed for user ${process.env.STANDARD_USER}. Current URL: ${currentPageUrl}, Expected URL: ${pageUrlRegex}`);
    }
});
