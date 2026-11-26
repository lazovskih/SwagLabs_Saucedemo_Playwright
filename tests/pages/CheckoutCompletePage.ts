import { Locator, Page } from "@playwright/test";
import { InternalPage } from "@pages/InternalPage";
import { ProductActionsComponent } from "@pages/components/ProductActionsComponent";
/**
 * Checkout complete page.
 * Handles item summaries and order completion.
 */
export class CheckoutCompletePage extends InternalPage {
  pageTitleText = "Checkout: Complete!";
  pageUrl = "/checkout-complete.html";
  private readonly productActions: ProductActionsComponent;

  // Page locators
  readonly inventoryItems: Locator;
  readonly completeTextElement: Locator;
  readonly backHomeButton: Locator;

  readonly completeHeader: Locator;
  readonly completeHeaderText = "Thank you for your order!";
  readonly completeText = "Your order has been dispatched, and will arrive just as fast as the pony can get there!";

  constructor(page: Page) {
    super(page);
    this.productActions = new ProductActionsComponent(page);
    this.inventoryItems = this.productActions.inventoryItems;
    // Initialize locators using data-test attribute
    this.completeTextElement = page.locator('[data-test="complete-text"]');
    this.backHomeButton = page.locator('[data-test="back-home"]');
    this.completeHeader = page.locator('[data-test="complete-header"]');
  }

  /**
   * Clicks the 'Back Home' button to return to the inventory page.
   */
  async backHome() { await this.backHomeButton.click(); }
}
