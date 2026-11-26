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
    await inventoryPage.addProducts(productsList);

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
});
