import { expect, Locator, Page } from '@playwright/test';
import { jobLocale } from "./locale";
import { BasePage } from "../base-page/base-page";
import * as path from 'path';

const locale = jobLocale();

export class JobPage extends BasePage{
  readonly searchJob: Locator;
  readonly easyApplyFilter: Locator;
  readonly easyApplyBtn: Locator;
  readonly searchBtn: Locator;
  readonly headingJob: Locator;
  readonly titleJobPage: Locator;
  readonly jobDescription: Locator;
  readonly jobOption: Function;
  readonly selectEmailAddress: Locator;
  readonly selectCountryCode: Locator;
  readonly phoneNumber: Locator;
  readonly emailAddressMessage: Locator;
  readonly countryCodeMessage: Locator;
  readonly phoneNumberMessage: Locator;
  readonly resume: Locator;

  constructor(page: Page) {
    super(page);
    this.searchJob = page.getByPlaceholder('Title, skill or Company');
    this.easyApplyFilter = page.getByRole('button', {name: 'Easy Apply'});
    this.searchBtn = page.getByRole('button', {name: 'Search'});
    this.headingJob = this.page.getByRole('heading', { name: 'Top job picks for you' });
    this.titleJobPage = this.page.locator('//title[text()="Jobs | LinkedIn"]');
    this.jobDescription = this.page.getByText('Based on your profile, preferences, and activity like applies, searches, and saves');
    this.jobOption =  (job:string) => page.locator(`//div[@data-testid='lazy-column']//p`, {hasText: job});
    this.easyApplyBtn = page.locator('span.artdeco-button__text', {hasText: 'Easy Apply'});
    this.selectEmailAddress = page.locator("//select[contains(@id, 'multipleChoice')]");
    this.selectCountryCode = page.locator("//select[contains(@id, 'phoneNumber-country')]");
    this.phoneNumber = page.locator("//input[contains(@id, 'nationalNumber')]");
    this.emailAddressMessage = page.locator("//div[contains(@id, 'multipleChoice-error')]//span");
    this.countryCodeMessage = page.locator("//div[contains(@id, 'country-error')]//span");
    this.phoneNumberMessage = page.locator("//div[contains(@id, 'nationalNumber-error')]//span");
    this.resume = page.locator('//p[contains(@class, "jobs-document-upload-redesign-card__header truncate")]');
  }

  /* ============ Methods =============== */
  async fillJob(job: string) {
    await this.searchJob.waitFor({ state: 'visible' }).then(async () => {
      await this.searchJob.fill(job);
      await this.jobOption(job).first().click({delay: 1000});
    })
  }

  async clickSearchBtn() {
    await this.searchBtn.waitFor({state: 'visible'}).then(async() => {
      await this.searchBtn.click();
    });
  }

  async clickEasyApplyFilter() {
    try {
      await this.easyApplyFilter.waitFor({ state: 'visible' }).then(async () => {
        await this.easyApplyFilter.click();
      });
    } catch (error) {
      throw new Error(`Element not found: ${this.easyApplyFilter}`);
    }
  }

  async clickEasyApplyBtn() {
    try {
      await this.easyApplyBtn.waitFor({ state: 'visible' }).then(async () => {
        await this.easyApplyBtn.click();
      });
    } catch (error) {
      throw new Error(`Element not found: ${this.easyApplyBtn}`);
    }
  }

  async selectEmailAddressDropdown(option: string) {
    try {
      await this.selectEmailAddress.waitFor({ state: 'visible'}).then(async () => {
        await this.selectEmailAddress.selectOption(option);
      });
    } catch (error) {
      throw new Error(`Element not found: ${this.selectCountryCode}`);
    }
  }

  async selectCountryCodeDropdown(option: string) {
    try {
      await this.selectCountryCode.waitFor({ state: 'visible'}).then(async () => {
        await this.selectCountryCode.selectOption(option);
      });
    } catch (error) {
      throw new Error(`Element not found: ${this.selectCountryCode}`);
    }
  }

  async inputPhoneNumber(phoneNumber: string) {
    try {
      await this.phoneNumber.waitFor({ state: 'visible'}).then(async () => {
        await this.phoneNumber.fill(phoneNumber);
      });
    } catch (error) {
      throw new Error(`Element not found: ${this.phoneNumber}`);
    }
  }

  async uploadResume(localPath: string) {
    await this.page.getByLabel('Upload resume').setInputFiles(path.join(__dirname, localPath));
  }

  /* ============ Verifications =============== */
  async verifyJobPageDisplayed() {
    try {
      await this.headingJob.waitFor({ state: 'visible'}).then(async () => {
        await expect(this.jobDescription).toBeVisible();
      });
    } catch (error) {
      throw new Error(`Element not found: ${this.headingJob}`);
    }
  }

  async verifyBackgroundColorOfEasyApply(expectedColor: string) {
    const actualColor = await this.easyApplyFilter.evaluate(value => {
      return window.getComputedStyle(value).getPropertyValue("background-color");
    })
    expect(actualColor).toEqual(expectedColor);
  }

  async verifyEmailAddressMessage(expectedMessage: string) {
    const message = await this.emailAddressMessage.innerText();
    expect(message).toContain(expectedMessage);
  }

  async verifyCountryCodeMessage(expectedMessage: string) {
    const message = await this.countryCodeMessage.innerText();
    expect(message).toContain(expectedMessage);
  }

  async verifyPhoneNumberMessage(expectedMessage: string) {
    const message = await this.phoneNumberMessage.innerText();
    expect(message).toContain(expectedMessage);
  }

  async verifyResumeIsUploadedSuccessfully(resumeName: string) {
    const resumeText = await this.resume.innerText();
    expect(resumeText).toContain(resumeName);
  }
}
