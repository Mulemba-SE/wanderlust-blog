import { Router } from "express";
import {
  getAllPosts,
  getFeaturedPosts,
  getPostBySlug,
  searchPosts,
  createPost,
  updatePost,
  deletePost,
} from "../db/queries/posts";
import { validateSearchQuery, validatePost } from "../middleware/validate";
import { requireAuth, requireRole } from "../middleware/auth";

const router = Router();

// Read routes.

// GET /api/posts
router.get("/posts", async (req, res) => {
  try {
    const posts = await getAllPosts();
    res.json({ data: posts, total: posts.length });
  } catch (err) {
    console.error("[GET /posts]", err);
    res.status(500).json({ message: "Failed to fetch posts" });
  }
});

// GET /api/posts/featured
router.get("/posts/featured", async (req, res) => {
  try {
    const posts = await getFeaturedPosts();
    res.json({ data: posts, total: posts.length });
  } catch (err) {
    console.error("[GET /posts/featured]", err);
    res.status(500).json({ message: "Failed to fetch featured posts" });
  }
});

// GET /api/posts/search?q=tokyo
router.get("/posts/search", validateSearchQuery, async (req, res) => {
  try {
    const query = req.query.q as string;
    const posts = await searchPosts(query);
    res.json({ data: posts, total: posts.length });
  } catch (err) {
    console.error("[GET /posts/search]", err);
    res.status(500).json({ message: "Search failed" });
  }
});

// GET /api/posts/:slug  (must come after /featured and /search)
router.get("/posts/:slug", async (req, res) => {
  try {
    const post = await getPostBySlug(req.params.slug);
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json({ data: post });
  } catch (err) {
    console.error("[GET /posts/:slug]", err);
    res.status(500).json({ message: "Failed to fetch post" });
  }
});

// Write routes.

// POST /api/posts
router.post("/posts", requireAuth, requireRole("admin", "editor"), validatePost, async (req, res) => {
  try {
    const { title, slug, excerpt, content, cover, category,
            authorId, publishedAt, readTime, featured = false, tags = [] } = req.body;

    const existing = await getPostBySlug(slug);
    if (existing) {
      return res.status(409).json({ message: `A post with slug "${slug}" already exists.` });
    }

    const post = await createPost({
      title, slug, excerpt, content, cover, category,
      authorId, publishedAt, readTime, featured, tags,
    });

    res.status(201).json({ data: post });
  } catch (err) {
    console.error("[POST /posts]", err);
    res.status(500).json({ message: "Failed to create post" });
  }
});

// PUT /api/posts/:id
router.put("/posts/:id", requireAuth, requireRole("admin", "editor"), validatePost, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, slug, excerpt, content, cover, category,
            authorId, publishedAt, readTime, featured = false, tags = [] } = req.body;

    const slugOwner = await getPostBySlug(slug);
    if (slugOwner && slugOwner.id !== id) {
      return res.status(409).json({ message: `Slug "${slug}" is already used by another post.` });
    }

    const post = await updatePost(id, {
      title, slug, excerpt, content, cover, category,
      authorId, publishedAt, readTime, featured, tags,
    });

    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json({ data: post });
  } catch (err) {
    console.error("[PUT /posts/:id]", err);
    res.status(500).json({ message: "Failed to update post" });
  }
});

// DELETE /api/posts/:id
router.delete("/posts/:id", requireAuth, requireRole("admin"), async (req, res) => {
  try {
    const deleted = await deletePost(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Post not found" });
    res.json({ message: "Post deleted successfully." });
  } catch (err) {
    console.error("[DELETE /posts/:id]", err);
    res.status(500).json({ message: "Failed to delete post" });
  }
});

export default router;
