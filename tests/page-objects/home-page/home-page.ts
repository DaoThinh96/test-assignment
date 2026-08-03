import { expect, Page, Locator } from '@playwright/test';
import { BasePage } from "../base-page/base-page";

export class HomePage extends BasePage {
  readonly username: Locator
  readonly password: Locator
  readonly accountName: Locator
  readonly logoutLink: Locator
  readonly logInButton: Locator
  readonly itemLocatorByLink: (itemName: string) => Locator
  readonly addToCart: Locator

  constructor(page: Page) {
    super(page);
    this.logoutLink = page.getByRole('link', { name: 'Log out' }),
    this.accountName = page.getByRole('link', { name: 'Welcome test' }),
    this.logInButton = page.getByRole('button', { name: 'Log in' })
    this.username = page.locator(`#loginusername`),
    this.password = page.locator(`#loginpassword`),
    this.itemLocatorByLink = (itemName: string) => page.getByRole('link', { name: itemName });
    this.addToCart =  page.getByRole('link', { name: 'Add to cart' });
  }

  /* ============ Methods =============== */
  async inputEmailAndPassword(email: string, password: string): Promise<void> {
    await this.username.waitFor({state: 'visible'}).then(async () => {
      await this.waitAndFill(this.username, email);
      await this.waitAndFill(this.password, password);
      await this.waitAndClick(this.logInButton);
    });
  }

  async addItemsToCart(itemsList: string[]): Promise<void> {
    for (const item of itemsList) {
      try {
        const itemName = this.itemLocatorByLink(item);
        await itemName.waitFor({ state: 'visible' }).then(async () => {
          await this.waitAndClick(itemName);
          await this.waitAndClick(this.addToCart);
          this.page.on('dialog', async dialog => {
            await dialog.accept();
          });
          await this.navigateTab('Home');
        });
      } catch (error) {
        throw new Error(`Item "${item}" is not visible on the page. Error: ${error}`);
      }
    }
  }

  /* ============ Verifications =============== */
  async verifyLoginSuccessful(): Promise<void> {
    try {
      await expect(this.accountName).toBeVisible();
      await expect(this.logoutLink).toBeVisible();
    } catch (error) {
      throw new Error(`User login verification failed with error: ${error}`);
    }
  }
}
