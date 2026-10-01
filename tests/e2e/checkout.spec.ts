import { test, expect } from "@playwright/test";
import { ProductsPage } from "../pages/ProductsPage";
import { CartPage } from "../pages/CartPage";
import { CheckoutStepOnePage } from "../pages/CheckoutStepOnePage";
import { CheckoutStepTwoPage } from "../pages/CheckoutStepTwoPage";
import { CheckoutComplete } from "../pages/CheckoutComplete";

// Import test data
import products from "../../data/products.json";
import shippingInfo from "../../data/shipping.json";

test.describe("Checkout flow", () => {
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

  test("Completes checkout for a selected product", async () => {
    // Add products to cart
    await productsPage.addProductToCart(products[2]);
    expect(await productsPage.getCartCount()).toBe(1);

    // Open shopping cart
    await productsPage.viewCart();

    // Verify cart page title, then start checkout
    await expect(cartPage.pageTitle).toHaveText(cartPage.pageTitleText);

    // Start checkout
    await cartPage.startCheckout();
    await expect(checkoutStepOnePage.pageTitle).toHaveText(checkoutStepOnePage.pageTitleText);

    // Fill shipping information and continue to overview page
    await checkoutStepOnePage.fillShippingInformation(shippingInfo[0]);

    // Click continue checkout
    await checkoutStepOnePage.continueCheckout();

    await expect(checkoutStepTwoPage.pageTitle).toHaveText(checkoutStepTwoPage.pageTitleText);

    // Finish order
    await checkoutStepTwoPage.finishOrder();
    await expect(await checkoutComplete.getCompleteHeaderText()).toBe(checkoutComplete.completeText);
  });

  test("Completes checkout and verifies totals for multiple selected products", async ({ page }) => {
    // Add multiple products to cart
    await productsPage.addProductsToCart([products[2], products[1]]);
    expect(await productsPage.getCartCount()).toBe(2);

    // Open shopping cart
    await productsPage.viewCart();

    // Verify cart page title, then start checkout
    await expect(cartPage.pageTitle).toHaveText(cartPage.pageTitleText);
    await cartPage.startCheckout();

    // Verify checkout step one page title
    await expect(checkoutStepOnePage.pageTitle).toHaveText(checkoutStepOnePage.pageTitleText);

    // Fill shipping information and continue to overview page
    await checkoutStepOnePage.fillShippingInformation(shippingInfo[0]);

    // Click continue checkout
    await checkoutStepOnePage.continueCheckout();

    // Verify checkout step two page title
    await expect(checkoutStepTwoPage.pageTitle).toHaveText(checkoutStepTwoPage.pageTitleText);

    // Scroll to bottom to ensure all elements are visible
    // await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));// TODO: remove scroll

    // Verify subtotal, tax, and total amounts
    const actualSubtotal = await checkoutStepTwoPage.getSubtotal();
    const expectedSubtotal = products[1].Price + products[2].Price;

    await expect(actualSubtotal, "Subtotal is correct").toEqual(expectedSubtotal);

    // Calculate expected total based on subtotal and tax, then verify total
    const actualTax = await checkoutStepTwoPage.getTax();
    const expectedTotal = (expectedSubtotal + actualTax).toFixed(2);
    const actualTotal = (await checkoutStepTwoPage.getTotal()).toFixed(2);

    await expect(actualTotal, "Total is correct").toEqual(expectedTotal);
  });
});
