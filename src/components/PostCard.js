import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const categoryColors = {
    Adventure: "#c85f35",
    Culture: "#6f5b3e",
    Food: "#d79d3d",
    Nature: "#2f7d68",
    City: "#4f6f8f",
};
const PostCard = ({ post, onSelect, featured = false }) => {
    const color = categoryColors[post.category] ?? "#666";
    return (_jsxs("article", { className: `post-card ${featured ? "post-card--featured" : ""}`, onClick: () => onSelect(post.slug), tabIndex: 0, onKeyDown: (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onSelect(post.slug);
            }
        }, children: [_jsxs("div", { className: "post-card__img-wrap", children: [_jsx("img", { src: post.cover, alt: post.title, className: "post-card__img", loading: "lazy", decoding: "async" }), _jsx("span", { className: "post-card__cat", style: { background: color }, children: post.category })] }), _jsxs("div", { className: "post-card__body", children: [_jsxs("div", { className: "post-card__meta", children: [_jsx("img", { src: post.author.avatar, alt: post.author.name, className: "post-card__avatar" }), _jsx("span", { className: "post-card__author", children: post.author.name }), _jsxs("span", { className: "post-card__time", children: [post.readTime, " min read"] })] }), _jsx("h2", { className: "post-card__title", children: post.title }), _jsx("p", { className: "post-card__excerpt", children: post.excerpt }), _jsx("div", { className: "post-card__foot", children: _jsx("div", { className: "post-card__tags", children: post.tags.slice(0, 2).map((tag) => (_jsx("span", { className: "tag", children: tag }, tag))) }) })] })] }));
};
export default PostCard;
