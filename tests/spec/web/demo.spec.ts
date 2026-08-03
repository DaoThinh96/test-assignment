import { test } from '../../fixtures/base-fixture';
import testData from '../../test-data/test-data.json';

test.describe('Demoblaze web flows', () => {
  test('Verify login successfully', {tag: ['@login', '@regression']}, async ({ homePage }) => {
    await homePage.navigateTab('Log in');
    await homePage.inputEmailAndPassword(testData.email, testData.password);
    await homePage.verifyLoginSuccessful();
  });

  test('Complete purchase flow', {tag: ['@cart', '@regression']}, async ({ loginPage, cartPage }) => {
    await loginPage.addItemsToCart(testData.itemsToAdd);
    await loginPage.navigateTab('Cart');
    await cartPage.verifyItemsInCart(testData.itemsToAdd);
    await cartPage.verifyTotalPriceInCart(testData.itemsToAdd);
    await cartPage.clickPlaceOrderBtn();
    await cartPage.inputInformationInPlaceOrder({
      name: testData.nameInPlaceOrder,
      country: testData.countryInPlaceOrder,
      city: testData.cityInPlaceOrder,
      creditCard: testData.creditCardInPlaceOrder,
      month: testData.monthInPlaceOrder,
      year: testData.yearInPlaceOrder,
    });
    await cartPage.clickPurchaseBtn();
    await cartPage.verifyPurchaseSuccessfully(
      testData.creditCardInPlaceOrder,
      testData.nameInPlaceOrder,
      testData.yearInPlaceOrder,
    );
    await cartPage.clickOKBtn();
  });
});
