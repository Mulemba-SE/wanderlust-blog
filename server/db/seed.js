import "dotenv/config";
import { pool } from "./client";
import { authors, posts } from "../data/posts";
async function seed() {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        for (const author of authors) {
            await client.query(`INSERT INTO authors (id, name, avatar, bio)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (id) DO NOTHING`, [author.id, author.name, author.avatar, author.bio]);
        }
        for (const post of posts) {
            await client.query(`INSERT INTO posts
           (id, slug, title, excerpt, content, cover, category,
            author_id, published_at, read_time, featured, tags)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
         ON CONFLICT (id) DO NOTHING`, [
                post.id,
                post.slug,
                post.title,
                post.excerpt,
                post.content,
                post.cover,
                post.category,
                post.author.id,
                post.publishedAt,
                post.readTime,
                post.featured,
                post.tags,
            ]);
        }
        const adminEmail = process.env.ADMIN_EMAIL ?? "admin@wanderlust.local";
        await client.query(`INSERT INTO admins (email, password, role, name)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (email) DO NOTHING`, [
            adminEmail,
            "$2b$10$Pjx8tT0RmGGOG8QvCXWHAOyN1J7hWJNhOfGh6CL3mz8zGxKxQGmZC",
            "admin",
            "Evans",
        ]);
        await client.query(`INSERT INTO admins (email, password, role, name)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (email) DO NOTHING`, [
            "user@wanderlust.local",
            "$2b$10$Pjx8tT0RmGGOG8QvCXWHAOyN1J7hWJNhOfGh6CL3mz8zGxKxQGmZC",
            "editor",
            "Normal User",
        ]);
        await client.query("COMMIT");
        console.log(`Seeded ${authors.length} authors, ${posts.length} posts, and admins.`);
    }
    catch (err) {
        await client.query("ROLLBACK");
        throw err;
    }
    finally {
        client.release();
        await pool.end();
    }
}
seed().catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
});
