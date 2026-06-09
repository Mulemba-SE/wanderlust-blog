import { pool } from "../client";
/**
 * Maps a raw database row (snake_case, flat author columns)
 * back into the Post shape the rest of the app expects.
 */
function rowToPost(row) {
    const author = {
        id: row.author_id,
        name: row.author_name,
        avatar: row.author_avatar,
        bio: row.author_bio,
    };
    return {
        id: row.id,
        slug: row.slug,
        title: row.title,
        excerpt: row.excerpt,
        content: row.content,
        cover: row.cover,
        category: row.category,
        author,
        publishedAt: row.published_at,
        readTime: row.read_time,
        featured: row.featured,
        tags: row.tags,
    };
}
const SELECT_POSTS = `
  SELECT
    p.*,
    a.name   AS author_name,
    a.avatar AS author_avatar,
    a.bio    AS author_bio
  FROM posts p
  JOIN authors a ON a.id = p.author_id
`;
export const SEARCH_POSTS_SQL = `${SELECT_POSTS}
     WHERE p.title ILIKE $1
        OR EXISTS (
          SELECT 1
          FROM unnest(p.tags) AS tag
          WHERE tag ILIKE $1
        )
     ORDER BY p.published_at DESC`;
// Read queries.
export async function getAllPosts() {
    const { rows } = await pool.query(`${SELECT_POSTS} ORDER BY p.published_at DESC`);
    return rows.map(rowToPost);
}
export async function getFeaturedPosts() {
    const { rows } = await pool.query(`${SELECT_POSTS} WHERE p.featured = TRUE ORDER BY p.published_at DESC`);
    return rows.map(rowToPost);
}
export async function getPostBySlug(slug) {
    const { rows } = await pool.query(`${SELECT_POSTS} WHERE p.slug = $1`, [slug]);
    return rows.length ? rowToPost(rows[0]) : null;
}
export async function searchPosts(query) {
    const { rows } = await pool.query(SEARCH_POSTS_SQL, [`%${query}%`]);
    return rows.map(rowToPost);
}
export async function createPost(input) {
    // Generate a short unique id: timestamp + 4 random hex chars
    const id = `${Date.now().toString(36)}-${Math.random().toString(16).slice(2, 6)}`;
    await pool.query(`INSERT INTO posts
       (id, slug, title, excerpt, content, cover, category,
        author_id, published_at, read_time, featured, tags)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`, [
        id,
        input.slug,
        input.title,
        input.excerpt,
        input.content,
        input.cover,
        input.category,
        input.authorId,
        input.publishedAt,
        input.readTime,
        input.featured,
        input.tags,
    ]);
    // Return the full post with joined author data
    const post = await getPostBySlug(input.slug);
    return post;
}
export async function updatePost(id, input) {
    const { rowCount } = await pool.query(`UPDATE posts SET
       slug         = $1,
       title        = $2,
       excerpt      = $3,
       content      = $4,
       cover        = $5,
       category     = $6,
       author_id    = $7,
       published_at = $8,
       read_time    = $9,
       featured     = $10,
       tags         = $11
     WHERE id = $12`, [
        input.slug,
        input.title,
        input.excerpt,
        input.content,
        input.cover,
        input.category,
        input.authorId,
        input.publishedAt,
        input.readTime,
        input.featured,
        input.tags,
        id,
    ]);
    if (rowCount === 0)
        return null;
    return getPostBySlug(input.slug);
}
export async function deletePost(id) {
    const { rowCount } = await pool.query(`DELETE FROM posts WHERE id = $1`, [id]);
    return rowCount !== null && rowCount > 0;
}
