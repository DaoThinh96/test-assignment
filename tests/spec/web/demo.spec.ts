import { test, expect } from '@playwright/test';
import { HomePage } from '../../page-objects/home-page/home-page.ts';
import { CartPage } from '../../page-objects/cart-page/cart-page.ts';
import testData from '../../test-data/test-data.json';

test('Verify login successfully @login @regression', async ({ page }) => {
  let homePage = new HomePage(page);

  await homePage.goto('');
  await homePage.navigateTab('Log in');
  await homePage.inputEmailAndPassword(testData.email, testData.password);
  await homePage.verifyLoginSuccessful();
});

test('Verify add items to cart successfully @cart @regression', async ({ page }) => {
  let homePage = new HomePage(page);
  let cartPage = new CartPage(page);

  await homePage.goto('');
  await homePage.addItemsToCart(testData.itemsToAdd);
  await homePage.navigateTab('Cart');
  await cartPage.verifyItemsInCart(testData.itemsToAdd);
  await cartPage.verifyTotalPriceInCart(testData.itemsToAdd);
  await cartPage.clickPlaceOrderBtn();
  await cartPage.inputInformationInPlaceOrder({
    name: testData.nameInPlaceOrder,
    country: testData.countryInPlaceOrder,
    city: testData.cityInPlaceOrder,
    creditCard: testData.creditCardInPlaceOrder,
    month: testData.monthInPlaceOrder,
    year: testData.yearInPlaceOrder
  });
  await cartPage.clickPurchaseBtn();
  await cartPage.verifyPurchaseSuccessfully(
    testData.nameInPlaceOrder,
    testData.creditCardInPlaceOrder,
    testData.yearInPlaceOrder
  );
});
