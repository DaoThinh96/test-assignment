import { test as base } from "@playwright/test";
import { HomePage } from "../page-objects/home-page/home-page";
import { CartPage } from "../page-objects/cart-page/cart-page";

export type MyFixtures = {
  homePage: HomePage;
  cartPage: CartPage;
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
});

export { expect } from "@playwright/test";
