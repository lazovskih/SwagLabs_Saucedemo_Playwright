import { test, expect } from "@fixtures/pages.fixture";

// Import test data 
import products from "@data/products.json";

test.describe("2. Shopping cart flow", () => {

  test.beforeEach(async ({ inventoryPage }) => {

    // Navigate to the products page directly using the pre-authenticated session state
    await inventoryPage.open();
  });

  test("2.1 Adds selected products to the cart and verifies cart contents", async ({ inventoryPage, cartPage }) => {
    // Verify cart link on 'Products' page has no numbers when opened first time
    await expect(inventoryPage.cartLink, "Confirm cart link is empty on 'Products' page").toHaveText("");

    // Add products to cart
    const productsList = [products[0], products[1]];
    await inventoryPage.addProductsToCart(productsList);

    // Verify cart badge count on 'Products' page
    await expect(inventoryPage.cartBadge, "Confirm cart badge count is valid on 'Products' page").toHaveText("2");

    // Open shopping cart
    await inventoryPage.viewCart();

    // Verify cart badge count on 'Shopping Cart' page
    await expect(cartPage.cartBadge, "Confirm cart badge count is valid on 'Shopping Cart' page").toHaveText("2");

    // // Verify list of cart items count
    // await expect(cartPage.inventoryItems, "Confirm list of cart items count is valid").toHaveCount(2);

    // Verify cart page title
    await expect(cartPage.pageTitle, "Confirm cart page title is valid").toHaveText(cartPage.pageTitleText);

    // Verify total cart items count on the page
    await expect
      .poll(() => cartPage.getItemCount(), "Confirm total cart items count")
      .toBe(productsList.length);

    // Verify specific products present on the shopping cart page
    for (const product of productsList) {
      await expect(cartPage.getProductItem(product), `Confirm product '${product.name}' is present on the shopping cart page`).toHaveCount(1);
    }
  });

  test("2.2 Button changes from 'Add to cart' to 'Remove' when clicked", async ({ inventoryPage }) => {
    const product = products[0];
    const addToCartButton = inventoryPage.getButton(product, "add");
    const removeButton = inventoryPage.getButton(product, "remove");

    // Verify initial state
    await expect(addToCartButton).toBeVisible();
    await expect(removeButton).toBeHidden();

    // Click add to cart
    await addToCartButton.click();

    // Verify state changed
    await expect(addToCartButton).toBeHidden();
    await expect(removeButton).toBeVisible();
  });

  test("2.3 Button changes from 'Remove' to 'Add to cart' when clicked", async ({ inventoryPage }) => {
    // Loop through all products
    for (const product of products) {
      const addToCartButton = inventoryPage.getButton(product, "add");
      const removeButton = inventoryPage.getButton(product, "remove");

      // Add to cart first
      await addToCartButton.click();
      await expect(removeButton, `Remove button for product: '${product.name}'`).toBeVisible();

      // Click remove
      await removeButton.click();

      // Verify state changed back
      await expect(removeButton).toBeHidden();
      await expect(addToCartButton).toBeVisible();
    }
  });

  test("2.4 Cart badge updates quantity correctly when items are added and removed", async ({ inventoryPage }) => {
    let expectedCount = 0;

    // 1. Add all items and verify badge count increments
    for (const product of products) {
      await inventoryPage.addProductToCart(product);
      expectedCount++;

      await expect(inventoryPage.cartBadge).toBeVisible();
      await expect(inventoryPage.cartBadge).toHaveText(expectedCount.toString());
    }

    // 2. Remove all but the last item and verify badge count decrements (5 -> 1)
    for (const product of products.slice(0, -1)) {
      await inventoryPage.removeProduct(product);
      expectedCount--;

      await expect(inventoryPage.cartBadge).toHaveText(expectedCount.toString());
    }

    // 3. Remove the final item and verify the badge disappears completely
    await inventoryPage.removeProduct(products[products.length - 1]);
    await expect(inventoryPage.cartBadge).toBeHidden();

    // Verify cart link on 'Products' page has no numbers when all items are removed
    await expect(inventoryPage.cartLink, "Confirm cart link is empty on 'Products' page").toHaveText("");
  });

  test("2.5 Remove button on products page should not be present for items removed from cart", async ({ inventoryPage, cartPage }) => {
    // Add product items
    const productsList = [products[0], products[1], products[2], products[3]];
    await inventoryPage.addProductsToCart(productsList);

    // Open shopping cart
    await inventoryPage.viewCart();

    // Verify cart page title
    await expect(cartPage.pageTitle).toHaveText(cartPage.pageTitleText);

    // Remove 2 items from the cart
    await cartPage.removeProduct(productsList[0]);
    await cartPage.removeProduct(productsList[1]);

    // Go back to products list
    await cartPage.continueShopping();

    // Verify that the "Remove" button is NOT present for those removed items
    for (let i = 0; i < 2; i++) {
      await expect(inventoryPage.getButton(productsList[i], "remove")).toBeHidden();
    }

    // Verify that the "Add to Cart" button is present for those removed items
    for (let i = 0; i < 2; i++) {
      await expect(inventoryPage.getButton(productsList[i], "add")).toBeVisible();
    }
  });
});
