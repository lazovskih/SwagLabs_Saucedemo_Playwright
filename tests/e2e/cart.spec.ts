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
    // Add products to cart
    await productsPage.addProductsToCart([products[0], products[1]]);
    expect(await productsPage.getCartCount()).toBe(2);

    // Open shopping cart
    await productsPage.viewCart();

    // Verify cart page title, then start checkout
    await expect(cartPage.pageTitle).toHaveText(cartPage.pageTitleText);

    // Verify specific products present on the shopping cart page
    expect(await cartPage.getProductCount(products[0])).toBe(1);
    expect(await cartPage.getProductCount(products[1])).toBe(1);

    // Verify count on the shopping cart badge icon
    expect(await cartPage.getItemCount()).toBe(2);
  });

  test("2.2 Button changes from 'Add to cart' to 'Remove' when clicked", async () => {
    const product = products[0];

    const addToCartButton = productsPage.getAddToCartButton(product);
    const removeButton = productsPage.getRemoveButton(product);

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
      const addToCartButton = productsPage.getAddToCartButton(product);
      const removeButton = productsPage.getRemoveButton(product);

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
      const addToCartButton = productsPage.getAddToCartButton(product);
      await addToCartButton.click();
      expectedCount++;

      await expect(productsPage.cartBadge).toBeVisible();
      await expect(productsPage.cartBadge).toHaveText(expectedCount.toString());
    }

    // Remove all items and verify badge count decrements
    for (const product of products) {
      const removeButton = productsPage.getRemoveButton(product);
      await removeButton.click();
      expectedCount--;

      if (expectedCount === 0) {
        await expect(productsPage.cartBadge).toBeHidden();
      } else {
        await expect(productsPage.cartBadge).toHaveText(expectedCount.toString());
      }
    }
  });

  test("2.5 Remove button on products page should not be present for items removed from cart", async () => {
    // Add 3 items
    const productsList = [products[0], products[1], products[2], products[3]];
    await productsPage.addProductsToCart(productsList);

    // Open shopping cart
    await productsPage.viewCart();

    // Verify cart page title, then start checkout
    expect(cartPage.pageTitle).toHaveText(cartPage.pageTitleText);

    // Remove 2 items from the cart
    await cartPage.removeProduct(productsList[0]);
    await cartPage.removeProduct(productsList[1]);

    // Go back to products list
    await cartPage.continueShopping();

    // Verify that the "Remove" button is NOT present for those removed items
    for (let i = 0; i < 2; i++) {
      await expect(productsPage.getRemoveButton(productsList[i])).toBeHidden();
    }

    // Verify that the "Add to Cart" button is present for those removed items
    for (let i = 0; i < 2; i++) {
      await expect(productsPage.getAddToCartButton(productsList[i])).toBeVisible();
    }
  });
});
