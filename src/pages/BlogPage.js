import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from "react-router-dom";
import { Category } from "../types";
import { usePosts } from "../hooks/usePosts";
import PostCard from "../components/PostCard";
const categories = [
    "All",
    Category.Adventure,
    Category.Culture,
    Category.Food,
    Category.Nature,
    Category.City,
];
const BlogPage = () => {
    const navigate = useNavigate();
    const { filtered, activeCategory, setCategory, query, setQuery, total, loading, error } = usePosts();
    if (loading)
        return _jsx("div", { className: "loading", children: "Loading stories..." });
    if (error)
        return _jsx("div", { className: "not-found", children: _jsxs("h2", { children: ["Error: ", error] }) });
    return (_jsxs("div", { className: "blog-page", children: [_jsxs("div", { className: "blog-page__hero", children: [_jsxs("div", { children: [_jsx("p", { className: "section__eyebrow", children: "Dispatch library" }), _jsx("h1", { className: "blog-page__title", children: "Find your next route" }), _jsx("p", { className: "blog-page__intro", children: "Browse honest travel notes by destination, appetite, weather, and the kind of day you want to remember." })] }), _jsxs("div", { className: "blog-page__count", children: [_jsx("strong", { children: total }), _jsx("span", { children: total === 1 ? "story" : "stories" })] })] }), _jsxs("div", { className: "blog-page__controls", children: [_jsx("label", { className: "search-label", htmlFor: "story-search", children: "Search stories" }), _jsx("input", { id: "story-search", className: "search-input", type: "text", placeholder: "Search destinations, topics...", value: query, onChange: (e) => setQuery(e.target.value) }), _jsx("div", { className: "category-pills", children: categories.map((cat) => (_jsx("button", { className: `cat-pill ${activeCategory === cat ? "cat-pill--active" : ""}`, onClick: () => setCategory(cat), children: cat }, cat))) })] }), filtered.length === 0 ? (_jsxs("div", { className: "empty-state", children: [_jsx("span", { className: "empty-state__icon", children: "No match" }), _jsx("p", { children: "No stories match your search. Try a different destination." })] })) : (_jsx("div", { className: "blog-grid", children: filtered.map((post) => (_jsx(PostCard, { post: post, onSelect: (slug) => navigate(`/blog/${slug}`) }, post.id))) }))] }));
};
export default BlogPage;
