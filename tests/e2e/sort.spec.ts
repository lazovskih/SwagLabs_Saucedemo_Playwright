import { test, expect } from "@playwright/test";
import { ProductsPage } from "../pages/ProductsPage";
import products from "../../data/products.json";

test.describe("4. Sorting", () => {
  let productsPage: ProductsPage;

  test.beforeEach(async ({ page }) => {
    productsPage = new ProductsPage(page);

    // Navigate to the products page directly using the pre-authenticated session state
    await productsPage.open();
  });

  test("4.1 Sort product items by Name (A to Z)", async () => {
    const expectedNames = [...products]
      .sort((first, second) => first.Name.localeCompare(second.Name))
      .map((product) => product.Name);

    await productsPage.sortSelector.selectOption("az");

    await expect(productsPage.itemNames).toHaveText(expectedNames);
  });

  test("4.2 Sort product items by Name (Z to A)", async () => {
    const expectedNames = [...products]
      .sort((first, second) => second.Name.localeCompare(first.Name))
      .map((product) => product.Name);

    await productsPage.sortSelector.selectOption("za");

    await expect(productsPage.itemNames).toHaveText(expectedNames);
  });

  test("4.3 Sort product items by Price (low to high)", async () => {
    const expectedPrices = [...products]
      .sort((first, second) => first.Price - second.Price)
      .map((product) => `$${product.Price.toFixed(2)}`);

    await productsPage.sortSelector.selectOption("lohi");

    await expect(productsPage.itemPrices).toHaveText(expectedPrices);
  });

  test("4.4 Sort product items by Price (high to low)", async () => {
    const expectedPrices = [...products]
      .sort((first, second) => second.Price - first.Price)
      .map((product) => `$${product.Price.toFixed(2)}`);

    await productsPage.sortSelector.selectOption("hilo");

    await expect(productsPage.itemPrices).toHaveText(expectedPrices);
  });
});
