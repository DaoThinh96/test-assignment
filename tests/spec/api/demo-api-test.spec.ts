import { test, expect, request, APIRequestContext } from '@playwright/test';
import ENV from "../../../helper/env-config";
import { validateJsonSchema } from "../../../helper/validate-schema.ts";

test.describe('Verify api entries', () => {
  let contextRequest: APIRequestContext;

  test.beforeAll(async ({ playwright }) => {
    contextRequest = await playwright.request.newContext({
      baseURL: `${ENV.BASE_API_URL}`,
      extraHTTPHeaders: {
        'content-type': "application/json",
      },
    });
  });

  test('Verify 200OK', async () => {
    const response = await contextRequest.get("/entries");
    const body = await response.json();
    expect(response.status()).toBe(200);
    expect(response.statusText()).toBe('OK');
    await validateJsonSchema("entries-schema", "", body)
  });

  test('Verify 404 Not found - invalid url', async () => {
    const response = await contextRequest.get("/entriesssss");
    expect(response.status()).toBe(404);
    expect(response.statusText()).toBe('Not Found');
  });
});
