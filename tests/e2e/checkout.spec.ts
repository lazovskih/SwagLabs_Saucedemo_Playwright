import { test, expect } from "../fixtures";
import { ProductsPage } from "../pages/ProductsPage";
import { CartPage } from "../pages/CartPage";
import { CheckoutStepOnePage } from "../pages/CheckoutStepOnePage";
import { CheckoutStepTwoPage } from "../pages/CheckoutStepTwoPage";
import { loadTestData, ProductData, ShippingData } from "../utilities/dataLoader";
import { CheckoutComplete } from "tests/pages/CheckoutComplete";

test.describe("Checkout flow", () => {
  let productsPage: ProductsPage;
  let cartPage: CartPage;
  let checkoutStepOnePage: CheckoutStepOnePage;
  let checkoutStepTwoPage: CheckoutStepTwoPage;
  let checkoutComplete: CheckoutComplete;
  let products: ProductData[];
  let shippingInfo: ShippingData[];

  test.beforeEach(async ({ page }) => {
    productsPage = new ProductsPage(page);
    cartPage = new CartPage(page);
    checkoutStepOnePage = new CheckoutStepOnePage(page);
    checkoutStepTwoPage = new CheckoutStepTwoPage(page);
    checkoutComplete = new CheckoutComplete(page);

    products = loadTestData<ProductData>("products");
    shippingInfo = loadTestData<ShippingData>("shipping");

    // Navigate directly to the products page using the pre-authenticated state
    await productsPage.open();
  });

  test("Completes checkout for a selected product", async ({}) => {
    // Add products to cart
    await productsPage.addProductToCart(products[2].Name);
    expect(await productsPage.getCartCount()).toBe(1);

    // View cart
    await productsPage.viewCart();

    expect(await cartPage.getPageTitle()).toBe(cartPage.pageTitleText);

    // Start checkout
    await cartPage.startCheckout();

    // Fill shipping information
    expect(await checkoutStepOnePage.getPageTitle()).toBe(checkoutStepOnePage.pageTitleText);

    // Fill shipping information and continue to overview page
    await checkoutStepOnePage.fillShippingInformation(shippingInfo[0]);
    expect(await checkoutStepTwoPage.getPageTitle()).toBe(checkoutStepTwoPage.pageTitleText);

    // Finish order
    await checkoutStepTwoPage.finishOrder();
    expect(await checkoutComplete.getCompleteHeaderText()).toBe(checkoutComplete.completeText);
  });

  test("Completes checkout and verifies totals for multiple selected products", async ({ page }) => {
    // Add multiple products to cart
    await productsPage.addProductsToCart([products[2].Name, products[1].Name]);
    expect(await productsPage.getCartCount()).toBe(2);

    // View cart
    await productsPage.viewCart();

    // Verify cart page title, then start checkout
    expect(await cartPage.getPageTitle()).toBe(cartPage.pageTitleText);
    await cartPage.startCheckout();

    // Verify checkout step one page title
    const checkoutPageTitle = await checkoutStepOnePage.getPageTitle();
    expect(checkoutPageTitle).toBe(checkoutStepOnePage.pageTitleText);

    // Fill shipping information and continue to overview page
    await checkoutStepOnePage.fillShippingInformation(shippingInfo[0]);

    // Scroll to bottom to ensure all elements are visible
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // Verify checkout step two page title
    expect(await checkoutStepTwoPage.getPageTitle()).toBe(checkoutStepTwoPage.pageTitleText);

    // Verify subtotal, tax, and total amounts
    const actualSubtotal = await checkoutStepTwoPage.getSubtotal();
    const expectedSubtotal = products[1].Price + products[2].Price;

    expect(actualSubtotal, "Subtotal is correct").toEqual(expectedSubtotal);

    // Calculate expected total based on subtotal and tax, then verify total
    const actualTax = await checkoutStepTwoPage.getTax();
    const expectedTotal = (expectedSubtotal + actualTax).toFixed(2);
    const actualTotal = (await checkoutStepTwoPage.getTotal()).toFixed(2);

    expect(actualTotal, "Total is correct").toEqual(expectedTotal);
  });
});
