import { test } from '../../fixtures/base-fixture';
import testData from '../../test-data/test-data.json';

test.describe('Demoblaze web flows', () => {
  test('Verify login successfully', {tag: ['@login', '@regression']}, async ({ homePage }) => {
    await homePage.navigateTab('Log in');
    await homePage.inputEmailAndPassword(testData.email, testData.password);
    await homePage.verifyLoginSuccessful();
  });

  test('Complete purchase flow', {tag: ['@cart', '@regression']}, async ({ loginPage, cartPage }) => {
    await test.step('Add items to cart', async () => {
      await loginPage.addItemsToCart(testData.itemsToAdd);
    });

    await test.step('Navigate to Cart tab', async () => {
      await loginPage.navigateTab('Cart');
    });

    await test.step('Verify items and total price in cart', async () => {
      await cartPage.verifyItemsInCart(testData.itemsToAdd);
      await cartPage.verifyTotalPriceInCart(testData.itemsToAdd);
    });

    await test.step('Place order and input information', async () => {
      await cartPage.clickPlaceOrderBtn();
      await cartPage.inputInformationInPlaceOrder({
        name: testData.nameInPlaceOrder,
        country: testData.countryInPlaceOrder,
        city: testData.cityInPlaceOrder,
        creditCard: testData.creditCardInPlaceOrder,
        month: testData.monthInPlaceOrder,
        year: testData.yearInPlaceOrder,
      });
    });

    await test.step('Complete purchase', async () => {
      await cartPage.clickPurchaseBtn();
    });

    await test.step('Verify purchase successfully and close confirmation', async () => {
      await cartPage.verifyPurchaseSuccessfully(
        testData.creditCardInPlaceOrder,
        testData.nameInPlaceOrder,
        testData.yearInPlaceOrder,
      );
      await cartPage.clickOKBtn();
    });
  });
});
