import { test, expect } from "@fixtures/pages.fixture";
import { parseCurrencyToNumber } from "@utilities/index";

// Import test data
import products from "@data/products.json";

test.describe("6. Checkout page", () => {
    test.beforeEach(async ({ inventoryPage }) => {
        // Navigate directly to the products page using the pre-authenticated state
        await inventoryPage.open();
    });

    test("6.1 Cart page: verify cart page shows correct status of selected items", async ({
        inventoryPage,
        cartPage
    }) => {
        const productsList = [products[2], products[1], products[0]];

        // Add multiple products to cart
        await inventoryPage.addProducts(productsList);

        // Open shopping cart
        await inventoryPage.viewCart();

        // Verify cart page title
        await expect(cartPage.pageTitle, "Confirm cart page title is correct").toHaveText(cartPage.pageTitleText);

        // Verify total cart items count on the page
        await expect(cartPage.inventoryItems, "Confirm total cart items count").toHaveCount(productsList.length);

        // Loop through selected products
        for (const product of productsList) {
            const addToCartButton = cartPage.getButton(product, "add");
            const removeButton = cartPage.getButton(product, "remove");

            // Verify initial state
            await expect(addToCartButton, "Confirm add to cart button is not visible").toBeHidden();
            await expect(removeButton, "Confirm remove button is visible").toBeVisible();
        }
    });

    test("6.2 Cart page: verify item page shows correct status of selected items", async ({
        inventoryPage,
        cartPage
    }) => {
        const productsList = [products[2], products[1], products[0]];

        // Add multiple products to cart
        await inventoryPage.addProducts(productsList);

        // Open shopping cart
        await inventoryPage.viewCart();

        // Loop through selected products
        for (const product of productsList) {
            // Open product item page
            await cartPage.openItemPage(product);

            const addToCartButton = cartPage.getButton(product, "add");
            const removeButton = cartPage.getButton(product, "remove");

            // Verify initial state
            await expect(addToCartButton, "Confirm add to cart button is not visible").toBeHidden();
            await expect(removeButton, "Confirm remove button is visible").toBeVisible();

            // Open shopping cart
            await inventoryPage.viewCart();
        }
    });

    test("6.3 Cart page: Verifies item name, quantity and description", async ({
        inventoryPage,
        cartPage
    }) => {
        const productsList = [products[2], products[1], products[0]];

        // Add multiple products to cart
        await inventoryPage.addProducts(productsList);

        // Open shopping cart
        await inventoryPage.viewCart();

        // Loop through selected products
        for (const product of productsList) {

            await expect(
                cartPage.getItemName(product),
                `Item name '${product.name}' is matching the expected name`,
            ).toHaveText(product.name);

            await expect
                .poll(
                    async () => parseCurrencyToNumber(await cartPage.getItemPrice(product).textContent()),
                    `Item price of '${product.name}' is matching the expected price`,
                )
                .toBe(product.price);

            await expect(
                cartPage.getItemDescription(product),
                `Item description of '${product.name}' is matching the expected description`,
            ).toHaveText(product.description);

            // Open shopping cart
            await cartPage.viewCart();
        }
    });
});
