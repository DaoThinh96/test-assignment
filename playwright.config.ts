import { defineConfig, devices } from '@playwright/test';
import ENV from './helper/env-config';

export default defineConfig({
  globalSetup: "./helper/global-setup.ts",
  testDir: './tests',
  snapshotPathTemplate: `test-data/snapshot/${process.env.tenant}/desktop/{arg}{ext}`,
  timeout: 60 * 1000,
  expect: {
    timeout: 30000
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [
    ["html", { open: "never", outputFolder: "./test-output/html" }],
    ["allure-playwright", { detail: true, outputFolder: "./test-output/allure-results" }],
  ],
  use: {
    actionTimeout: 10000,
    baseURL: ENV.BASE_URL || 'https://www.demoblaze.com',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    extraHTTPHeaders: {
      'Accept': 'application/vnd.github.v3+json',
    },
    bypassCSP: true,
    ignoreHTTPSErrors: true,
    javaScriptEnabled: true,
    launchOptions: { args: ['--test-third-party-cookie-phaseout', '--disable-web-security', '--disable-blink-features=AutomationControlled'] },
    headless: process.env.headless ? false : true,
  },

  /* Configure projects for major browsers */
  projects: [
    { name: 'setup', testMatch: /.*\.setup\.ts/ },
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: '.auth/user.json',
      },
      dependencies: ['setup'],
    },
    {
      name: 'edge',
      use: {
        ...devices['Desktop Edge'],
        viewport: { width: 1600, height: 1200 },
        launchOptions: {
          args: ["--start-maximized", '--test-third-party-cookie-phaseout', '--disable-web-security'],
        },
        channel: 'msedge'
      }
    },
    {
      name: 'Pixel 5',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 13'] },
    },
  ],
});
