import { test as pages } from "@playwright/test";
import { LoginPage } from "@pages/LoginPage";
import { ProductsPage } from "@pages/ProductsPage";
import { CartPage } from "@pages/CartPage";
import { CheckoutStepOnePage } from "@pages/CheckoutStepOnePage";
import { CheckoutStepTwoPage } from "@pages/CheckoutStepTwoPage";
import { CheckoutCompletePage } from "@pages/CheckoutCompletePage";

pages("Set pages", async ({ page }) => {
    return {
        productPage: new ProductsPage(page),
        checkoutStepOnePage: new CheckoutStepOnePage(page),
        checkoutStepTwoPage: new CheckoutStepTwoPage(page),
        checkoutCompletePage: new CheckoutCompletePage(page),
        cartPage: new CartPage(page),
        loginPage: new LoginPage(page)
    }
});
