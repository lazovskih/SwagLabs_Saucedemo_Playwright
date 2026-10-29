import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import type { ShippingData } from "@data-types";

/**
 * Checkout Step One (information) page.
 * Handles shipping information form.
 */
export class CheckoutStepOnePage extends BasePage {
  pageTitleText = "Checkout: Your Information";
  pageUrl = "/checkout-step-one.html";

  // Page locators
  readonly firstNameField: Locator;
  readonly lastNameField: Locator;
  readonly postalCodeField: Locator;
  readonly continueButton: Locator;

  constructor(page: Page) {
    super(page);

    // Initialize locators using data-test attribute
    this.firstNameField = page.locator('[data-test="firstName"]');
    this.lastNameField = page.locator('[data-test="lastName"]');
    this.postalCodeField = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
  }

  /**
   * Fills the shipping information form fields (first name, last name, and postal code).
   * @param shippingData - Customer shipping information object.
   */
  async fillShippingInformation(shippingData: ShippingData) {
    await this.firstNameField.fill(shippingData.FirstName);
    await this.lastNameField.fill(shippingData.LastName);
    await this.postalCodeField.fill(shippingData.PostalCode);
  }

  /**
   * Clicks the continue button to proceed to the checkout overview step.
   */
  async continueCheckout() {
    await this.continueButton.click();
  }
}
