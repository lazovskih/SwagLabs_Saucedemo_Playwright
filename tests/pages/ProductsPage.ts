import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { getProductId } from "@helpers/formatters";
import { Product } from "@data-types";

export class ProductsPage extends BasePage {
  pageTitleText = "Products";
  pageUrl = "/inventory.html";

  // Page locators
  readonly inventoryItems: Locator;
  readonly cartBadge: Locator;
  readonly shoppingCartLink: Locator;
  readonly pageTitle: Locator;

  constructor(page: Page) {
    super(page);
    this.inventoryItems = page.locator('[data-test="inventory-item"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.shoppingCartLink = page.locator('[data-test="shopping-cart-link"]');
    this.pageTitle = page.locator('[data-test="title"]');
  }

  /**
   * Gets the 'Add to cart' button locator for a specified product.
   * @param product - Product data object.
   * @returns Playwright locator for the product's 'Add to cart' button.
   */
  getAddToCartButton(product: Product) {
    return this.page.locator(`[data-test="add-to-cart-${getProductId(product)}"]`);
  }

  /**
   * Gets the 'Remove' button locator for a specified product.
   * @param product - Product data object.
   * @returns Playwright locator for the product's 'Remove' button.
   */
  getRemoveButton(product: Product) {
    return this.page.locator(`[data-test="remove-${getProductId(product)}"]`);
  }

  /**
   * Adds a specified product to the shopping cart and waits for the 'Remove' button to appear.
   * @param product - Product data object to add.
   * @returns Promise that resolves when the product is added.
   */
  async addProductToCart(product: Product) {
    await this.getAddToCartButton(product).click();

    const removeProductButton = this.getRemoveButton(product);
    await removeProductButton.waitFor({ state: "visible" });
  }

  /**
   * Sequentially adds multiple products to the shopping cart.
   * @param products - Array of product data objects to add.
   * @returns Promise that resolves when all products have been added.
   */
  async addProductsToCart(products: Product[]) {
    for (const product of products) {
      await this.addProductToCart(product);
    }
  }

  /**
   * Retrieves the numerical count displayed on the shopping cart badge icon.
   * @returns Promise resolving to the number of items on the cart badge, or 0 if badge is not present.
   */
  async getCartCount() {
    const count = await this.cartBadge.count();
    if (count === 0) return 0;
    const text = await this.cartBadge.textContent();
    return text ? Number(text.trim()) : 0;
  }

  /**
   * Clicks the shopping cart link to navigate to the cart page.
   * @returns Promise that resolves when the shopping cart link is clicked.
   */
  async viewCart() {
    await this.shoppingCartLink.click();
  }
}
