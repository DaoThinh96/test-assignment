import { expect, Page, Locator } from '@playwright/test';
import { BasePage } from "../base-page/base-page";

export type User = {
  email: string
  password: string
}
export class LoginPage extends BasePage {
  readonly user: User
  readonly headerPage: Locator
  readonly username: Locator
  readonly password: Locator
  readonly emailTextbox: Locator
  readonly verifyOtpCodeBtn: Locator

  constructor(page: Page, user: User) {
    super(page);
    this.user = user
    this.headerPage = page.locator(`h1.post-title`),
    this.username = page.locator(`//input[@autocomplete='username']`),
    this.password = page.locator(`//input[@autocomplete='current-password']`),
    this.emailTextbox = page.locator(`input#email`),
    this.verifyOtpCodeBtn = page.locator(`button#btn-send-verify`)
  }

  /* ============ Methods =============== */

  async login () {
    await this.username.waitFor({state: 'visible'}).then(async () => {
      await this.username.fill(this.user.email);
      await this.password.fill(this.user.password);
      await this.page.getByRole('button', {name: `Sign in`}).click();
    });
  }

  /* ============ Verifications =============== */
  
}
