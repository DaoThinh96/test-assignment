import { test, expect } from '../../../tests/fixtures/base-fixture.ts';
import { JobPage } from '../../page-objects/job-page/job-page.ts';
import { LoginPage } from '../../page-objects/login-page/login-page.ts';
import { TestDataInStaging } from '../../test-data/information.ts';
import  generateEmail  from '../../../helper/generate-email.ts';
import ENV from '../../../helper/env-config.ts';

let emailRandom = generateEmail();
test.use({ user: { email: emailRandom, password: "" } });
test('Search job', async ({ browser }) => {
  const context = await browser.newContext({ storageState: '.auth/user.json' });
  const page = await context.newPage();
  let jobPage = new JobPage(page);
  let baseUrl: string = `${ENV.BASE_URL}`;
  let testData: any = TestDataInStaging;
  let email: string = testData.email;
  let countryCode: string = testData.countryCode;
  let phoneNumber: string = testData.phoneNumber;
  let jobName: string = 'automation';
  let resumeLocalPath: string = 'tests/test-data/file/Dao Nguyen Thinh_CV (2026).pdf';

  await test.step('Search job', async ({}) => {
    await jobPage.goto(baseUrl);
    await jobPage.verifyJobPageDisplayed();
    await jobPage.fillJob(jobName);
  });

  /**
   * Hi reviewer,
   * Thank you for taking the time to review my work.
   * I got stuck at one point: after searching for a job and waiting for the “Easy Apply” button, the locator kept loading and the button didn’t appear.
   * So you can the test is failed at this step in the video/tracer
   * Interestingly, when I tried on a real browser, this didn’t happen. I suspect LinkedIn may have an API that detects and blocks automation.
   * You can find the screenshot and logs in the index.html file in the test-output folder.
   * Despite this, I did my best to complete the test. I would really appreciate the chance to discuss this issue with you.
   * Thanks for your understanding
   */

  await test.step('Verify css after select Easy apply filter', async ({}) => {
    await jobPage.clickEasyApplyFilter();
    await jobPage.verifyBackgroundColorOfEasyApply('rgb(1, 117, 79)');
  });

  await test.step('Opens the application form and validates the presence of required fields', async ({}) => {
    await jobPage.clickEasyApplyBtn();
    await jobPage.selectEmailAddressDropdown('Select an option');
    await jobPage.selectCountryCodeDropdown('Select an option');
    await jobPage.inputPhoneNumber('');
    await jobPage.verifyEmailAddressMessage('Please enter a valid answer');
    await jobPage.verifyCountryCodeMessage('Please enter a valid answer');
    await jobPage.verifyPhoneNumberMessage('Enter a valid phone number');
  });

  await test.step('Select email, country code and input phone number', async ({}) => {
    await jobPage.selectEmailAddressDropdown(email);
    await jobPage.selectCountryCodeDropdown(countryCode);
    await jobPage.inputPhoneNumber(phoneNumber);
    await jobPage.clickNextBtn();
  });

  await test.step('Upload resume and verify resume is uploaded successfully', async ({}) => {
    await jobPage.uploadResume(resumeLocalPath);
    await jobPage.clickNextBtn();
    await jobPage.verifyResumeIsUploadedSuccessfully('Dao Nguyen Thinh_CV (2026).pdf');
  });
});
