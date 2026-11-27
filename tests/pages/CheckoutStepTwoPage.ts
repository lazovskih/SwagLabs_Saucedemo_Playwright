import { Locator, Page } from "@playwright/test";
import { InternalPage } from "@pages/InternalPage";
import { parseCurrencyToNumber, sumCurrencyAmounts } from "@utilities/index";
import { ProductActionsComponent } from "@pages/components/ProductActionsComponent";
import type { Product } from "@data-types";

/**
 * Checkout Step Two (overview) page.
 * Handles item summaries and order completion.
 */
export class CheckoutStepTwoPage extends InternalPage {
  pageTitleText = "Checkout: Overview";
  pageUrl = "/checkout-step-two.html";
  private readonly productActions: ProductActionsComponent;

  // Checkout page elements - Step Two (overview)
  private readonly summarySubtotal: Locator;
  private readonly summaryTax: Locator;
  private readonly summaryTotal: Locator;
  private readonly cancelButton: Locator;
  private readonly finishButton: Locator;

  constructor(page: Page) {
    super(page);
    this.productActions = new ProductActionsComponent(page);

    // Step Two locators
    this.summarySubtotal = page.locator('[data-test="subtotal-label"]');
    this.summaryTax = page.locator('[data-test="tax-label"]');
    this.summaryTotal = page.locator('[data-test="total-label"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.finishButton = page.locator('[data-test="finish"]');
  }

  /**
* Opens the specific product details page
* @param product - Product data object with the name of the product to find.
*/
  async openItemPage(product: Product) {
    await this.productActions.getItemName(product).click();
  }

  /**
   * Retrieves and parses the summary subtotal into a numeric value.
   * @returns Formatted numeric value of the subtotal.
   */
  async getSubtotal(): Promise<number> {
    const rawText = await this.summarySubtotal.textContent();
    return parseCurrencyToNumber(rawText);
  }

  /**
   * Retrieves and parses the summary tax into a numeric value.
   * @returns Formatted numeric value of the tax amount.
   */
  async getTax(): Promise<number> {
    const rawText = await this.summaryTax.textContent();
    return parseCurrencyToNumber(rawText);
  }

  /**
   * Retrieves and parses the summary total into a numeric value.
   * @returns Formatted numeric value of the total amount.
   */
  async getTotal(): Promise<number> {
    const rawText = await this.summaryTotal.textContent();
    return parseCurrencyToNumber(rawText);
  }

  /**
   * Completes the order by clicking the finish button and waiting for page load.
   */
  async finishOrder() {
    await this.finishButton.click();
  }

  /**
   * Cancels the order by clicking the cancel button and waiting for page load.
   */
  async clickCancel() {
    await this.cancelButton.click();
  }

  /**
   * Calculates the expected total by summing the subtotal and displayed tax
   * using exact integer cents math.
   * @param subtotal - Optional pre-validated subtotal; if omitted, reads subtotal from the page.
   * @returns Calculated total amount (subtotal + tax).
   */
  async getCalculatedTotal(subtotal?: number): Promise<number> {
    const resolvedSubtotal = subtotal ?? (await this.getSubtotal());
    const actualTax = await this.getTax();
    return sumCurrencyAmounts([resolvedSubtotal, actualTax]);
  }

  /**
   * Retrieves the item price locator for specified product.
   * @param product - Product data object with the name of the product to find.
   * @returns Locator of the item price.
   */
  getItemPrice(product: Product): Locator {
    return this.productActions.getItemPrice(product);
  }

  /**
   * Retrieves the item name locator for specified product.
   * @param product - Product data object with the name of the product to find.
   * @returns Locator of the item name.
   */
  getItemName(product: Product): Locator {
    return this.productActions.getItemName(product);
  }

  /**
   * Retrieves the item description locator for specified product.
   * @param product - Product data object with the name of the product to find.
   * @returns Locator of the item description.
   */
  getItemDescription(product: Product): Locator {
    return this.productActions.getItemDescription(product);
  }

  /**
   * Retrieves the item quantity locator for the specified product
   * @param product - Product data object with the name of the product to find.
   * @returns Locator of the item quantity.
   */
  getItemQuantity(product: Product): Locator {
    return this.productActions.getItemQuantity(product);
  }
}
