import { test, expect } from "../fixtures";
import { ProductsPage } from "../pages/ProductsPage";
import { CartPage } from "../pages/CartPage";
import { loadTestData, ProductData } from "../utilities/dataLoader";

const products = loadTestData<ProductData>("products");

test.describe("Shopping cart flow", () => {
  let productsPage: ProductsPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    productsPage = new ProductsPage(page);
    cartPage = new CartPage(page);

    // Navigate to the products page directly using the pre-authenticated session state
    await productsPage.open();
  });

  test("Adds selected products to the cart and verifies cart contents", async ({ page }) => {
    // Add products to cart
    await productsPage.addProductsToCart([products[0].Name, products[1].Name]);
    expect(await productsPage.getCartCount()).toBe(2);

    await productsPage.viewCart();
    if (!(await cartPage.pageIsOpened())) throw Error("Cart page did not open!");

    expect(await cartPage.getPageTitle()).toBe(cartPage.pageTitleText);
    expect(await cartPage.getProductCount(products[0].Name)).toBe(1);
    expect(await cartPage.getProductCount(products[1].Name)).toBe(1);
    expect(await cartPage.getItemCount()).toBe(2);
  });

  test("Button changes from 'Add to cart' to 'Remove' when clicked", async ({ page }) => {
    const productName = products[0].Name;

    const addToCartButton = await productsPage.getAddToCartButton(productName);
    const removeButton = await productsPage.getRemoveButton(productName);

    // Verify initial state
    await expect(addToCartButton).toBeVisible();
    await expect(removeButton).toBeHidden();

    // Click add to cart
    await addToCartButton.click();

    // Verify state changed
    await expect(addToCartButton).toBeHidden();
    await expect(removeButton).toBeVisible();
  });

  test("Button changes from 'Remove' to 'Add to cart' when clicked", async ({ page }) => {
    // Loop through all products
    for (const product of products) {
      const addToCartButton = await productsPage.getAddToCartButton(product.Name);
      const removeButton = await productsPage.getRemoveButton(product.Name);

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

  test("Cart badge updates quantity correctly when items are added and removed", async ({ page }) => {
    let expectedCount = 0;

    // Add all items and verify badge count increments
    for (const product of products) {
      const addToCartButton = await productsPage.getAddToCartButton(product.Name);
      await addToCartButton.click();
      expectedCount++;

      await expect(productsPage.cartBadge).toBeVisible();
      await expect(productsPage.cartBadge).toHaveText(expectedCount.toString());
    }

    // Remove all items and verify badge count decrements
    for (const product of products) {
      const removeButton = await productsPage.getRemoveButton(product.Name);
      removeButton.click();
      expectedCount--;

      if (expectedCount === 0) {
        await expect(productsPage.cartBadge).toBeHidden();
      } else {
        await expect(productsPage.cartBadge).toHaveText(expectedCount.toString());
      }
    }
  });

  test("Remove button on products page should not be present for items removed from cart", async ({ page }) => {
    // Add 3 items
    await productsPage.addProductsToCart([products[0].Name, products[1].Name, products[2].Name]);

    // Open Cart
    await productsPage.viewCart();
    if (!(await cartPage.pageIsOpened())) throw Error("Cart page did not open!");

    expect(await cartPage.getPageTitle()).toBe(cartPage.pageTitleText);

    // Remove 2 items from the cart
    await cartPage.removeProduct(products[0].Name);
    await cartPage.removeProduct(products[1].Name);

    // Go back to products list
    await cartPage.continueShopping();

    // Verify the "Remove" button is NOT present for those removed items
    for (let i = 0; i < 1; i++) {
      const button = await productsPage.getRemoveButton(products[i].Name);
      await expect(button).toBeHidden();
      console.log(`Remove button is hidden for product '${products[i].Name}'`);
    }
  });
});
