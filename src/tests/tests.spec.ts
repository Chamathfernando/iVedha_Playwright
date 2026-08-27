import { expect, test } from '../../fixtures/fixture';
import productData from '../test-data/productDetails.json';

test.describe('Saucedemo Test Cases', () => {

    // Login Test Case
    test('Test valid login', async ({ loginPage }) => {
        await test.step('Open the login page', async () => {
            await loginPage.openLoginPage();
        });

        await test.step('Login to the application', async () => {
            await loginPage.login();
        });

        await test.step('Verify successful login', async () => {
            await loginPage.verifyLoginSuccess();
        });

    });

    // Filter products and select the top 2 products after filtering
    test('Products filtering', async ({ loginPage, productsPage }) => {
        await test.step('Login to the application and validate the login', async () => {
            await loginPage.openLoginPage();
            await loginPage.login();
            await loginPage.verifyLoginSuccess();
        });

        await test.step('Filter products by "Price (high to low)"', async () => {
            await productsPage.filterProducts('Price (high to low)');
        });

        await test.step('Print the top 2 products after filtering', async () => {
            await productsPage.printProductDetailsAfterFiltering(2);
        });
    });

    // Add the selected products to the cart and verify the cart
    test('Add filtered products to cart', async ({ loginPage, productsPage, cartPage }) => {
        let addedProducts: any[] = [];

        await test.step('Login to the application and validate the login', async () => {
            await loginPage.openLoginPage();
            await loginPage.login();
            await loginPage.verifyLoginSuccess();
        });

        await test.step('Filter products by "Price (high to low)" and extract the product details', async () => {
            await productsPage.filterProducts('Price (low to high)');
            await productsPage.printProductDetailsAfterFiltering(2);
        });

        await test.step('Add the selected products to the cart', async () => {
            addedProducts = await productsPage.addProductsToCart(2);
        });

        await test.step('Open the cart page and verify the products added', async () => {
            await cartPage.openCartPage();
            await cartPage.verifyCartProducts(addedProducts);
        });
    });


    // Checkout from the cart and verify the checkout process
    test('Checkout from cart', async ({ loginPage, productsPage, cartPage, checkoutPage }) => {
        let addedProducts: any[] = [];
        let expectedTotal: number = 0;

        await test.step('Login to the application and validate the login', async () => {
            await loginPage.openLoginPage();
            await loginPage.login();
            await loginPage.verifyLoginSuccess();
        });

        await test.step('Filter products by "Price (high to low)" and extract the product details', async () => {
            await productsPage.filterProducts('Price (high to low)');
            await productsPage.printProductDetailsAfterFiltering(2);
        });

        await test.step('Add the selected products to the cart', async () => {
            addedProducts = await productsPage.addProductsToCart(2);
            expectedTotal = await checkoutPage.priceUtils.calculateTotal(addedProducts.map(product => product.itemPrice));
            await cartPage.openCartPage();
            await cartPage.verifyCartProducts(addedProducts);
        });

        await test.step('Verify product data with backend data', async () => {
            for (let i = 0; i < addedProducts.length; i++) {
                console.log(`--------------------`);
                console.log(`UI Name         : ${addedProducts[i].itemName}`);
                console.log(`Data File Value : ${productData[i].itemName}`);
                console.log(`UI Price        : ${addedProducts[i].itemPrice}`);
                console.log(`Data File Price : ${productData[i].itemPrice}`);
                expect(addedProducts[i].itemName).toBe(productData[i].itemName);
                expect(addedProducts[i].itemPrice).toBe(productData[i].itemPrice);
            }
        });

        await test.step('Complete the checkout process', async () => {
            await checkoutPage.clickCheckoutButton();
            await checkoutPage.fillCheckoutInformation();
            await checkoutPage.viewCheckoutOverview();
            await cartPage.verifyCartProducts(addedProducts);
            await checkoutPage.verifyTotal(expectedTotal);
        });
    });
});