import { expect, Locator, Page } from "@playwright/test";

export class BasePage {
  readonly page: Page;
  readonly localization: any;
  readonly tabLink: Function;

  constructor(page: Page) {
    this.page = page;
    this.tabLink = (tab: string) => page.getByRole('link', { name: tab });
  }

  /* ============ Methods =============== */

  async goto(url: string): Promise<void> {
    await this.page.goto(url, {
      waitUntil: "domcontentloaded",
    });
  }

  async navigateTab(tab: string): Promise<void> {
    await this.tabLink(tab).click();
  }

  async waitAndClick(element: Locator): Promise<void> {
    await element.waitFor({ state: 'visible' });
    await element.click();
  }

  async waitAndFill(element: Locator, text: string): Promise<void> {
    await element.waitFor({ state: 'visible' });
    await element.fill(text);
  }
  /*==================Verification==============*/

  
}