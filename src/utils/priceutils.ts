import { expect, Locator, Page } from "@playwright/test";

export class PriceUtils {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async calculateTotal(prices: number[]): Promise<number> {
        return Number(
            prices.reduce((total, price) => total + price, 0).toFixed(2)
        );
    }
}