import { expect, Page } from '@playwright/test';
import { homeLocale } from "./locale";
import { BasePage } from "../base-page/base-page";

const locale = homeLocale();

export class HomePage extends BasePage{
  constructor(page: Page) {
    super(page);
  }

  /* ============ Elements =============== */

  readonly homeElements = {
    tabName: (name: string) => `//a[text()="${name}"]`,
    headerHomePage: `h1.post-title`,
  }

  /* ============ Methods =============== */

  async goto(url: string) {
    await this.page.goto(url);
  }

  async clickTabMenu(name: string) {
    await this.waitAndClick(this.homeElements.tabName(name));
  }

  /* ============ Verifications =============== */
  async verifyHomePageDisplayed() {
   const loginName = this.page.getByRole('link', { name: 'Welcome test' });
    const logOutBtn = this.page.getByRole('link', { name: 'Log out' });
    await expect(loginName).toBeVisible();
    await expect(logOutBtn).toBeVisible();
  }
}
