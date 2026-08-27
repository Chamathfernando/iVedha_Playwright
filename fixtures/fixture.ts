import {test as base, expect, request} from '@playwright/test';
import { LoginPage } from '../src/pages/LoginPage';
import { ProductsPage } from '../src/pages/ProductsPage';
import { CartPage } from '../src/pages/CartPage';
import { CheckoutPage } from '../src/pages/CheckoutPage';

type Pages = {
    loginPage: LoginPage;
    productsPage: ProductsPage;
    cartPage: CartPage;
    checkoutPage: CheckoutPage;
};

const testPages = base.extend<Pages>({

    loginPage: async ({ page }, use) => {
        const loginPageInstance = new LoginPage(page);
        await use(loginPageInstance);
    },

    productsPage: async ({ page }, use) => {
        const productsPageInstance = new ProductsPage(page);
        await use(productsPageInstance);
    },

    cartPage: async ({ page }, use) => {
        const cartPageInstance = new CartPage(page);
        await use(cartPageInstance);
    },

    checkoutPage: async ({ page }, use) => {
        const checkoutPageInstance = new CheckoutPage(page);
        await use(checkoutPageInstance);
    },

});

export const test = testPages;
export { expect, request };