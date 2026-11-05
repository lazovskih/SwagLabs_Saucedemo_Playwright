import { ProductsPage } from "./ProductsPage";
import { Locator, Page } from "@playwright/test";
import { Product } from "@data-types";

/**
 * Products page.
 * Handles product browsing and inventory interactions.
 */
export class InventoryItemPage extends ProductsPage {
    pageTitleText = "Products";
    pageUrl = "/inventory-item.html";

    // Page locators
    readonly backToProductsButton: Locator;
    readonly itemImage: Locator;

    constructor(page: Page) {
        super(page);
        this.backToProductsButton = page.locator('data-test="back-to-products"');
        this.itemImage = page.locator('[data-test="item-sauce-labs-onesie-img"]');
    }


    /**
     * Adds a specified product to the shopping cart and waits for the 'Remove' button to appear.
     * Can be used on both 'Products' page
     * @param product - Product data object to add.
     */
    async addProductToCart(product: Product) {
        await this.getButton(product, "add").click();

        const removeProductButton = this.getButton(product, "remove");
        await removeProductButton.waitFor({ state: "visible" });
    }

    /**
     * Sequentially adds multiple products to the shopping cart.
     * Can be used on both 'Products' page
     * @param products - Array of product data objects to add.
     */
    async addProductsToCart(products: Product[]) {
        for (const product of products) {
            await this.addProductToCart(product);
        }
    }
}
