import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from "react";
import { fetchPosts, fetchAuthors, UnauthorizedError } from "../api/client";
import { adminCreatePost, adminUpdatePost, adminDeletePost } from "../api/adminClient";
const CATEGORIES = ["Adventure", "Culture", "Food", "Nature", "City"];
const EMPTY_FORM = {
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    cover: "",
    category: "Adventure",
    authorId: "",
    publishedAt: new Date().toISOString().slice(0, 10),
    readTime: 5,
    featured: false,
    tags: [],
};
// Slug helper.
function toSlug(title) {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
}
const AdminPage = ({ onUnauthorized }) => {
    const [view, setView] = useState("list");
    const [posts, setPosts] = useState([]);
    const [authors, setAuthors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingPost, setEditing] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [tagInput, setTagInput] = useState("");
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    // Load posts and authors.
    const loadData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [postsRes, authorsRes] = await Promise.all([
                fetchPosts().then((r) => r.data),
                fetchAuthors().then((r) => r.data),
            ]);
            setPosts(postsRes);
            setAuthors(authorsRes);
        }
        catch (e) {
            if (e instanceof UnauthorizedError) {
                onUnauthorized();
                return;
            }
            setError(e instanceof Error ? e.message : "Failed to load data.");
        }
        finally {
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
    function openEdit(post) {
        setEditing(post);
        setForm({
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt,
            content: post.content,
            cover: post.cover,
            category: post.category,
            authorId: post.author.id,
            publishedAt: post.publishedAt.slice(0, 10),
            readTime: post.readTime,
            featured: post.featured,
            tags: post.tags,
        });
        setTagInput("");
        setSaveError(null);
        setView("form");
    }
    function handleField(key, value) {
        setForm((prev) => {
            const next = { ...prev, [key]: value };
            // Auto-generate slug from title when creating a new post
            if (key === "title" && !editingPost) {
                next.slug = toSlug(value);
            }
            return next;
        });
    }
    function addTag() {
        const tag = tagInput.trim();
        if (!tag || form.tags.includes(tag))
            return;
        handleField("tags", [...form.tags, tag]);
        setTagInput("");
    }
    function removeTag(tag) {
        handleField("tags", form.tags.filter((t) => t !== tag));
    }
    // Save.
    async function handleSave(e) {
        e.preventDefault();
        setSaving(true);
        setSaveError(null);
        try {
            if (editingPost) {
                await adminUpdatePost(editingPost.id, form);
            }
            else {
                await adminCreatePost(form);
            }
            await loadData();
            setView("list");
        }
        catch (e) {
            if (e instanceof UnauthorizedError) {
                onUnauthorized();
                return;
            }
            setSaveError(e instanceof Error ? e.message : "Save failed.");
        }
        finally {
            setSaving(false);
        }
    }
    // Delete.
    async function handleDelete(id) {
        try {
            await adminDeletePost(id);
            await loadData();
        }
        catch (e) {
            if (e instanceof UnauthorizedError) {
                onUnauthorized();
                return;
            }
            setError(e instanceof Error ? e.message : "Delete failed.");
        }
        finally {
            setDeleteId(null);
        }
    }
    // Render list.
    if (loading)
        return _jsx("div", { className: "loading", children: "Loading admin panel..." });
    if (error)
        return _jsx("div", { className: "not-found", children: _jsxs("h2", { children: ["Error: ", error] }) });
    if (view === "list") {
        return (_jsxs("div", { className: "admin", children: [_jsxs("div", { className: "admin__header", children: [_jsxs("div", { children: [_jsx("h1", { className: "admin__title", children: "Admin" }), _jsxs("p", { className: "admin__sub", children: [posts.length, " ", posts.length === 1 ? "post" : "posts"] })] }), _jsx("button", { className: "btn-primary", onClick: openCreate, children: "+ New post" })] }), _jsx("div", { className: "admin__table-wrap", children: _jsxs("table", { className: "admin__table", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Title" }), _jsx("th", { children: "Category" }), _jsx("th", { children: "Author" }), _jsx("th", { children: "Published" }), _jsx("th", { children: "Featured" }), _jsx("th", { children: "Actions" })] }) }), _jsx("tbody", { children: posts.map((post) => (_jsxs("tr", { children: [_jsx("td", { className: "admin__td-title", children: post.title }), _jsx("td", { children: _jsx("span", { className: "cat-pill cat-pill--sm", children: post.category }) }), _jsx("td", { children: post.author.name }), _jsx("td", { children: post.publishedAt.slice(0, 10) }), _jsx("td", { children: post.featured ? "Yes" : "No" }), _jsxs("td", { className: "admin__td-actions", children: [_jsx("button", { className: "admin__btn-edit", onClick: () => openEdit(post), children: "Edit" }), _jsx("button", { className: "admin__btn-delete", onClick: () => setDeleteId(post.id), children: "Delete" })] })] }, post.id))) })] }) }), deleteId && (_jsx("div", { className: "admin__overlay", children: _jsxs("div", { className: "admin__dialog", children: [_jsx("h3", { children: "Delete this post?" }), _jsx("p", { children: "This action cannot be undone." }), _jsxs("div", { className: "admin__dialog-actions", children: [_jsx("button", { className: "btn-ghost", onClick: () => setDeleteId(null), children: "Cancel" }), _jsx("button", { className: "admin__btn-delete", onClick: () => handleDelete(deleteId), children: "Yes, delete" })] })] }) }))] }));
    }
    // Render form.
    return (_jsxs("div", { className: "admin", children: [_jsxs("div", { className: "admin__header", children: [_jsxs("div", { children: [_jsx("h1", { className: "admin__title", children: editingPost ? "Edit post" : "New post" }), _jsx("p", { className: "admin__sub", children: editingPost ? `Editing: ${editingPost.title}` : "Fill in the details below" })] }), _jsx("button", { className: "btn-ghost", onClick: () => setView("list"), children: "<- Back" })] }), _jsxs("form", { className: "admin__form", onSubmit: handleSave, children: [_jsxs("div", { className: "admin__field", children: [_jsx("label", { className: "admin__label", children: "Title *" }), _jsx("input", { className: "admin__input", value: form.title, onChange: (e) => handleField("title", e.target.value), placeholder: "A Rainy Week in Kyoto", required: true })] }), _jsxs("div", { className: "admin__field", children: [_jsx("label", { className: "admin__label", children: "Slug *" }), _jsx("input", { className: "admin__input admin__input--mono", value: form.slug, onChange: (e) => handleField("slug", e.target.value), placeholder: "a-rainy-week-in-kyoto", required: true }), _jsx("span", { className: "admin__hint", children: "Auto-generated from title. Edit if needed." })] }), _jsxs("div", { className: "admin__field", children: [_jsx("label", { className: "admin__label", children: "Excerpt *" }), _jsx("textarea", { className: "admin__input admin__textarea", rows: 2, value: form.excerpt, onChange: (e) => handleField("excerpt", e.target.value), placeholder: "One or two sentences that hook the reader.", required: true })] }), _jsxs("div", { className: "admin__field", children: [_jsx("label", { className: "admin__label", children: "Content *" }), _jsx("textarea", { className: "admin__input admin__textarea admin__textarea--lg", rows: 12, value: form.content, onChange: (e) => handleField("content", e.target.value), placeholder: "The full story goes here...", required: true })] }), _jsxs("div", { className: "admin__field", children: [_jsx("label", { className: "admin__label", children: "Cover image URL *" }), _jsx("input", { className: "admin__input", value: form.cover, onChange: (e) => handleField("cover", e.target.value), placeholder: "https://images.unsplash.com/...", required: true }), form.cover && (_jsx("img", { className: "admin__cover-preview", src: form.cover, alt: "Cover preview" }))] }), _jsxs("div", { className: "admin__row", children: [_jsxs("div", { className: "admin__field", children: [_jsx("label", { className: "admin__label", children: "Category *" }), _jsx("select", { className: "admin__input admin__select", value: form.category, onChange: (e) => handleField("category", e.target.value), children: CATEGORIES.map((c) => (_jsx("option", { value: c, children: c }, c))) })] }), _jsxs("div", { className: "admin__field", children: [_jsx("label", { className: "admin__label", children: "Author *" }), _jsx("select", { className: "admin__input admin__select", value: form.authorId, onChange: (e) => handleField("authorId", e.target.value), children: authors.map((a) => (_jsx("option", { value: a.id, children: a.name }, a.id))) })] }), _jsxs("div", { className: "admin__field", children: [_jsx("label", { className: "admin__label", children: "Published date *" }), _jsx("input", { className: "admin__input", type: "date", value: form.publishedAt, onChange: (e) => handleField("publishedAt", e.target.value), required: true })] }), _jsxs("div", { className: "admin__field", children: [_jsx("label", { className: "admin__label", children: "Read time (mins) *" }), _jsx("input", { className: "admin__input", type: "number", min: 1, max: 60, value: form.readTime, onChange: (e) => handleField("readTime", Number(e.target.value)), required: true })] })] }), _jsxs("div", { className: "admin__field", children: [_jsx("label", { className: "admin__label", children: "Tags" }), _jsxs("div", { className: "admin__tag-row", children: [_jsx("input", { className: "admin__input admin__input--tag", value: tagInput, onChange: (e) => setTagInput(e.target.value), onKeyDown: (e) => { if (e.key === "Enter") {
                                            e.preventDefault();
                                            addTag();
                                        } }, placeholder: "Type a tag and press Enter" }), _jsx("button", { type: "button", className: "btn-ghost", onClick: addTag, children: "Add" })] }), _jsx("div", { className: "admin__tags", children: form.tags.map((tag) => (_jsxs("span", { className: "admin__tag", children: [tag, _jsx("button", { type: "button", className: "admin__tag-remove", onClick: () => removeTag(tag), children: "x" })] }, tag))) })] }), _jsxs("div", { className: "admin__field admin__field--checkbox", children: [_jsx("input", { id: "featured", type: "checkbox", className: "admin__checkbox", checked: form.featured, onChange: (e) => handleField("featured", e.target.checked) }), _jsx("label", { htmlFor: "featured", className: "admin__label admin__label--inline", children: "Feature this post on the homepage" })] }), saveError && _jsx("p", { className: "admin__error", children: saveError }), _jsxs("div", { className: "admin__form-actions", children: [_jsx("button", { type: "button", className: "btn-ghost", onClick: () => setView("list"), children: "Cancel" }), _jsx("button", { type: "submit", className: "btn-primary", disabled: saving, children: saving ? "Saving..." : editingPost ? "Save changes" : "Publish post" })] })] })] }));
};
export default AdminPage;
