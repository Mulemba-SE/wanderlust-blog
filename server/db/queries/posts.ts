import { pool } from "../client";
import { Post, Author } from "../../../shared/types/post";

/**
 * Maps a raw database row (snake_case, flat author columns)
 * back into the Post shape the rest of the app expects.
 */
function rowToPost(row: Record<string, unknown>): Post {
  const author: Author = {
    id:     row.author_id     as string,
    name:   row.author_name   as string,
    avatar: row.author_avatar as string,
    bio:    row.author_bio    as string,
  };

  return {
    id:          row.id          as string,
    slug:        row.slug        as string,
    title:       row.title       as string,
    excerpt:     row.excerpt     as string,
    content:     row.content     as string,
    cover:       row.cover       as string,
    category:    row.category    as Post["category"],
    author,
    publishedAt: row.published_at as string,
    readTime:    row.read_time   as number,
    featured:    row.featured    as boolean,
    tags:        row.tags        as string[],
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

export async function getAllPosts(): Promise<Post[]> {
  const { rows } = await pool.query(
    `${SELECT_POSTS} ORDER BY p.published_at DESC`
  );
  return rows.map(rowToPost);
}

export async function getFeaturedPosts(): Promise<Post[]> {
  const { rows } = await pool.query(
    `${SELECT_POSTS} WHERE p.featured = TRUE ORDER BY p.published_at DESC`
  );
  return rows.map(rowToPost);
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const { rows } = await pool.query(
    `${SELECT_POSTS} WHERE p.slug = $1`,
    [slug]
  );
  return rows.length ? rowToPost(rows[0]) : null;
}

export async function searchPosts(query: string): Promise<Post[]> {
  const { rows } = await pool.query(
    SEARCH_POSTS_SQL,
    [`%${query}%`]
  );
  return rows.map(rowToPost);
}

// Write queries.

export interface PostInput {
  title:       string;
  slug:        string;
  excerpt:     string;
  content:     string;
  cover:       string;
  category:    string;
  authorId:    string;
  publishedAt: string;
  readTime:    number;
  featured:    boolean;
  tags:        string[];
}

export async function createPost(input: PostInput): Promise<Post> {
  // Generate a short unique id: timestamp + 4 random hex chars
  const id = `${Date.now().toString(36)}-${Math.random().toString(16).slice(2, 6)}`;

  await pool.query(
    `INSERT INTO posts
       (id, slug, title, excerpt, content, cover, category,
        author_id, published_at, read_time, featured, tags)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
    [
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
    ]
  );

  // Return the full post with joined author data
  const post = await getPostBySlug(input.slug);
  return post!;
}

export async function updatePost(id: string, input: PostInput): Promise<Post | null> {
  const { rowCount } = await pool.query(
    `UPDATE posts SET
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
     WHERE id = $12`,
    [
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
    ]
  );

  if (rowCount === 0) return null;
  return getPostBySlug(input.slug);
}

export async function deletePost(id: string): Promise<boolean> {
  const { rowCount } = await pool.query(
    `DELETE FROM posts WHERE id = $1`,
    [id]
  );
  return rowCount !== null && rowCount > 0;
}
