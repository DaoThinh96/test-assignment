import { test as base } from "@playwright/test";
import { HomePage } from "../page-objects/home-page/home-page";
import { CartPage } from "../page-objects/cart-page/cart-page";
import testData from "../test-data/test-data.json";
import ENV from '../../helper/env-config';

export type MyFixtures = {
  homePage: HomePage;
  cartPage: CartPage;
  loginPage: HomePage;
};

export const test = base.extend<MyFixtures>({
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await homePage.goto("/");
    await use(homePage);
  },

  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },

  loginPage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await homePage.goto("/");
    await homePage.navigateTab("Log in");
    await homePage.inputEmailAndPassword(ENV.TEST_EMAIL!, ENV.TEST_PASSWORD!);
    await homePage.verifyLoginSuccessful();
    await use(homePage);
  },
});

export { expect } from "@playwright/test";
