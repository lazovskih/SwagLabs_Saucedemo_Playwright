import { Locator, Page } from "@playwright/test";
import { InternalPage } from "@pages/InternalPage";
import { ProductActionsComponent } from "@pages/components/ProductActionsComponent";
import type { Product, CartButtonAction } from "@data-types";

/**
 * Products page.
 * Handles product browsing and inventory interactions.
 */
export class InventoryPage extends InternalPage {
    pageTitleText = "Products";
    pageUrl = "/inventory.html";
    private readonly productActions: ProductActionsComponent;

    // Page locators
    readonly sortSelector: Locator;
    readonly inventoryItems: Locator;
    readonly itemNames: Locator;
    readonly itemPrices: Locator;

    constructor(page: Page) {
        super(page);
        this.productActions = new ProductActionsComponent(page);
        this.sortSelector = page.locator('[data-test="product-sort-container"]');
        this.inventoryItems = this.productActions.inventoryItems;
        this.itemNames = this.productActions.itemNames;
        this.itemPrices = this.productActions.itemPrices;
    }

    /**
     * Gets the 'Add to cart' or 'Remove' button locator for a specified product.
     * Can be used on both 'Products' and 'Shopping Cart' pages
     * @param product - Product data object.
     * @param action - action type: 'add', 'remove'.
     * @returns Playwright locator for the product's 'Add to cart' or 'Remove' button.
     */
    getButton(product: Product, action: CartButtonAction): Locator {
        return this.productActions.getButton(product, action);
    }

    /**
     * Returns the image locator for a specific product on either the Inventory page
     * ('inventory-item-<id>-img') or the Inventory Item detail page ('item-<id>-img').
     */
    getImage(product: Product): Locator {
        return this.productActions.getImage(product);
    }

    /**
     * Adds a specified product to the shopping cart and waits for the 'Remove' button to appear.
     * @param product - Product data object to add.
     */
    async addProductToCart(product: Product) {
        await this.productActions.addProduct(product);
    }

    /**
     * Sequentially adds multiple products to the shopping cart.
     * @param products - Array of product data objects to add.
     */
    async addProductsToCart(products: Product[]) {
        for (const product of products) {
            await this.productActions.addProduct(product);
        }
    }

    /**
     * Removes a specific product from the cart by clicking its remove button.
     * @param product - Product data object to remove.
     */
    async removeProduct(product: Product) {
        await this.productActions.removeProduct(product);
    }

    /**
     * Gets the number of occurrences of a product in the cart.
     * @param product - Product data object.
     * @returns Promise resolving to the number of matching cart items.
     */
    async getProductCount(product: Product) {
        return await this.productActions.getProductCount(product);
    }

    /**
    * Retrieves the total count of item rows currently displayed in the cart.
    * @returns Promise resolving to the number of cart items.
    */
    async getItemCount() {
        return await this.productActions.getItemCount();
    }
}

