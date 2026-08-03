import dotenv from "dotenv";

// Load the environment file as early as possible (at import time) so that
// values are available while playwright.config.ts is being evaluated.
// Select the environment via TEST_ENV, defaulting to "staging".
const testEnv = process.env.TEST_ENV || "staging";

dotenv.config({
  path: `./environments/.env.${testEnv}`,
  override: true,
});

export default class ENV {
  public static TEST_ENV = testEnv;
  public static BASE_URL = process.env.BASE_URL;
  public static BASE_API_URL = process.env.BASE_API_URL;
  public static STORAGE_STATE = process.env.STORAGE_STATE;
}
