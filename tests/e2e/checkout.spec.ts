import { test, expect } from "@playwright/test";
import { ProductsPage } from "../pages/ProductsPage";
import { CartPage } from "../pages/CartPage";
import { CheckoutStepOnePage } from "../pages/CheckoutStepOnePage";
import { CheckoutStepTwoPage } from "../pages/CheckoutStepTwoPage";
import { CheckoutComplete } from "../pages/CheckoutComplete";

// Import test data
import products from "../../data/products.json";
import shippingInfo from "../../data/shipping.json";

test.describe("3. Checkout flow", () => {
  let productsPage: ProductsPage;
  let cartPage: CartPage;
  let checkoutStepOnePage: CheckoutStepOnePage;
  let checkoutStepTwoPage: CheckoutStepTwoPage;
  let checkoutComplete: CheckoutComplete;

  test.beforeEach(async ({ page }) => {
    productsPage = new ProductsPage(page);
    cartPage = new CartPage(page);
    checkoutStepOnePage = new CheckoutStepOnePage(page);
    checkoutStepTwoPage = new CheckoutStepTwoPage(page);
    checkoutComplete = new CheckoutComplete(page);

    // Navigate directly to the products page using the pre-authenticated state
    await productsPage.open();
  });

  test("3.1 Completes checkout for a selected product", async () => {

    const productsList = [products[2]];
    const procuctsListCount = productsList.length;
    const procuctsListCountStr = procuctsListCount.toString();

    // Add product to cart
    await productsPage.addProductsToCart(productsList);

    // Verify cart badge count on 'Products' page
    await expect(productsPage.cartBadge, "Confirm cart badge count is valid on 'Products' page").toHaveText(procuctsListCountStr);

    // Open shopping cart
    await productsPage.viewCart();

    // Verify cart page title
    await expect(cartPage.pageTitle).toHaveText(cartPage.pageTitleText);

    // Verify cart badge count on 'Shopping Cart' page
    await expect(cartPage.cartBadge, "Confirm cart badge count is valid on 'Shopping Cart' page").toHaveText(procuctsListCountStr);

    // Verify list of cart items count
    await expect(cartPage.inventoryItems, "Confirm list of cart items count is valid").toHaveCount(procuctsListCount);

    // Start checkout
    await cartPage.startCheckout();

    // Verify checkout step one page title
    await expect(checkoutStepOnePage.pageTitle, "Confirm page title is valid").toHaveText(checkoutStepOnePage.pageTitleText);

    // Fill shipping information and continue to overview page
    await checkoutStepOnePage.fillShippingInformation(shippingInfo[0]);

    // Click continue checkout
    await checkoutStepOnePage.continueCheckout();

    // Verify checkout step two page title
    await expect(checkoutStepTwoPage.pageTitle, "Confirm page title is valid").toHaveText(checkoutStepTwoPage.pageTitleText);

    // Finish order
    await checkoutStepTwoPage.finishOrder();

    // Verify checkout complete header and text
    await expect(checkoutComplete.completeHeader, "Confirm complete header is valid").toHaveText(checkoutComplete.completeHeaderText);
    await expect(checkoutComplete.completeTextElement, "Confirm complete text is valid").toHaveText(checkoutComplete.completeText);
  });

  test("3.2 Completes checkout and verifies totals for multiple selected products", async () => {

    const productsList = [products[2], products[1], products[0]];
    const procuctsListCount = productsList.length;
    const procuctsListCountStr = procuctsListCount.toString();

    // Add multiple products to cart
    await productsPage.addProductsToCart(productsList);

    // Verify cart badge count on 'Products' page
    await expect(productsPage.cartBadge, "Confirm cart badge count is valid").toHaveText(procuctsListCountStr);

    // Open shopping cart
    await productsPage.viewCart();

    // Verify cart page title
    await expect(cartPage.pageTitle, "Confirm page title is valid").toHaveText(cartPage.pageTitleText);

    // Verify cart badge count on 'Shopping Cart' page
    await expect(cartPage.cartBadge, "Confirm cart badge count is valid on 'Shopping Cart' page").toHaveText(procuctsListCountStr);

    // Verify list of cart items count
    await expect(cartPage.inventoryItems, "Confirm list of cart items count is valid").toHaveCount(procuctsListCount);

    // Start checkout
    await cartPage.startCheckout();

    // Verify checkout step one page title
    await expect(checkoutStepOnePage.pageTitle, "Confirm page title is valid").toHaveText(checkoutStepOnePage.pageTitleText);

    // Fill shipping information and continue to overview page
    await checkoutStepOnePage.fillShippingInformation(shippingInfo[1]);

    // Click continue checkout
    await checkoutStepOnePage.continueCheckout();

    // Verify checkout step two page title
    await expect(checkoutStepTwoPage.pageTitle, "Confirm page title is valid").toHaveText(checkoutStepTwoPage.pageTitleText);

    // Verify subtotal, tax, and total amounts
    const actualSubtotal = await checkoutStepTwoPage.getSubtotal();
    const expectedSubtotal = productsList.reduce((acc, product) => acc + product.Price, 0);

    expect(actualSubtotal, "Subtotal is not correct").toEqual(expectedSubtotal);

    // Calculate expected total based on subtotal and tax, then verify total
    const actualTax = await checkoutStepTwoPage.getTax();
    const expectedTotal = (expectedSubtotal + actualTax).toFixed(2);
    const actualTotal = (await checkoutStepTwoPage.getTotal()).toFixed(2);

    expect(actualTotal, "Total is not correct").toEqual(expectedTotal);
  });
});
