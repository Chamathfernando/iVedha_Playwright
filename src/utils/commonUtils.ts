import { expect, Locator, Page } from "@playwright/test";

export class CommonUtils {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async extractURL() {
        const currentUrl = this.page.url();
        return currentUrl;
    }

    async compareValues(expectedValue: string, actualValue: string) {
        try {
            expect(actualValue).toBe(expectedValue);
            console.log(`Values match: Expected = ${expectedValue}, Actual = ${actualValue}`);
        } catch (error) {
            console.error(`Values do not match: Expected = ${expectedValue}, Actual = ${actualValue}`);
            throw error;
        }
    }
}