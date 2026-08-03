import { expect, Page, Locator } from '@playwright/test';
import { BasePage } from "../base-page/base-page";
export interface PlaceOrderForm {
  name: string;
  country: string;
  city: string;
  creditCard: string;
  month: string;
  year: string;
}
export class CartPage extends BasePage {
  readonly itemLocatorByRow: Function
  readonly totalPriceLocator: Locator
  readonly placeOrderButton: Locator
  readonly nameInPlaceOrder: Locator
  readonly countryInPlaceOrder: Locator
  readonly cityInPlaceOrder: Locator
  readonly creditCardInPlaceOrder: Locator
  readonly monthInPlaceOrder: Locator
  readonly yearInPlaceOrder: Locator
  readonly purchaseButton: Locator
  readonly purchaseSuccessfullHeader: Locator
  readonly purchaseInfo: Locator
  readonly priceEachItem: (item: string) => Locator
  readonly okButton: Locator

  constructor(page: Page) {
    super(page);
    this.itemLocatorByRow = (itemName: string) => page.getByRole('row', { name: itemName });
    this.totalPriceLocator = page.locator('#totalp');
    this.placeOrderButton = page.getByRole('button', { name: 'Place Order' });
    this.purchaseButton = page.getByRole('button', { name: 'Purchase' });
    this.nameInPlaceOrder = page.locator('#name');
    this.countryInPlaceOrder = page.locator('#country');
    this.cityInPlaceOrder = page.locator('#city');
    this.creditCardInPlaceOrder = page.locator('#card');
    this.monthInPlaceOrder = page.locator('#month');
    this.yearInPlaceOrder = page.locator('#year');
    this.purchaseSuccessfullHeader = page.getByRole('heading', { name: 'Thank you for your purchase!' });
    this.purchaseInfo = page.locator('.sweet-alert > p');
    this.priceEachItem = (item: string) => page.locator(`(//td[text()="${item}"]//following-sibling::td)[1]`);
    this.okButton = page.getByRole('button', { name: 'OK' });
  }

  /* ============ Methods =============== */
  async clickPlaceOrderBtn(): Promise<void> {
    await this.waitAndClick(this.placeOrderButton);
  }

  async clickPurchaseBtn(): Promise<void> {
    await this.waitAndClick(this.purchaseButton);
  }

  async clickOKBtn(): Promise<void> {
    await this.waitAndClick(this.okButton);
  }

  async getTotalPriceInCart(): Promise<string> {
    const totalPriceOnUI = await this.totalPriceLocator.innerText();
    return totalPriceOnUI;
  }

  async verifyItemsInCartAndClickPlaceOrder(itemsList: string[]): Promise<void> {
    for (const item of itemsList) {
      try {
        const itemName = this.itemLocatorByRow(item);
        await expect(itemName).toBeVisible();
      } catch (error) {
        throw new Error(`Item "${item}" is not visible in the cart. Error: ${error}`);
      }
    }
  }

  async inputInformationInPlaceOrder(data: PlaceOrderForm): Promise<void> {
    const fieldMap = [
      { locator: this.nameInPlaceOrder, value: data.name },
      { locator: this.countryInPlaceOrder, value: data.country },
      { locator: this.cityInPlaceOrder, value: data.city },
      { locator: this.creditCardInPlaceOrder, value: data.creditCard },
      { locator: this.monthInPlaceOrder, value: data.month },
      { locator: this.yearInPlaceOrder, value: data.year },
    ];

    for (const field of fieldMap) {
      await this.waitAndFill(field.locator, field.value);
    }
  }

  /* ============ Verifications =============== */
  async verifyItemsInCart(itemsList: string[]): Promise<void> {
    for (const item of itemsList) {
      try {
        const itemName = this.itemLocatorByRow(item);
        await expect(itemName).toBeVisible();
      } catch (error) {
        throw new Error(`Item "${item}" is not visible in the cart. Error: ${error}`);
      }
    }
  }

  async verifyTotalPriceInCart(itemsList: string[]): Promise<void> {
    let totalPrice = 0;
    const totalPriceOnUIText = await this.totalPriceLocator.innerText();
    const parsedTotalPriceOnUI = parseInt(totalPriceOnUIText);

    for (const item of itemsList) {
      const priceEachItem = await this.priceEachItem(item).innerText();
      let parsedPrice = parseInt(priceEachItem);
      totalPrice += parsedPrice;
    }

    try {
      expect(totalPrice).toEqual(parsedTotalPriceOnUI);
    } catch (error) {
      throw new Error(`Total price verification failed. Expected: ${totalPrice}, Actual: ${parsedTotalPriceOnUI}. Error: ${error}`);
    }
  }

  async verifyPurchaseSuccessfully(creditCard: string, name: string, year: string): Promise<void> {
    await expect(this.purchaseSuccessfullHeader).toBeVisible();
    const purchaseInfoText = await this.purchaseInfo.innerText();
    const totalPrice = await this.getTotalPriceInCart();
    
    try {
      expect(purchaseInfoText).toContain(creditCard);
      expect(purchaseInfoText).toContain(name);
      expect(purchaseInfoText).toContain(year);
      expect(purchaseInfoText).toContain(totalPrice);
    } catch (error) {
      throw new Error(`Purchase verification failed: ${error}`);
    }
  }
}
