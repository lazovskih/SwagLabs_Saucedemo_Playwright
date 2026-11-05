import { test as base, expect } from "@playwright/test";
import { InternalPage } from "@pages/InternalPage";
import { LoginPage } from "@pages/LoginPage";
import { InventoryPage } from "@pages/InventoryPage";
import { InventoryItemPage } from "@pages/InventoryItemPage";
import { CartPage } from "@pages/CartPage";
import { CheckoutStepOnePage } from "@pages/CheckoutStepOnePage";
import { CheckoutStepTwoPage } from "@pages/CheckoutStepTwoPage";
import { CheckoutCompletePage } from "@pages/CheckoutCompletePage";

export interface PageFixtures {
    loginPage: LoginPage;
    inventoryPage: InventoryPage;
    inventoryItemPage: InventoryItemPage;
    cartPage: CartPage;
    checkoutStepOnePage: CheckoutStepOnePage;
    checkoutStepTwoPage: CheckoutStepTwoPage;
    checkoutCompletePage: CheckoutCompletePage;
    internalPages: InternalPage[];
}

export const test = base.extend<PageFixtures>({
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },
    inventoryPage: async ({ page }, use) => {
        await use(new InventoryPage(page));
    },
    inventoryItemPage: async ({ page }, use) => {
        await use(new InventoryItemPage(page));
    },
    cartPage: async ({ page }, use) => {
        await use(new CartPage(page));
    },
    checkoutStepOnePage: async ({ page }, use) => {
        await use(new CheckoutStepOnePage(page));
    },
    checkoutStepTwoPage: async ({ page }, use) => {
        await use(new CheckoutStepTwoPage(page));
    },
    checkoutCompletePage: async ({ page }, use) => {
        await use(new CheckoutCompletePage(page));
    },
    internalPages: async (
        {
            inventoryPage,
            inventoryItemPage,
            cartPage,
            checkoutStepOnePage,
            checkoutStepTwoPage,
            checkoutCompletePage,
        },
        use,
    ) => {
        await use([
            inventoryPage,
            inventoryItemPage,
            cartPage,
            checkoutStepOnePage,
            checkoutStepTwoPage,
            checkoutCompletePage,
        ]);
    },
});

export { expect };