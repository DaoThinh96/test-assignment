import { FullConfig } from "@playwright/test";
import ENV from "./env-config";

// Environment variables are loaded in helper/env-config.ts at import time
// (driven by TEST_ENV). This hook just surfaces which environment is active.
async function globalSetup(_config: FullConfig) {
  console.log(`Running tests against environment: ${ENV.TEST_ENV} (${ENV.BASE_URL})`);
}

export default globalSetup;
