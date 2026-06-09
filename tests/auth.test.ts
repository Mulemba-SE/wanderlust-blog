import test from "node:test";
import assert from "node:assert/strict";
import jwt from "jsonwebtoken";
import { requireAuth, AuthRequest } from "../server/middleware/auth";
import { Response } from "express";

function createResponse() {
  const response = {
    statusCode: 200,
    body: undefined as unknown,
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(payload: unknown) {
      this.body = payload;
      return this;
    },
  };

  return response as Response & typeof response;
}

test("requireAuth rejects missing bearer token", () => {
  const req = { headers: {} } as AuthRequest;
  const res = createResponse();
  let nextCalled = false;

  requireAuth(req, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, false);
  assert.equal(res.statusCode, 401);
  assert.deepEqual(res.body, { message: "No token provided. Please log in." });
});

test("requireAuth attaches decoded admin and calls next for valid tokens", () => {
  process.env.JWT_SECRET = "test-secret";
  const token = jwt.sign({ id: 7, email: "admin@example.com" }, process.env.JWT_SECRET);
  const req = { headers: { authorization: `Bearer ${token}` } } as AuthRequest;
  const res = createResponse();
  let nextCalled = false;

  requireAuth(req, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, true);
  assert.equal(req.admin?.id, 7);
  assert.equal(req.admin?.email, "admin@example.com");
});
