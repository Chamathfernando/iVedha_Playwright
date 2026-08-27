import { expect, Page } from '@playwright/test';

type Product = {
    itemName: string;
    itemPrice: number;
};

export class ProductsPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // ==================== Define the locators ====================
    readonly filterDropdown = () => this.page.getByTestId('product-sort-container');
    readonly inventoryItem = () => this.page.getByTestId('inventory-list').getByTestId('inventory-item');

    // ==================== Define the methods ====================

    /**
     * Filters products based on the specified criteria
     * @param By - The filter criteria, which can be one of the following: 'Name (A to Z)', 'Name (Z to A)', 'Price (low to high)', 'Price (high to low)'
     * @throws Error if an invalid filter option is provided
     */
    async filterProducts(By: 'Name (A to Z)' | 'Name (Z to A)' | 'Price (low to high)' | 'Price (high to low)') {

        // Click on the filter dropdown
        await this.filterDropdown().click();

        // Select the filter option based on the provided value
        console.log(`Filtering products by: ${By}`);
        switch (By) {
            case 'Name (A to Z)':
                await this.filterDropdown().selectOption('az');
                break;
            case 'Name (Z to A)':
                await this.filterDropdown().selectOption('za');
                break;
            case 'Price (low to high)':
                await this.filterDropdown().selectOption('lohi');
                break;
            case 'Price (high to low)':
                await this.filterDropdown().selectOption('hilo');
                break;
            default:
                throw new Error(`Invalid filter option: ${By}`);
        }
    }

    /**
     * Retrieves the list of products displayed on the page, including their names and prices
     * @returns An array of product objects containing itemName and itemPrice
     */
    async getProductsList() {

        const products: { itemName: string; itemPrice: number }[] = [];

        for (let i = 0; i < await this.inventoryItem().count(); i++) {
            const item = this.inventoryItem().nth(i);
            const itemName = (await item.locator('.inventory_item_label a').innerText()).trim();
            const itemPriceText = (await item.getByTestId('inventory-item-price').innerText()).trim();
            const itemPrice = Number(itemPriceText.replace('$', '').trim());

            products.push({
                itemName,
                itemPrice,
            });
        }
        return products;
    }

    /**
     * Prints the first 'count' products from the provided list of products
     * @param products - An array containing itemName and itemPrice
     * @param count - The number of products to print
     */
    async printProducts(products: { itemName: string; itemPrice: number }[], count: number) {
        products.slice(0, count).forEach((product) => {
            console.log(`--------------------`);
            console.log(`Product Name: ${product.itemName}`);
            console.log(`Product Price: ${product.itemPrice}`);
        });

        console.log(`--------------------`);
        return count;
    }

    /**
     * Retrieves the product details after filtering and prints the first two products
     */
    async printProductDetailsAfterFiltering(count: number) {
        // Get the count of products after filtering
        const products = await this.getProductsList();

        // Validate the requested count
        if (count > products.length) {
            throw new Error(`Requested ${count} products, but only ${products.length} products are available.`);
        }

        // Print the products
        await this.printProducts(products, count);
    }

    /**
     * Adds the first X products from the filtered list to the cart
     * @param count - The number of products to add to the cart
     * @returns An array of products that were added to the cart
     * @throws Error if the requested count exceeds the available products
     */
    async addProductsToCart(count: number): Promise<Product[]> {
        // Get the count of products after filtering
        const products = await this.getProductsList();

        // Validate the requested count
        if (count > products.length) {
            throw new Error(`Requested ${count} products, but only ${products.length} products are available.`);
        }

        const addedProducts: Product[] = [];

        for (let i = 0; i < count; i++) {
            const product = products[i];
            const inventoryItem = this.page.getByTestId('inventory-item').filter({ hasText: product.itemName });
            const button = inventoryItem.locator('.pricebar').getByRole('button');

            // Validate button before clicking
            await expect(button).toHaveText('Add to cart');

            // Add product to cart
            await button.click();

            // Validate button changed after clicking
            await expect(button).toHaveText('Remove');
            addedProducts.push(product);
            console.log(`--------------------`);
            console.log(`Added to cart: ${product.itemName}`);
        }

        console.log(`--------------------`);
        return addedProducts;
    }
}