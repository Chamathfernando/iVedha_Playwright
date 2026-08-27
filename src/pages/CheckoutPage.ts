import { expect, Page } from '@playwright/test';
import { CommonUtils } from '../utils/commonUtils';
import { PriceUtils } from '../utils/priceutils';

// Get data from environment variables
const baseurl = process.env.BASEURL ?? '';

export class CheckoutPage {
    readonly page: Page;
    readonly commonUtils: CommonUtils;
    readonly priceUtils: PriceUtils;

    constructor(page: Page) {
        this.page = page;
        this.commonUtils = new CommonUtils(page);
        this.priceUtils = new PriceUtils(page);
    }

    // ==================== Define the locators ====================
    readonly checkoutButton = () => this.page.getByTestId('checkout');
    readonly checkoutPageTitle = () => this.page.getByTestId('title');
    readonly firstNameInput = () => this.page.getByTestId('firstName');
    readonly lastNameInput = () => this.page.getByTestId('lastName');
    readonly postalCodeInput = () => this.page.getByTestId('postalCode');
    readonly continueButton = () => this.page.getByTestId('continue');
    readonly itemSubtotal = () => this.page.getByTestId('subtotal-label');

    // ==================== Define the methods ====================

    /**
     * Clicks the checkout button on the cart page to proceed to the checkout process.
     */
    async clickCheckoutButton() {
        // Click on the checkout button
        await this.checkoutButton().click();

        // Wait for the checkout page title to be visible
        await expect(this.checkoutPageTitle()).toBeVisible();

        // Verify the title text
        const titleText = await this.checkoutPageTitle().textContent();
        await this.commonUtils.compareValues('Checkout: Your Information', titleText?.trim() ?? '');

        // Extract the current URL and compare it with the expected URL
        const currentURL = await this.commonUtils.extractURL();
        await this.commonUtils.compareValues(baseurl + '/checkout-step-one.html', currentURL);
    }

    /**
     * Completes the checkout flow
     */
    async fillCheckoutInformation() {
        // Fill in the first name
        await this.firstNameInput().fill('John');

        // Fill in the last name
        await this.lastNameInput().fill('Doe');

        // Fill in the postal code
        await this.postalCodeInput().fill('12345');
    }

    /**
     * Clicks the continue button to proceed to the next step of the checkout process.
     */
    async viewCheckoutOverview() {
        // Click on the continue button to proceed
        await this.continueButton().click();

        // Wait for the checkout page title to be visible
        await expect(this.checkoutPageTitle()).toBeVisible();

        // Verify the title text
        const titleText = await this.checkoutPageTitle().textContent();
        await this.commonUtils.compareValues('Checkout: Overview', titleText?.trim() ?? '');

        // Extract the current URL and compare it with the expected URL
        const currentURL = await this.commonUtils.extractURL();
        await this.commonUtils.compareValues(baseurl + '/checkout-step-two.html', currentURL);
    }

    /**
     * Verifies that the total price displayed on the checkout page matches the expected total.
     * @param expectedTotal - The expected total price to compare against
     */
    async verifyTotal(expectedTotal: number) {
        const itemTotalText = await this.page.getByTestId('subtotal-label').innerText();
        const actualTotal = Number(itemTotalText.replace('Item total: $', '').trim());
        await this.commonUtils.compareValues(expectedTotal.toString(), actualTotal.toString());
    }
}