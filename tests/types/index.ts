/**
 * Represents a SauceDemo product item.
 */
export interface Product {
    /** Unique slug identifier for the product */
    id: string;
    /** Full display name of the product */
    name: string;
    /** Detailed product description */
    description: string;
    /** Price of the product in USD */
    price: number;
    /** Static asset URL of the product image */
    imageUrl: string;
}


/**
 * Localized values for UI text and currency.
 */
export interface PricingConfig {
    /** Currency symbol displayed in the UI (e.g., "$") */
    currencySymbol: string;
    /** Tax rate as a decimal (e.g., 0.08 for 8%) */
    taxRate: number;
}

/**
 * Customer shipping information for checkout.
 */
export interface ShippingData {
    /** Customer first name */
    firstName: string;
    /** Customer last name */
    lastName: string;
    /** Customer postal or zip code */
    postalCode: string;
}

/**
 * Represents the action of a button in the shopping cart.
 */
export type CartButtonAction = "add" | "remove";