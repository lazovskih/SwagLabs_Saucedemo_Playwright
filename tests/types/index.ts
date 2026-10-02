/**
 * Represents a SauceDemo product item.
 */
export interface Product {
    /** Unique slug identifier for the product */
    Id: string;
    /** Full display name of the product */
    Name: string;
    /** Detailed product description */
    Description: string;
    /** Price of the product in USD */
    Price: number;
    /** Static asset URL of the product image */
    imageUrl: string;
}

/**
 * Customer shipping information for checkout.
 */
export interface ShippingData {
    /** Customer first name */
    FirstName: string;
    /** Customer last name */
    LastName: string;
    /** Customer postal or zip code */
    PostalCode: string;
}

/**
 * Represents the action of a button in the shopping cart.
 */
export type CartButtonAction = "add" | "remove" | "add-to-cart";