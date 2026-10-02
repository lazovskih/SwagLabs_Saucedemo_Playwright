import { test, expect } from "@playwright/test";
import { ProductsPage } from "../pages/ProductsPage";
import { CartPage } from "../pages/CartPage";

// Import test data 
import products from "../../data/products.json";

test.describe("2. Shopping cart flow", () => {
  let productsPage: ProductsPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    productsPage = new ProductsPage(page);
    cartPage = new CartPage(page);

    // Navigate to the products page directly using the pre-authenticated session state
    await productsPage.open();
  });

  test("2.1 Adds selected products to the cart and verifies cart contents", async () => {
    // Verify cart link on 'Products' page has no numbers when opened first time
    await expect(productsPage.cartLink, "Confirm cart link is empty on 'Products' page").toHaveText("");

    // Add products to cart
    const productsList = [products[0], products[1]];
    await productsPage.addProductsToCart(productsList);

    // Verify cart badge count on 'Products' page
    await expect(productsPage.cartBadge, "Confirm cart badge count is valid on 'Products' page").toHaveText("2");

    // Open shopping cart
    await productsPage.viewCart();

    // Verify cart badge count on 'Shopping Cart' page
    await expect(cartPage.cartBadge, "Confirm cart badge count is valid on 'Shopping Cart' page").toHaveText("2");

    // Verify list of cart items count
    await expect(cartPage.inventoryItems, "Confirm list of cart items count is valid").toHaveCount(2);

    // Verify cart page title, then start checkout
    await expect(cartPage.pageTitle, "Confirm cart page title is valid").toHaveText(cartPage.pageTitleText);

    // Verify specific products present on the shopping cart page
    for (const product of productsList) {
      const productName = product.Name;
      const productElements = cartPage.inventoryItems.filter({ hasText: productName });
      await expect(productElements, "Confirm product '" + productName + "' is present on the shopping cart page").toHaveCount(1);
    }

    // Verify count on the shopping cart badge icon
    await expect(cartPage.cartBadge, "Confirm cart badge count is valid on 'Shopping Cart' page").toHaveText("2");
  });

  test("2.2 Button changes from 'Add to cart' to 'Remove' when clicked", async () => {
    const product = products[0];
    const addToCartButton = productsPage.getButton(product, "add to cart");
    const removeButton = productsPage.getButton(product, "remove");

    // Verify initial state
    await expect(addToCartButton).toBeVisible();
    await expect(removeButton).toBeHidden();

    // Click add to cart
    await addToCartButton.click();

    // Verify state changed
    await expect(addToCartButton).toBeHidden();
    await expect(removeButton).toBeVisible();
  });

  test("2.3 Button changes from 'Remove' to 'Add to cart' when clicked", async () => {
    // Loop through all products
    for (const product of products) {
      const addToCartButton = productsPage.getButton(product, "add");
      const removeButton = productsPage.getButton(product, "remove");

      // Add to cart first
      await addToCartButton.click();
      await expect(removeButton, `Remove button for product: '${product.Name}'`).toBeVisible();

      // Click remove
      await removeButton.click();

      // Verify state changed back
      await expect(removeButton).toBeHidden();
      await expect(addToCartButton).toBeVisible();
    }
  });

  test("2.4 Cart badge updates quantity correctly when items are added and removed", async () => {
    let expectedCount = 0;

    // Add all items and verify badge count increments
    for (const product of products) {
      const addToCartButton = productsPage.getButton(product, "add");
      await addToCartButton.click();
      expectedCount++;

      await expect(productsPage.cartBadge).toBeVisible();
      await expect(productsPage.cartBadge).toHaveText(expectedCount.toString());
    }

    // Remove all items and verify badge count decrements
    for (const product of products) {
      const removeButton = productsPage.getButton(product, "remove");
      await removeButton.click();
      expectedCount--;

      if (expectedCount === 0) {
        await expect(productsPage.cartBadge).toBeHidden();
      } else {
        await expect(productsPage.cartBadge).toHaveText(expectedCount.toString());
      }
    }

    // Verify cart link on 'Products' page has no numbers when all items are removed
    await expect(productsPage.cartLink, "Confirm cart link is empty on 'Products' page").toHaveText("");
  });

  test("2.5 Remove button on products page should not be present for items removed from cart", async () => {
    // Add product items
    const productsList = [products[0], products[1], products[2], products[3]];
    await productsPage.addProductsToCart(productsList);

    // Open shopping cart
    await productsPage.viewCart();

    // Verify cart page title, then start checkout
    await expect(cartPage.pageTitle).toHaveText(cartPage.pageTitleText);

    // Remove 2 items from the cart
    await cartPage.removeProduct(productsList[0]);
    await cartPage.removeProduct(productsList[1]);

    // Go back to products list
    await cartPage.continueShopping();

    // Verify that the "Remove" button is NOT present for those removed items
    for (let i = 0; i < 2; i++) {
      await expect(productsPage.getButton(productsList[i], "remove")).toBeHidden();
    }

    // Verify that the "Add to Cart" button is present for those removed items
    for (let i = 0; i < 2; i++) {
      await expect(productsPage.getButton(productsList[i], "add")).toBeVisible();
    }
  });
});
