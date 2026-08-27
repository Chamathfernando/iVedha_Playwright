import { expect, Page } from '@playwright/test';
import { CommonUtils } from '../utils/commonUtils';

// Get data from environment variables
const baseurl = process.env.BASEURL ?? '';
const user = process.env.USER ?? '';
const pass = process.env.PASS ?? '';

export class LoginPage {
    readonly page: Page;
    readonly commonUtils: CommonUtils;

    constructor(page: Page) {
        this.page = page;
        this.commonUtils = new CommonUtils(page);
    }

    // ==================== Define the locators ====================
    readonly usernameInput = () => this.page.getByTestId('username');
    readonly passwordInput = () => this.page.getByTestId('password');
    readonly loginButton = () => this.page.getByTestId('login-button');
    readonly productsTitle = () => this.page.getByTestId('title');

    // ==================== Define the methods ====================

    /**
     * Opens the login page of the application.
     */
    async openLoginPage() {
        await this.page.goto(baseurl);
    }

    /**
     * Logs in to the application using the provided username and password.
     * @param username - The username to use for login.
     * @param password - The password to use for login.
     */
    async login() {
        // Log the username and password being used for login (I used this for verification purposes only)
        console.log(`Logging in with username: ${user} and password: ${pass}`);

        // Click on the username input field and fill it with the provided username
        await this.usernameInput().click();
        await this.usernameInput().fill(user);

        // Click on the password input field and fill it with the provided password
        await this.passwordInput().click();
        await this.passwordInput().fill(pass);

        // Click on the login button to submit the login form
        await this.loginButton().click();
    }

    /**
     * Verifies that the login was successful by checking the visibility of the products title
     * and comparing the current URL with the expected URL.
     */
    async verifyLoginSuccess() {
        // Wait for the products title to be visible
        await expect(this.productsTitle()).toBeVisible();

        // Verify the title text
        const titleText = await this.productsTitle().textContent();
        await this.commonUtils.compareValues('Products', titleText?.trim() ?? '');

        // Extract the current URL and compare it with the expected URL
        const currentURL = await this.commonUtils.extractURL();
        await this.commonUtils.compareValues(baseurl + '/inventory.html', currentURL);
    }
}