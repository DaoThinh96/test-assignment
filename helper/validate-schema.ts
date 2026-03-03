import { createJsonSchema } from "../helper/schema-helper-functions.ts";
import { expect } from "@playwright/test";
import Ajv from "ajv";

export async function validateJsonSchema(fileName: string, filePath: string = '', body: object, createSchema = false) {
  const jsonName = fileName;
  const path = filePath;

  if (createSchema) {
    await createJsonSchema(jsonName, path, body);
  }

  const existingSchema = require(`../.api/${path}/${jsonName}.json`);

  const ajv = new Ajv({ allErrors: false });
  const validate = ajv.compile(existingSchema);
  const validRes = validate(body);

  if (!validRes) {
    const errorDetails = JSON.stringify(validate.errors, null, 2);
    const responseBody = JSON.stringify(body, null, 2);

    console.error("SCHEMA VALIDATION FAILED");
    console.error("Errors:", errorDetails);
    console.error("Response Body:", responseBody);

    throw new Error(`Schema validation failed:\n${errorDetails}`);
  }

  console.log("SCHEMA IS CORRECT");
  return true;
}