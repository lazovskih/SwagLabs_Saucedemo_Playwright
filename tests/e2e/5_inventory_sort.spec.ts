import { test, expect } from "@fixtures/pages.fixture";
// Import test data
import products from "@data/products.json";
import pricing from "@data/locale.json";

test.describe("5. Inventory page: Sorting items", () => {
  test.beforeEach(async ({ inventoryPage }) => {
    // Navigate to the products page directly using the pre-authenticated session state
    await inventoryPage.open();
  });

  test("5.1 Sort product items by Name (A to Z)", async ({ inventoryPage }) => {
    const expectedNames = [...products]
      .sort((first, second) => first.name.localeCompare(second.name))
      .map((product) => product.name);

    await inventoryPage.sortSelector.selectOption("az");

    await expect(inventoryPage.itemName).toHaveText(expectedNames);
  });

  test("5.2 Sort product items by Name (Z to A)", async ({ inventoryPage }) => {
    const expectedNames = [...products]
      .sort((first, second) => second.name.localeCompare(first.name))
      .map((product) => product.name);

    await inventoryPage.sortSelector.selectOption("za");

    await expect(inventoryPage.itemName).toHaveText(expectedNames);
  });

  test("5.3 Sort product items by Price (low to high)", async ({ inventoryPage }) => {
    const expectedNames = [...products]
      .sort((first, second) => first.price - second.price || first.name.localeCompare(second.name))
      .map((product) => product.name);
    const expectedPrices = [...products]
      .sort((first, second) => first.price - second.price)
      .map((product) => `${pricing.currencySymbol}${product.price.toFixed(2)}`);

    await inventoryPage.sortSelector.selectOption("lohi");

    await expect(inventoryPage.itemPrice).toHaveText(expectedPrices);
    await expect(inventoryPage.itemName).toHaveText(expectedNames);
  });

  test("5.4 Sort product items by Price (high to low)", async ({ inventoryPage }) => {
    const expectedNames = [...products]
      .sort((first, second) => second.price - first.price || first.name.localeCompare(second.name))
      .map((product) => product.name);
    const expectedPrices = [...products]
      .sort((first, second) => second.price - first.price)
      .map((product) => `${pricing.currencySymbol}${product.price.toFixed(2)}`);

    await inventoryPage.sortSelector.selectOption("hilo");

    await expect(inventoryPage.itemPrice).toHaveText(expectedPrices);
    await expect(inventoryPage.itemName).toHaveText(expectedNames);
  });
});
