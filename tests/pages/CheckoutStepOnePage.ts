import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import type { ShippingData } from "@data-types";

export class CheckoutStepOnePage extends BasePage {
  pageTitleText = "Checkout: Your Information";
  pageUrl = "/checkout-step-one.html";

  // Page locators
  readonly firstNameField: Locator;
  readonly lastNameField: Locator;
  readonly postalCodeField: Locator;
  readonly continueButton: Locator;
  readonly primaryHeader: Locator;

  constructor(page: Page) {
    super(page);
    // Initialize locators using data-test attribute
    this.firstNameField = page.locator('[data-test="firstName"]');
    this.lastNameField = page.locator('[data-test="lastName"]');
    this.postalCodeField = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.primaryHeader = page.locator('[data-test="title"]');
  }

  /**
   * Fill shipping information
   * @param firstName
   * @param lastName
   * @param postalCode
   */
  async fillShippingInformation(shippingData: ShippingData) {
    await this.firstNameField.fill(shippingData.FirstName);
    await this.lastNameField.fill(shippingData.LastName);
    await this.postalCodeField.fill(shippingData.PostalCode);
  }

  /**
   * Continue checkout
   */
  async continueCheckout() {
    await this.continueButton.click();
  }

  /**
   * Get complete header text
   * @returns Promise<string | null>
   */
  async getCompleteHeaderText() {
    return await this.completeHeader.textContent();
  }
}
