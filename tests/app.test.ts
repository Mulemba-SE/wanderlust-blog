import test from "node:test";
import assert from "node:assert/strict";
import { AddressInfo } from "node:net";
import { createApp } from "../server/app";

test("createApp returns JSON 404 responses and applies allowed CORS origin", async () => {
  const server = createApp({ allowedOrigins: ["http://localhost:5173"] }).listen(0);

  try {
    const { port } = server.address() as AddressInfo;
    const response = await fetch(`http://127.0.0.1:${port}/missing`, {
      headers: { Origin: "http://localhost:5173" },
    });

    assert.equal(response.status, 404);
    assert.equal(response.headers.get("access-control-allow-origin"), "http://localhost:5173");
    assert.deepEqual(await response.json(), { message: "Route GET /missing not found" });
  } finally {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
});
