import { test, expect } from "@fixtures/pages.fixture";
import { sumCurrencyAmounts, calculateTax, parseCurrencyToNumber } from "@utilities/index";

// Import test data
import products from "@data/products.json";
import shippingInfo from "@data/shipping.json";
import pricing from "@data/locale.json";

test.describe("7. Checkout page", () => {
  test.beforeEach(async ({ inventoryPage }) => {
    // Navigate directly to the products page using the pre-authenticated state
    await inventoryPage.open();
  });

  test("7.1 Completes checkout and verifies totals for multiple selected products", async ({
    inventoryPage,
    cartPage,
    checkoutStepOnePage,
    checkoutStepTwoPage,
  }) => {
    const productsList = [products[2], products[1], products[0]];
    const productsListCount = productsList.length;
    const productsListCountStr = productsListCount.toString();

    // Add multiple products to cart
    await inventoryPage.addProducts(productsList);

    // Verify cart badge count on 'Products' page
    await expect(inventoryPage.cartBadge, "Confirm cart badge count is valid").toHaveText(productsListCountStr);

    // Open shopping cart
    await inventoryPage.viewCart();

    // Verify cart page title
    await expect(cartPage.pageTitle, "Confirm page title is valid").toHaveText(cartPage.pageTitleText);

    // Verify cart badge count on 'Shopping Cart' page
    await expect(cartPage.cartBadge, "Confirm cart badge count is valid on 'Shopping Cart' page").toHaveText(
      productsListCountStr,
    );

    // Verify list of cart items count
    await expect(cartPage.inventoryItems, "Confirm list of cart items count is valid").toHaveCount(productsListCount);

    // Start checkout
    await cartPage.startCheckout();

    // Verify checkout step one page title
    await expect(checkoutStepOnePage.pageTitle, "Confirm page title is valid").toHaveText(checkoutStepOnePage.pageTitleText);

    // Fill shipping information and continue to overview page
    await checkoutStepOnePage.fillShippingInformation(shippingInfo[1]);
    await expect
      .poll(() => checkoutStepOnePage.shippingInformationFilled(shippingInfo[1]), "Confirm shipping info is filled")
      .toBe(true);

    // Click continue checkout
    await checkoutStepOnePage.continueCheckout();

    // Verify checkout step two page title
    await expect(checkoutStepTwoPage.pageTitle, "Confirm page title is valid").toHaveText(checkoutStepTwoPage.pageTitleText);

    // Verify subtotal, tax, and total amounts
    // 1. Verify Subtotal matches sum of product prices
    const expectedSubtotal = sumCurrencyAmounts(productsList.map((p) => p.price));
    await expect.poll(() => checkoutStepTwoPage.getSubtotal(), "Subtotal is not correct").toBe(expectedSubtotal);

    // 2. Verify Tax matches expected tax calculation (8% of subtotal)
    const expectedTax = calculateTax(expectedSubtotal, pricing);
    await expect.poll(() => checkoutStepTwoPage.getTax(), "Tax is not correct").toBe(expectedTax);

    // 3. Verify Total matches Subtotal + Tax
    const expectedTotal = await checkoutStepTwoPage.getCalculatedTotal(expectedSubtotal);
    await expect.poll(() => checkoutStepTwoPage.getTotal(), "Total is not correct").toBe(expectedTotal);
  });

  test("7.2 Completes checkout and verifies totals for no selected products", async ({
    inventoryPage,
    cartPage,
    checkoutStepOnePage,
    checkoutStepTwoPage,
  }) => {
    // Open shopping cart
    await inventoryPage.viewCart();

    // Verify cart page title
    await expect(cartPage.pageTitle, "Confirm page title is valid").toHaveText(cartPage.pageTitleText);

    // Verify cart badge is empty on 'Shopping Cart' page
    await expect(cartPage.cartBadge).toBeHidden();

    // Verify cart link on 'Shopping Cart' page has no numbers when all items are removed
    await expect(cartPage.cartLink, "Confirm cart link is empty on 'Shopping Cart' page").toHaveText("");

    // Start checkout
    await cartPage.startCheckout();

    // Verify checkout step one page title
    await expect(checkoutStepOnePage.pageTitle, "Confirm page title is valid").toHaveText(checkoutStepOnePage.pageTitleText);

    // Fill shipping information and continue to overview page
    await checkoutStepOnePage.fillShippingInformation(shippingInfo[1]);
    await expect
      .poll(() => checkoutStepOnePage.shippingInformationFilled(shippingInfo[1]), "Confirm shipping info is filled")
      .toBe(true);

    // Click continue checkout
    await checkoutStepOnePage.continueCheckout();

    // Verify checkout step two page title
    await expect(checkoutStepTwoPage.pageTitle, "Confirm page title is valid").toHaveText(checkoutStepTwoPage.pageTitleText);

    // Verify subtotal, tax, and total amounts
    // 1. Verify Subtotal is 0.00
    const expectedSubtotal = 0;
    await expect.poll(() => checkoutStepTwoPage.getSubtotal(), "Subtotal is not correct").toBe(expectedSubtotal);

    // 2. Verify Tax is 0.00
    const expectedTax = 0;
    await expect.poll(() => checkoutStepTwoPage.getTax(), "Tax is not correct").toBe(expectedTax);

    // 3. Verify Total is 0.00
    const expectedTotal = 0;
    await expect.poll(() => checkoutStepTwoPage.getTotal(), "Total is not correct").toBe(expectedTotal);
  });

  test("7.3 Completes checkout and verifies item name, price, quantity and description", async ({
    inventoryPage,
    cartPage,
    checkoutStepOnePage,
    checkoutStepTwoPage
  }) => {
    // Add multiple products to cart
    await inventoryPage.addProducts(products);

    // Open shopping cart
    await inventoryPage.viewCart();

    // Verify cart page title
    await expect(cartPage.pageTitle, "Confirm page title is valid").toHaveText(cartPage.pageTitleText);

    // Start checkout
    await cartPage.startCheckout();

    // Verify checkout step one page title
    await expect(checkoutStepOnePage.pageTitle, "Confirm page title is valid").toHaveText(checkoutStepOnePage.pageTitleText);

    // Fill shipping information and continue to overview page
    await checkoutStepOnePage.fillShippingInformation(shippingInfo[1]);
    await expect
      .poll(() => checkoutStepOnePage.shippingInformationFilled(shippingInfo[1]), "Confirm shipping info is filled")
      .toBe(true);

    // Click continue checkout
    await checkoutStepOnePage.continueCheckout();

    // Verify checkout step two page title
    await expect(checkoutStepTwoPage.pageTitle, "Confirm page title is valid").toHaveText(checkoutStepTwoPage.pageTitleText);

    // Loop through all products
    for (const product of products) {
      await expect(
        checkoutStepTwoPage.getItemName(product),
        `Item name '${product.name}' is matching the expected name`,
      ).toHaveText(product.name);

      await expect
        .poll(
          async () => parseCurrencyToNumber(await checkoutStepTwoPage.getItemPrice(product).textContent()),
          `Item price of '${product.name}' is matching the expected price`,
        )
        .toBe(product.price);

      await expect(
        checkoutStepTwoPage.getItemQuantity(product),
        `Item quantity of '${product.name}' is matching the expected quantity`,
      ).toHaveText("1");

      await expect(
        checkoutStepTwoPage.getItemDescription(product),
        `Item description of '${product.name}' is matching the expected description`,
      ).toHaveText(product.description);
    }
  });

  test("7.4 Complete checkout, open selected item and verify item page shows correct status of selected items", async ({
    inventoryPage,
    cartPage,
    checkoutStepOnePage,
    checkoutStepTwoPage,
    inventoryItemPage
  }) => {
    // Add multiple products to cart
    const productsList = [products[0], products[2], products[4]];
    await inventoryPage.addProducts(productsList);

    // Open shopping cart
    await inventoryPage.viewCart();

    // Verify cart page title
    await expect(cartPage.pageTitle, "Confirm page title is valid").toHaveText(cartPage.pageTitleText);

    // Start checkout
    await cartPage.startCheckout();

    // Verify checkout step one page title
    await expect(checkoutStepOnePage.pageTitle, "Confirm page title is valid").toHaveText(checkoutStepOnePage.pageTitleText);

    // Fill shipping information and continue to overview page
    await checkoutStepOnePage.fillShippingInformation(shippingInfo[1]);
    await expect
      .poll(() => checkoutStepOnePage.shippingInformationFilled(shippingInfo[1]), "Confirm shipping info is filled")
      .toBe(true);

    // Click continue checkout
    await checkoutStepOnePage.continueCheckout();

    // Verify checkout step two page title
    await expect(checkoutStepTwoPage.pageTitle, "Confirm page title is valid").toHaveText(checkoutStepTwoPage.pageTitleText);

    // Loop through selected products
    for (const product of productsList) {
      // Open product item page
      await inventoryPage.openItemPage(product);
      await expect.poll(() => inventoryItemPage.itemPageOpened(), "Confirm Inventory Item page is opened").toBe(true);

      const addToCartButton = inventoryItemPage.getButton(product, "add");
      const removeButton = inventoryItemPage.getButton(product, "remove");

      // Verify product status
      await expect(addToCartButton, `Add button for product: '${product.name}' is hidden`).toBeHidden();
      await expect(removeButton, `Remove button for product: '${product.name}' is visible`).toBeVisible();

      // Return to checkout step two page
      await checkoutStepTwoPage.open();
    }
  });

  test("7.5 Completes checkout, open selected item and verify item name, price and description", async ({
    inventoryPage,
    cartPage,
    checkoutStepOnePage,
    checkoutStepTwoPage,
    inventoryItemPage
  }) => {
    // Add multiple products to cart
    await inventoryPage.addProducts(products);

    // Open shopping cart
    await inventoryPage.viewCart();

    // Verify cart page title
    await expect(cartPage.pageTitle, "Confirm page title is valid").toHaveText(cartPage.pageTitleText);

    // Start checkout
    await cartPage.startCheckout();

    // Verify checkout step one page title
    await expect(checkoutStepOnePage.pageTitle, "Confirm page title is valid").toHaveText(checkoutStepOnePage.pageTitleText);

    // Fill shipping information and continue to overview page
    await checkoutStepOnePage.fillShippingInformation(shippingInfo[1]);
    await expect
      .poll(() => checkoutStepOnePage.shippingInformationFilled(shippingInfo[1]), "Confirm shipping info is filled")
      .toBe(true);

    // Click continue checkout
    await checkoutStepOnePage.continueCheckout();

    // Verify checkout step two page title
    await expect(checkoutStepTwoPage.pageTitle, "Confirm page title is valid").toHaveText(checkoutStepTwoPage.pageTitleText);

    // Loop through all products
    for (const product of products) {
      // Open product item page
      await inventoryPage.openItemPage(product);
      await expect.poll(() => inventoryItemPage.itemPageOpened(), "Confirm Inventory Item page is opened").toBe(true);

      await expect(inventoryItemPage.itemName, `Item name '${product.name}' is matching the expected name`).toHaveText(
        product.name,
      );
      await expect
        .poll(
          async () => parseCurrencyToNumber(await inventoryItemPage.itemPrice.textContent()),
          `Item price of '${product.name}' is matching the expected price`,
        )
        .toBe(product.price);

      await expect(
        inventoryItemPage.getItemImage(product),
        `Item image of '${product.name}' is matching the expected image URL`,
      ).toHaveAttribute("src", product.imageUrl);

      await expect(
        inventoryItemPage.itemDescription,
        `Item description of '${product.name}' is matching the expected description`,
      ).toHaveText(product.description);

      // Return to checkout step two page
      await checkoutStepTwoPage.open();
    }
  });
});
