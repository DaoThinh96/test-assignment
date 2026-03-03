# Playwright Test Automation – Setup Guide

This README explains how to set up **Node.js**, **npm**, and **Playwright** to run the automation tests in this project.

---

## Prerequisites

Make sure you have the following installed on your machine:

* **Node.js** (LTS version recommended)
* **npm** (comes with Node.js)
* A modern browser (Chromium / Chrome is enough to start)

---

## 1. Install Node.js and npm

### Option A: Download from official website (recommended)

1. Go to: [https://nodejs.org](https://nodejs.org)
2. Download the **LTS** version
3. Install it using the default settings

Verify installation:

```bash
node -v
npm -v
```

You should see version numbers for both.

---

## 2. Install project dependencies

From the project root directory:

```bash
npm install --save-dev
```

This will install all dependencies defined in `package.json`.

---

## 3. Install Playwright

If Playwright is not already installed:

```bash
npm init playwright@latest
```

Or, if Playwright is already listed in `package.json`:

```bash
npx playwright install
```

This command downloads the required browser binaries.

---

## 4. Project Structure (example)

```text
project-root/
├── tests/
│   └── spec.           # Playwright test file
│   └── fixtures         
│   └── page-objects
│      ├── base-page    # Reusable step functions
│      └── cart-page    # Element selector and steps of cart page
│      └── home-page    # Element selector and steps of home page
│   └── test-data       # Data test
├── reports/                # Test reports and results
│    ├── allure-results/    # Allure test results
│    ├── allure-report/     # Generated Allure HTML report
│    └── test-results/      # Playwright test artifacts
├── playwright.config.ts    # Playwright configuration file
├── package.json            
└── README.md
```

---

## 5. Run tests

### Run all tests

```bash
npx playwright test
```

### Run tests in headed mode

```bash
npx playwright test --headed
```

### Run a specific test file

```bash
npm run test
```

---

## 6. View test report

After test execution:

```bash
npx playwright show-report
```

---

## 8. Useful commands

```bash
npx playwright test --ui      
npx playwright test --debug  
```

---