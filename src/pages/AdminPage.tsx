import React, { useState, useEffect, useCallback } from "react";
import { Post } from "../types";
import { fetchPosts, fetchAuthors, UnauthorizedError } from "../api/client";
import { adminCreatePost, adminUpdatePost, adminDeletePost, PostPayload } from "../api/adminClient";

// Types.

type View = "list" | "form";

interface Author {
  id: string;
  name: string;
}

const CATEGORIES = ["Adventure", "Culture", "Food", "Nature", "City"] as const;

const EMPTY_FORM: PostPayload = {
  title:       "",
  slug:        "",
  excerpt:     "",
  content:     "",
  cover:       "",
  category:    "Adventure",
  authorId:    "",
  publishedAt: new Date().toISOString().slice(0, 10),
  readTime:    5,
  featured:    false,
  tags:        [],
};

// Slug helper.

function toSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// Component.

interface AdminPageProps {
  onUnauthorized: () => void;
}

const AdminPage: React.FC<AdminPageProps> = ({ onUnauthorized }) => {
  const [view, setView]           = useState<View>("list");
  const [posts, setPosts]         = useState<Post[]>([]);
  const [authors, setAuthors]     = useState<Author[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);
  const [editingPost, setEditing] = useState<Post | null>(null);
  const [form, setForm]           = useState<PostPayload>(EMPTY_FORM);
  const [tagInput, setTagInput]   = useState("");
  const [saving, setSaving]       = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [deleteId, setDeleteId]   = useState<string | null>(null);

  // Load posts and authors.

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [postsRes, authorsRes] = await Promise.all([
        fetchPosts().then((r) => r.data as Post[]),
        fetchAuthors().then((r) => r.data as Author[]),
      ]);
      setPosts(postsRes);
      setAuthors(authorsRes);
    } catch (e: unknown) {
      if (e instanceof UnauthorizedError) { onUnauthorized(); return; }
      setError(e instanceof Error ? e.message : "Failed to load data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // Form helpers.

  function openCreate() {
    setEditing(null);
    setForm({ ...EMPTY_FORM, authorId: authors[0]?.id ?? "" });
    setTagInput("");
    setSaveError(null);
    setView("form");
  }

  function openEdit(post: Post) {
    setEditing(post);
    setForm({
      title:       post.title,
      slug:        post.slug,
      excerpt:     post.excerpt,
      content:     post.content,
      cover:       post.cover,
      category:    post.category,
      authorId:    post.author.id,
      publishedAt: post.publishedAt.slice(0, 10),
      readTime:    post.readTime,
      featured:    post.featured,
      tags:        post.tags,
    });
    setTagInput("");
    setSaveError(null);
    setView("form");
  }

  function handleField<K extends keyof PostPayload>(key: K, value: PostPayload[K]) {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      // Auto-generate slug from title when creating a new post
      if (key === "title" && !editingPost) {
        next.slug = toSlug(value as string);
      }
      return next;
    });
  }

  function addTag() {
    const tag = tagInput.trim();
    if (!tag || form.tags.includes(tag)) return;
    handleField("tags", [...form.tags, tag]);
    setTagInput("");
  }

  function removeTag(tag: string) {
    handleField("tags", form.tags.filter((t) => t !== tag));
  }

  // Save.

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);
    try {
      if (editingPost) {
        await adminUpdatePost(editingPost.id, form);
      } else {
        await adminCreatePost(form);
      }
      await loadData();
      setView("list");
    } catch (e: unknown) {
      if (e instanceof UnauthorizedError) { onUnauthorized(); return; }
      setSaveError(e instanceof Error ? e.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  // Delete.

  async function handleDelete(id: string) {
    try {
      await adminDeletePost(id);
      await loadData();
    } catch (e: unknown) {
      if (e instanceof UnauthorizedError) { onUnauthorized(); return; }
      setError(e instanceof Error ? e.message : "Delete failed.");
    } finally {
      setDeleteId(null);
    }
  }

  // Render list.

  if (loading) return <div className="loading">Loading admin panel...</div>
  if (error)   return <div className="not-found"><h2>Error: {error}</h2></div>;

  if (view === "list") {
    return (
      <div className="admin">
        <div className="admin__header">
          <div>
            <h1 className="admin__title">Admin</h1>
            <p className="admin__sub">{posts.length} {posts.length === 1 ? "post" : "posts"}</p>
          </div>
          <button className="btn-primary" onClick={openCreate}>
            + New post
          </button>
        </div>

        <div className="admin__table-wrap">
          <table className="admin__table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Author</th>
                <th>Published</th>
                <th>Featured</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id}>
                  <td className="admin__td-title">{post.title}</td>
                  <td><span className="cat-pill cat-pill--sm">{post.category}</span></td>
                  <td>{post.author.name}</td>
                  <td>{post.publishedAt.slice(0, 10)}</td>
                  <td>{post.featured ? "Yes" : "No"}</td>
                  <td className="admin__td-actions">
                    <button className="admin__btn-edit" onClick={() => openEdit(post)}>
                      Edit
                    </button>
                    <button
                      className="admin__btn-delete"
                      onClick={() => setDeleteId(post.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Delete confirmation dialog */}
        {deleteId && (
          <div className="admin__overlay">
            <div className="admin__dialog">
              <h3>Delete this post?</h3>
              <p>This action cannot be undone.</p>
              <div className="admin__dialog-actions">
                <button className="btn-ghost" onClick={() => setDeleteId(null)}>
                  Cancel
                </button>
                <button className="admin__btn-delete" onClick={() => handleDelete(deleteId)}>
                  Yes, delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Render form.

  return (
    <div className="admin">
      <div className="admin__header">
        <div>
          <h1 className="admin__title">{editingPost ? "Edit post" : "New post"}</h1>
          <p className="admin__sub">
            {editingPost ? `Editing: ${editingPost.title}` : "Fill in the details below"}
          </p>
        </div>
        <button className="btn-ghost" onClick={() => setView("list")}>
          &lt;- Back
        </button>
      </div>

      <form className="admin__form" onSubmit={handleSave}>

        {/* Title */}
        <div className="admin__field">
          <label className="admin__label">Title *</label>
          <input
            className="admin__input"
            value={form.title}
            onChange={(e) => handleField("title", e.target.value)}
            placeholder="A Rainy Week in Kyoto"
            required
          />
        </div>

        {/* Slug */}
        <div className="admin__field">
          <label className="admin__label">Slug *</label>
          <input
            className="admin__input admin__input--mono"
            value={form.slug}
            onChange={(e) => handleField("slug", e.target.value)}
            placeholder="a-rainy-week-in-kyoto"
            required
          />
          <span className="admin__hint">Auto-generated from title. Edit if needed.</span>
        </div>

        {/* Excerpt */}
        <div className="admin__field">
          <label className="admin__label">Excerpt *</label>
          <textarea
            className="admin__input admin__textarea"
            rows={2}
            value={form.excerpt}
            onChange={(e) => handleField("excerpt", e.target.value)}
            placeholder="One or two sentences that hook the reader."
            required
          />
        </div>

        {/* Content */}
        <div className="admin__field">
          <label className="admin__label">Content *</label>
          <textarea
            className="admin__input admin__textarea admin__textarea--lg"
            rows={12}
            value={form.content}
            onChange={(e) => handleField("content", e.target.value)}
            placeholder="The full story goes here..."
            required
          />
        </div>

        {/* Cover URL */}
        <div className="admin__field">
          <label className="admin__label">Cover image URL *</label>
          <input
            className="admin__input"
            value={form.cover}
            onChange={(e) => handleField("cover", e.target.value)}
            placeholder="https://images.unsplash.com/..."
            required
          />
          {form.cover && (
            <img className="admin__cover-preview" src={form.cover} alt="Cover preview" />
          )}
        </div>

        {/* Category, author, date, and read time */}
        <div className="admin__row">
          <div className="admin__field">
            <label className="admin__label">Category *</label>
            <select
              className="admin__input admin__select"
              value={form.category}
              onChange={(e) => handleField("category", e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="admin__field">
            <label className="admin__label">Author *</label>
            <select
              className="admin__input admin__select"
              value={form.authorId}
              onChange={(e) => handleField("authorId", e.target.value)}
            >
              {authors.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>

          <div className="admin__field">
            <label className="admin__label">Published date *</label>
            <input
              className="admin__input"
              type="date"
              value={form.publishedAt}
              onChange={(e) => handleField("publishedAt", e.target.value)}
              required
            />
          </div>

          <div className="admin__field">
            <label className="admin__label">Read time (mins) *</label>
            <input
              className="admin__input"
              type="number"
              min={1}
              max={60}
              value={form.readTime}
              onChange={(e) => handleField("readTime", Number(e.target.value))}
              required
            />
          </div>
        </div>

        {/* Tags */}
        <div className="admin__field">
          <label className="admin__label">Tags</label>
          <div className="admin__tag-row">
            <input
              className="admin__input admin__input--tag"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
              placeholder="Type a tag and press Enter"
            />
            <button type="button" className="btn-ghost" onClick={addTag}>Add</button>
          </div>
          <div className="admin__tags">
            {form.tags.map((tag) => (
              <span key={tag} className="admin__tag">
                {tag}
                <button
                  type="button"
                  className="admin__tag-remove"
                  onClick={() => removeTag(tag)}
                >
                  x
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Featured */}
        <div className="admin__field admin__field--checkbox">
          <input
            id="featured"
            type="checkbox"
            className="admin__checkbox"
            checked={form.featured}
            onChange={(e) => handleField("featured", e.target.checked)}
          />
          <label htmlFor="featured" className="admin__label admin__label--inline">
            Feature this post on the homepage
          </label>
        </div>

        {/* Errors + Submit */}
        {saveError && <p className="admin__error">{saveError}</p>}

        <div className="admin__form-actions">
          <button type="button" className="btn-ghost" onClick={() => setView("list")}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? "Saving..." : editingPost ? "Save changes" : "Publish post"}
          </button>
        </div>

      </form>
    </div>
  );
};

export default AdminPage;
