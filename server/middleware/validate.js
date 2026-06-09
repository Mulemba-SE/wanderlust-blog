const VALID_CATEGORIES = ["Adventure", "Culture", "Food", "Nature", "City"];
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
function isPlainObject(value) {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}
function requiredString(body, key, label, errors, maxLength) {
    const value = body[key];
    if (typeof value !== "string") {
        errors.push(`${label} is required.`);
        return "";
    }
    const trimmed = value.trim();
    if (!trimmed) {
        errors.push(`${label} is required.`);
        return "";
    }
    if (maxLength !== undefined && trimmed.length > maxLength) {
        errors.push(`${label} must be ${maxLength} characters or fewer.`);
    }
    return trimmed;
}
function isValidDateOnly(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value))
        return false;
    const date = new Date(`${value}T00:00:00.000Z`);
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}
export function normalizePostBody(input) {
    const errors = [];
    if (!isPlainObject(input)) {
        return {
            ok: false,
            errors: ["Request body must be a JSON object."],
        };
    }
    const body = input;
    const title = requiredString(body, "title", "title", errors, 160);
    const slug = requiredString(body, "slug", "slug", errors, 120);
    const excerpt = requiredString(body, "excerpt", "excerpt", errors, 500);
    const content = requiredString(body, "content", "content", errors);
    const cover = requiredString(body, "cover", "cover URL", errors, 1000);
    const authorId = requiredString(body, "authorId", "authorId", errors, 120);
    const publishedAt = requiredString(body, "publishedAt", "publishedAt", errors);
    if (slug && !SLUG_PATTERN.test(slug)) {
        errors.push("slug must contain lowercase letters, numbers, and single hyphens only.");
    }
    if (cover) {
        try {
            const parsed = new URL(cover);
            if (!["http:", "https:"].includes(parsed.protocol)) {
                errors.push("cover URL must use http or https.");
            }
        }
        catch {
            errors.push("cover URL must be a valid URL.");
        }
    }
    const category = body.category;
    let normalizedCategory = "";
    if (typeof category !== "string" || !VALID_CATEGORIES.includes(category)) {
        errors.push(`category must be one of: ${VALID_CATEGORIES.join(", ")}.`);
    }
    else {
        normalizedCategory = category;
    }
    const readTime = body.readTime;
    let normalizedReadTime = 0;
    if (readTime === undefined || readTime === null) {
        errors.push("readTime is required.");
    }
    else if (typeof readTime !== "number" || !Number.isInteger(readTime) || readTime < 1) {
        errors.push("readTime must be a positive whole number.");
    }
    else {
        normalizedReadTime = readTime;
    }
    const featured = body.featured;
    if (featured !== undefined && typeof featured !== "boolean") {
        errors.push("featured must be a boolean.");
    }
    const normalizedFeatured = typeof featured === "boolean" ? featured : false;
    const tags = body.tags;
    let normalizedTags = [];
    if (tags !== undefined) {
        if (!Array.isArray(tags)) {
            errors.push("tags must be an array of strings.");
        }
        else {
            const seen = new Set();
            normalizedTags = tags
                .map((tag) => (typeof tag === "string" ? tag.trim() : ""))
                .filter((tag) => {
                if (!tag || seen.has(tag.toLowerCase()))
                    return false;
                seen.add(tag.toLowerCase());
                return true;
            });
            if (tags.some((tag) => typeof tag !== "string")) {
                errors.push("tags must contain only strings.");
            }
            if (normalizedTags.some((tag) => tag.length > 40)) {
                errors.push("tags must be 40 characters or fewer.");
            }
            if (normalizedTags.length > 20) {
                errors.push("tags cannot contain more than 20 items.");
            }
        }
    }
    if (publishedAt && !isValidDateOnly(publishedAt)) {
        errors.push("publishedAt must be a valid date in YYYY-MM-DD format.");
    }
    if (errors.length > 0) {
        return { ok: false, errors };
    }
    return {
        ok: true,
        body: {
            title,
            slug,
            excerpt,
            content,
            cover,
            category: normalizedCategory,
            authorId,
            publishedAt,
            readTime: normalizedReadTime,
            featured: normalizedFeatured,
            tags: normalizedTags,
        },
    };
}
/**
 * Validates the `q` query parameter on search endpoints.
 */
export function validateSearchQuery(req, res, next) {
    const { q } = req.query;
    if (q === undefined || q === null) {
        res.status(400).json({ message: "Missing search query. Provide ?q=your+search." });
        return;
    }
    if (typeof q !== "string") {
        res.status(400).json({ message: "Search query must be a string." });
        return;
    }
    const trimmed = q.trim();
    if (trimmed.length === 0) {
        res.status(400).json({ message: "Search query cannot be empty." });
        return;
    }
    if (trimmed.length > 100) {
        res.status(400).json({
            message: `Search query is too long (${trimmed.length} characters). Maximum is 100.`,
        });
        return;
    }
    req.query.q = trimmed;
    next();
}
/**
 * Validates the request body for POST /api/posts and PUT /api/posts/:id.
 *
 * Required fields: title, slug, excerpt, content, cover,
 *                  category, authorId, publishedAt, readTime
 * Optional fields: featured (defaults to false), tags (defaults to [])
 */
export function validatePost(req, res, next) {
    const result = normalizePostBody(req.body);
    if (!result.ok) {
        res.status(400).json({ message: "Validation failed.", errors: result.errors });
        return;
    }
    req.body = result.body;
    next();
}
