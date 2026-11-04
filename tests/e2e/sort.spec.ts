import { test, expect } from "@playwright/test";
import { ProductsPage } from "@pages/ProductsPage";
import products from "@data/products.json";

test.describe("4. Sorting", () => {
  let productsPage: ProductsPage;

  test.beforeEach(async ({ page }) => {
    productsPage = new ProductsPage(page);

    // Navigate to the products page directly using the pre-authenticated session state
    await productsPage.open();
  });

  test("4.1 Sort product items by Name (A to Z)", async () => {
    const expectedNames = [...products]
      .sort((first, second) => first.name.localeCompare(second.name))
      .map((product) => product.name);

    await productsPage.sortSelector.selectOption("az");

    await expect(productsPage.itemNames).toHaveText(expectedNames);
  });

  test("4.2 Sort product items by Name (Z to A)", async () => {
    const expectedNames = [...products]
      .sort((first, second) => second.name.localeCompare(first.name))
      .map((product) => product.name);

    await productsPage.sortSelector.selectOption("za");

    await expect(productsPage.itemNames).toHaveText(expectedNames);
  });

  test("4.3 Sort product items by Price (low to high)", async () => {
    const expectedNames = [...products]
      .sort((first, second) => first.price - second.price || first.name.localeCompare(second.name))
      .map((product) => product.name);
    const expectedPrices = [...products]
      .sort((first, second) => first.price - second.price)
      .map((product) => `$${product.price.toFixed(2)}`);

    await productsPage.sortSelector.selectOption("lohi");

    await expect(productsPage.itemPrices).toHaveText(expectedPrices);
    await expect(productsPage.itemNames).toHaveText(expectedNames);
  });

  test("4.4 Sort product items by Price (high to low)", async () => {
    const expectedNames = [...products]
      .sort((first, second) => second.price - first.price || first.name.localeCompare(second.name))
      .map((product) => product.name);
    const expectedPrices = [...products]
      .sort((first, second) => second.price - first.price)
      .map((product) => `$${product.price.toFixed(2)}`);

    await productsPage.sortSelector.selectOption("hilo");

    await expect(productsPage.itemPrices).toHaveText(expectedPrices);
    await expect(productsPage.itemNames).toHaveText(expectedNames);
  });
});
