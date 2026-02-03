import { test as base } from "@playwright/test";
import { expect } from "@playwright/test";
import { LoginPage, User } from '../page-objects/login-page/login-page';
import  generateEmail  from '../../helper/generate-email.ts';
import ENV from "../../helper/env-config";

export type MyFixtures = {
    loginPage: LoginPage;
    user: User;
};

export const test = base.extend<MyFixtures>({
    user: {
        email: 'daonguyenthinh96@gmail.com',
        password: ''
    },
    loginPage: async ({ browser, user }, use) => {
        let context = await browser.newContext();
        const page = await context.newPage();
        let base_url = `${ENV.BASE_URL}`
        const loginPage = new LoginPage(page, user);

        await loginPage.goto(base_url)
        await loginPage.login();
        await page.context().storageState({ path: ENV.STORAGE_STATE });
        await use(loginPage);
        await context.close();
    }
})

export { expect } from '@playwright/test';