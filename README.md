# Playwright Test Automation Framework

End-to-end, API, and performance test suite for the [Demoblaze](https://www.demoblaze.com) demo store, built with **Playwright + TypeScript**, following the Page Object Model. Includes Allure reporting, multi-environment config, k6 load testing, and GitHub Actions CI.

---

## Prerequisites

- **Node.js** (LTS, v18+ — CI runs on v20)
- **npm**
- **k6** (only for performance tests) — https://grafana.com/docs/k6/latest/set-up/install-k6/
- **Allure CLI** (optional, for viewing Allure reports) — `npm install -g allure-commandline`

---

## 1. Install dependencies

```bash
npm install
npx playwright install --with-deps
```

---

## 2. Environment configuration

Environments are defined in `environments/.env.<name>` and selected via the `TEST_ENV`
variable (defaults to `staging`). Loaded at import time by `helper/env-config.ts`.

```text
environments/
├── .env.staging
└── .env.production
```

Each file provides:

```dotenv
BASE_URL          = "https://www.demoblaze.com"
BASE_API_URL      = "https://api.demoblaze.com"
STORAGE_STATE     = ".auth/user.json"
TEST_EMAIL        = "..."
TEST_PASSWORD     = "..."
TEST_CREDIT_CARD  = "..."
```

Run against a specific environment:

```bash
TEST_ENV=production npx playwright test
```

> Note: `environments/` and `.auth/` are git-ignored. In CI these files are generated
> from GitHub **Variables** (`BASE_URL`, `BASE_API_URL`) and **Secrets**
> (`TEST_EMAIL`, `TEST_PASSWORD`, `TEST_CREDIT_CARD`).

---

## 3. Project structure

```text
.
├── .api/                       # Stored JSON schemas for API validation
├── .auth/                      # Saved storage state (auth session) — git-ignored
├── .github/workflows/          # CI: manual runner + daily regression
├── environments/               # Per-environment .env files — git-ignored
├── fixtures/
│   └── base-fixture.ts         # Custom fixtures (homePage, cartPage)
├── helper/
│   ├── env-config.ts           # Loads env vars via TEST_ENV
│   ├── global-setup.ts         # Logs active environment
│   ├── schema-helper-functions.ts
│   └── validate-schema.ts      # Ajv-based JSON schema validation
├── page-objects/
│   ├── base-page/              # Shared actions (goto, click, fill, navigate)
│   ├── home-page/              # Home/login page objects
│   └── cart-page/              # Cart & place-order page objects
├── test-data/
│   └── test-data.json          # Non-sensitive test data
├── tests/spec/
│   ├── web/                    # E2E: auth.setup.ts, demo.spec.ts
│   ├── api/                    # API tests + schema validation
│   └── performance/            # k6 load test + HTML dashboard
├── playwright.config.ts
├── package.json
└── README.md
```

---

## 4. Running tests

The default `test` script runs the web suite on Chromium (which first runs the
`setup` project to authenticate and save the session to `.auth/user.json`).

```bash
# Web suite (Chromium) — same as CI
npm run test

# All tests / projects
npx playwright test

# Headed mode
npm run test:headed

# Single file
npx playwright test tests/spec/api/demo-api-test.spec.ts

# By tag
npx playwright test --grep @regression

# UI mode / debug
npx playwright test --ui
npx playwright test --debug
```

### Available projects

Defined in `playwright.config.ts`: `setup`, `chromium` (default, uses saved auth),
`edge`, `Pixel 5`, `Mobile Safari`.

```bash
npx playwright test --project=edge
```

---

## 5. API tests

Located in `tests/spec/api/`. They hit `BASE_API_URL`, assert status codes, and
validate the response against a stored JSON schema in `.api/` using Ajv.
To regenerate a schema from a live response, pass `createSchema = true` to
`validateJsonSchema(...)`.

```bash
npx playwright test tests/spec/api
```

---

## 6. Performance tests (k6)

```bash
# Run the k6 load test
npm run test:k6

# Run with an HTML dashboard report
npm run k6:specific:html-report
# -> tests/spec/performance/report/html-report.html
```

The load profile ramps to 30 virtual users with thresholds
`p(95) < 500ms` and error rate `< 1%`.

---

## 7. Reports

### Playwright HTML report

```bash
npm run test:report
# report generated at test-output/html
```

### Allure report

```bash
npm run allure:generate   # generate from test-output/allure-results
npm run allure:open       # open the generated report
npm run allure:serve      # generate + serve in one step
```

---

## 8. Continuous Integration

Two GitHub Actions workflows in `.github/workflows/`:

- **`ci.yml` — Manual Test Runner**: triggered via `workflow_dispatch`; choose
  `environment` (staging/production) and `test_type` (regression/e2e). Uploads the
  Allure report and raw results as artifacts.
- **`daily-run.yml` — Daily Regression**: runs on push/PR to `main` and on a daily
  cron (midnight UTC) against staging, uploading Allure artifacts.
