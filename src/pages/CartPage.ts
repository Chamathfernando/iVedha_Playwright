import { expect, Page } from '@playwright/test';
import { CommonUtils } from '../utils/commonUtils';

// Get data from environment variables
const baseurl = process.env.BASEURL ?? '';

type Product = {
    itemName: string;
    itemPrice: string;
};

export class CartPage {
    readonly page: Page;
    readonly commonUtils: CommonUtils;

    constructor(page: Page) {
        this.page = page;
        this.commonUtils = new CommonUtils(page);
    }

    // ==================== Define the locators ====================
    readonly cartIcon = () => this.page.getByTestId('shopping-cart-badge');
    readonly cartPageTitle = () => this.page.getByTestId('title');
    readonly cartItemLocator = () => this.page.getByTestId('cart-list').getByTestId('inventory-item');
    readonly checkoutButton = () => this.page.getByTestId('checkout');

    // ==================== Define the methods ====================

    /**
     * Opens the cart page of the application.
     */
    async openCartPage() {
        // Click on the cart icon to navigate to the cart page
        await this.cartIcon().click();

        // Wait for the cart page title to be visible
        await expect(this.cartPageTitle()).toBeVisible();

        // Verify the title text
        const titleText = await this.cartPageTitle().textContent();
        await this.commonUtils.compareValues('Your Cart', titleText?.trim() ?? '');

        // Extract the current URL and compare it with the expected URL
        const currentURL = await this.commonUtils.extractURL();
        await this.commonUtils.compareValues(baseurl + '/cart.html', currentURL);
    }

    /**
     * Verifies that the products added from the inventory page is displayed in the cart page.
     * @param products - An array of products containing itemName and itemPrice
     */
    async verifyCartProducts(products: Product[]) {
        // Extract the cart items and verify their count
        const cartItems = await this.cartItemLocator().all();

        // Compare the number of products in the cart with the expected number of products
        await this.commonUtils.compareValues(cartItems.length.toString(), products.length.toString());

        // Verify each product in the cart matches the expected products
        for (let i = 0; i < cartItems.length; i++) {
            const actualItemName = await cartItems[i].locator('.cart_item_label a').innerText();
            const expectedItemName = products[i].itemName;
            console.log(`--------------------`);
            await this.commonUtils.compareValues(actualItemName.trim(), expectedItemName);
            console.log(`Added Item : ${expectedItemName}`);
            console.log(`Cart Item  : ${actualItemName.trim()}`);
        }
    }
}