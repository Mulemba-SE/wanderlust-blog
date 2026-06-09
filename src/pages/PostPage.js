import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate, useParams } from "react-router-dom";
import { fetchPostBySlug } from "../api/client";
import { useFetch } from "../hooks/useFetch";
const categoryColors = {
    Adventure: "#c85f35",
    Culture: "#6f5b3e",
    Food: "#d79d3d",
    Nature: "#2f7d68",
    City: "#4f6f8f",
};
const PostPage = () => {
    const { slug = "" } = useParams();
    const navigate = useNavigate();
    const { data: post, loading, error } = useFetch(() => fetchPostBySlug(slug).then((json) => json.data), [slug]);
    if (loading)
        return _jsx("div", { className: "loading", children: "Loading story..." });
    if (error)
        return (_jsxs("div", { className: "not-found", children: [_jsx("h2", { children: "Story not found" }), _jsx("button", { className: "btn-primary", onClick: () => navigate("/blog"), children: "Back to stories" })] }));
    if (!post)
        return null;
    const color = categoryColors[post.category] ?? "#666";
    return (_jsxs("article", { className: "post-page", children: [_jsx("button", { className: "back-btn", onClick: () => navigate("/blog"), children: "Back to stories" }), _jsxs("div", { className: "post-page__hero", style: { backgroundImage: `url(${post.cover})` }, children: [_jsx("div", { className: "post-page__hero-overlay" }), _jsxs("div", { className: "post-page__hero-content", children: [_jsx("span", { className: "post-card__cat", style: { background: color }, children: post.category }), _jsx("h1", { className: "post-page__title", children: post.title }), _jsx("p", { className: "post-page__excerpt", children: post.excerpt }), _jsxs("div", { className: "post-page__hero-meta", children: [_jsx("span", { children: post.author.name }), _jsxs("span", { children: [post.readTime, " min read"] })] })] })] }), _jsxs("div", { className: "post-page__body", children: [_jsxs("div", { className: "post-page__author-row", children: [_jsx("img", { src: post.author.avatar, alt: post.author.name, className: "post-page__avatar" }), _jsxs("div", { children: [_jsx("p", { className: "post-page__author-name", children: post.author.name }), _jsx("p", { className: "post-page__author-bio", children: post.author.bio })] }), _jsxs("div", { className: "post-page__meta-right", children: [_jsx("span", { children: new Date(post.publishedAt).toLocaleDateString("en-GB", {
                                            day: "numeric", month: "long", year: "numeric",
                                        }) }), _jsxs("span", { children: [post.readTime, " min read"] })] })] }), _jsx("div", { className: "post-page__content", children: post.content.split("\n\n").map((para, i) => _jsx("p", { children: para }, i)) }), _jsx("div", { className: "post-page__tags", children: post.tags.map((tag) => _jsx("span", { className: "tag", children: tag }, tag)) })] })] }));
};
export default PostPage;
