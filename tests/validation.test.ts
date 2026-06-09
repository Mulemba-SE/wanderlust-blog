import test from "node:test";
import assert from "node:assert/strict";
import { normalizePostBody } from "../server/middleware/validate";

const validPost = {
  title: "  A Rainy Week in Kyoto  ",
  slug: "a-rainy-week-in-kyoto",
  excerpt: "  A short excerpt.  ",
  content: "Full story.",
  cover: "https://images.example.com/kyoto.jpg",
  category: "Culture",
  authorId: "author-1",
  publishedAt: "2026-06-08",
  readTime: 7,
  tags: [" Japan ", "Travel", "japan", "", "Culture"],
};

test("normalizePostBody trims strings, defaults featured, and dedupes tags", () => {
  const result = normalizePostBody(validPost);

  assert.equal(result.ok, true);
  if (!result.ok) return;

  assert.equal(result.body.title, "A Rainy Week in Kyoto");
  assert.equal(result.body.excerpt, "A short excerpt.");
  assert.equal(result.body.featured, false);
  assert.deepEqual(result.body.tags, ["Japan", "Travel", "Culture"]);
});

test("normalizePostBody rejects non-object bodies", () => {
  const result = normalizePostBody(null);

  assert.equal(result.ok, false);
  if (result.ok) return;

  assert.deepEqual(result.errors, ["Request body must be a JSON object."]);
});

test("normalizePostBody rejects malformed fields without throwing", () => {
  const result = normalizePostBody({
    ...validPost,
    slug: "Bad Slug!",
    cover: "ftp://example.com/image.jpg",
    readTime: "7",
    publishedAt: "2026-02-31",
    featured: "yes",
    tags: ["valid", 42],
  });

  assert.equal(result.ok, false);
  if (result.ok) return;

  assert.match(result.errors.join("\n"), /slug must contain/);
  assert.match(result.errors.join("\n"), /cover URL must use http or https/);
  assert.match(result.errors.join("\n"), /readTime must be a positive whole number/);
  assert.match(result.errors.join("\n"), /publishedAt must be a valid date/);
  assert.match(result.errors.join("\n"), /featured must be a boolean/);
  assert.match(result.errors.join("\n"), /tags must contain only strings/);
});
