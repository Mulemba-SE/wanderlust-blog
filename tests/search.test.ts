import test from "node:test";
import assert from "node:assert/strict";
import { SEARCH_POSTS_SQL } from "../server/db/queries/posts";

test("post search SQL matches tags case-insensitively", () => {
  assert.match(SEARCH_POSTS_SQL, /p\.title ILIKE \$1/);
  assert.match(SEARCH_POSTS_SQL, /FROM unnest\(p\.tags\) AS tag/);
  assert.match(SEARCH_POSTS_SQL, /tag ILIKE \$1/);
});
