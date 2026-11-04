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
export type CartButtonAction = "add" | "remove" | "add-to-cart";