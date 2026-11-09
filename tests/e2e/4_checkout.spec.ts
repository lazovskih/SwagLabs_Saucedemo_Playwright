import { test, expect } from "@fixtures/pages.fixture";
import { sumCurrencyAmounts, calculateTax } from "@utilities/index";

// Import test data
import products from "@data/products.json";
import shippingInfo from "@data/shipping.json";
import pricing from "@data/locale.json";

test.describe("4. Checkout flow", () => {
  test.beforeEach(async ({ inventoryPage }) => {
    // Navigate directly to the products page using the pre-authenticated state
    await inventoryPage.open();
  });

  test("4.1 Completes checkout for a selected product", async ({
    inventoryPage,
    cartPage,
    checkoutStepOnePage,
    checkoutStepTwoPage,
    checkoutCompletePage,
  }) => {
    const productsList = [products[2]];
    const productsListCount = productsList.length;
    const productsListCountStr = productsListCount.toString();

    // Add product to cart
    await inventoryPage.addProductsToCart(productsList);

    // Verify cart badge count on 'Products' page
    await expect(inventoryPage.cartBadge, "Confirm cart badge count is valid on 'Products' page").toHaveText(
      productsListCountStr,
    );

    // Open shopping cart
    await inventoryPage.viewCart();

    // Verify cart page title
    await expect(cartPage.pageTitle).toHaveText(cartPage.pageTitleText);

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
    await checkoutStepOnePage.fillShippingInformation(shippingInfo[0]);
    await expect
      .poll(() => checkoutStepOnePage.shippingInformationFilled(shippingInfo[0]), "Confirm shipping info is filled")
      .toBe(true);

    // Click continue checkout
    await checkoutStepOnePage.continueCheckout();

    // Verify checkout step two page title
    await expect(checkoutStepTwoPage.pageTitle, "Confirm page title is valid").toHaveText(checkoutStepTwoPage.pageTitleText);

    // Finish order
    await checkoutStepTwoPage.finishOrder();

    // Verify checkout complete header and text
    await expect(checkoutCompletePage.completeHeader, "Confirm complete header is valid").toHaveText(
      checkoutCompletePage.completeHeaderText,
    );
    await expect(checkoutCompletePage.completeTextElement, "Confirm complete text is valid").toHaveText(
      checkoutCompletePage.completeText,
    );
  });

  test("4.2 Completes checkout and verifies totals for multiple selected products", async ({
    inventoryPage,
    cartPage,
    checkoutStepOnePage,
    checkoutStepTwoPage,
  }) => {
    const productsList = [products[2], products[1], products[0]];
    const productsListCount = productsList.length;
    const productsListCountStr = productsListCount.toString();

    // Add multiple products to cart
    await inventoryPage.addProductsToCart(productsList);

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
    // Calculate expected total based on subtotal and tax, then verify total

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

  test("4.3 Completes checkout and verifies totals for no selected products", async ({
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
    await expect(cartPage.cartLink, "Confirm cart link is empty on 'Products' page").toHaveText("");

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
});
