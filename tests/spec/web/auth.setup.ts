import { test as setup, expect } from '@playwright/test';
import { HomePage } from "../../../page-objects/home-page/home-page";
import ENV from '../../../helper/env-config';
import path from 'path';

const authFile = path.join(__dirname, '../../../.auth/user.json');

setup('authenticate', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto("/");
    await homePage.navigateTab("Log in");
    await homePage.inputEmailAndPassword(ENV.TEST_EMAIL, ENV.TEST_PASSWORD);
    await homePage.verifyLoginSuccessful();

    await page.context().storageState({ path: authFile });
    await page.close();
});