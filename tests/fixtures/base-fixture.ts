import { test as base } from "@playwright/test";
import { expect } from "@playwright/test";
import { HomePage } from '../page-objects/home-page/home-page.ts';
import ENV from "../../helper/env-config";
import testData from "../test-data/test-data.json";

export type MyFixtures = {
    loginPage: HomePage;
};

export const test = base.extend<MyFixtures>({
        loginPage: async ({ browser }, use) => {
        let context = await browser.newContext();
        const page = await context.newPage();
        let base_url = `${ENV.BASE_URL}`
        const loginPage = new HomePage(page);

        await loginPage.goto(base_url)
        await loginPage.inputEmailAndPassword(testData.email, testData.password);
        await page.context().storageState({ path: ENV.STORAGE_STATE });
        await use(loginPage);
        await context.close();
    }
})

export { expect } from '@playwright/test';