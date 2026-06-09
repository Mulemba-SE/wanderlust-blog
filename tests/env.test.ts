import test from "node:test";
import assert from "node:assert/strict";
import { getAllowedOrigins, getMissingEnvVars } from "../server/config/env";

const completeEnv = {
  PGHOST: "localhost",
  PGPORT: "5432",
  PGUSER: "postgres",
  PGPASSWORD: "postgres",
  PGDATABASE: "wanderlust",
  JWT_SECRET: "test-secret",
  ALLOWED_ORIGINS: "http://localhost:5173",
};

test("getMissingEnvVars reports only absent required variables", () => {
  const result = getMissingEnvVars({
    ...completeEnv,
    JWT_SECRET: "",
    ALLOWED_ORIGINS: undefined,
  });

  assert.deepEqual(result, ["JWT_SECRET", "ALLOWED_ORIGINS"]);
});

test("getAllowedOrigins trims whitespace and ignores empty entries", () => {
  const result = getAllowedOrigins({
    ...completeEnv,
    ALLOWED_ORIGINS: " http://localhost:5173,https://example.com, ,",
  });

  assert.deepEqual(result, ["http://localhost:5173", "https://example.com"]);
});
