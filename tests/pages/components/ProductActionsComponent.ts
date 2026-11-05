import { Locator, Page, expect } from "@playwright/test";
import type { Product, CartButtonAction } from "@data-types";
import { getProductId } from "@utilities/index";

export class ProductActionsComponent {
    readonly page: Page;

    // Component locators
    readonly inventoryItems: Locator;
    readonly itemNames: Locator;
    readonly itemPrices: Locator;

    constructor(page: Page) {
        this.page = page;
        this.inventoryItems = page.locator('[data-test="inventory-item"]');
        this.itemNames = page.locator('[data-test="inventory-item-name"]');
        this.itemPrices = page.locator('[data-test="inventory-item-price"]');
    }

    /**
     * Returns the 'Add to cart' or 'Remove' button locator for a specific product.
     */
    getButton(product: Product, action: CartButtonAction): Locator {
        const buttonPrefix = action === "add" ? "add-to-cart" : "remove";
        return this.page
            .locator(`[data-test="${buttonPrefix}-${getProductId(product)}"]`)
            .or(this.page.locator(`[data-test="${buttonPrefix}"]`));
    }

    /**
     * Returns the image locator for a specific product on either the Inventory page
     * ('inventory-item-<id>-img') or the Inventory Item detail page ('item-<id>-img').
     */
    getImage(product: Product): Locator {
        const productId = getProductId(product);
        return this.page
            .locator(`[data-test="inventory-item-${productId}-img"]`)
            .or(this.page.locator(`[data-test="item-${productId}-img"]`));
    }

    /**
     * Clicks 'Add to cart' for a single product and verifies the 'Remove' button appears.
     */
    async addProduct(product: Product) {
        await this.getButton(product, "add").click();
        await expect(this.getButton(product, "remove")).toBeVisible();
    }

    /**
     * Clicks 'Remove' for a single product.
     */
    async removeProduct(product: Product) {
        await this.getButton(product, "remove").click();
    }

    /**
     * Gets the number of occurrences of a product in the cart.
     * Can be used on both 'Products' and 'Shopping Cart' pages
     * @param product - Product data object.
     * @returns Promise resolving to the number of matching cart items.
     */
    async getProductCount(product: Product) {
        return await this.inventoryItems.filter({ hasText: product.name }).count();
    }

    /**
     * Retrieves the total count of item rows currently displayed in the cart.
     * Can be used on both 'Products' and 'Shopping Cart' pages
     * @returns Promise resolving to the number of cart items.
     */
    async getItemCount() {
        return await this.inventoryItems.count();
    }

    /**
     * Retrieves a locator for a specific cart item row based on the product name.
     * Can be used on both 'Products' and 'Shopping Cart' pages
     * @param product - Product data object with the name of the product to find.
     * @returns Promise resolving to a Locator for the specific cart item.
     */
    getProductItem(product: Product): Locator {
        return this.inventoryItems.filter({ hasText: product.name });
    }
}