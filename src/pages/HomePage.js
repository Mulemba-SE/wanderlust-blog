import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from "react-router-dom";
import { fetchFeaturedPosts } from "../api/client";
import { useFetch } from "../hooks/useFetch";
import PostCard from "../components/PostCard";
const HomePage = () => {
    const navigate = useNavigate();
    const { data: featured, loading, error } = useFetch(() => fetchFeaturedPosts().then((json) => json.data), []);
    if (loading)
        return _jsx("div", { className: "loading", children: "Loading stories..." });
    if (error)
        return _jsx("div", { className: "not-found", children: _jsxs("h2", { children: ["Error: ", error] }) });
    return (_jsxs("div", { className: "home", children: [_jsxs("section", { className: "hero", children: [_jsx("div", { className: "hero__image" }), _jsxs("div", { className: "hero__content", children: [_jsx("p", { className: "hero__eyebrow", children: "Field notes for curious routes" }), _jsx("h1", { className: "hero__title", children: "Adventure begins where the map gets quiet" }), _jsx("p", { className: "hero__sub", children: "Real stories from mountain roads, slow trains, market mornings, and places that stay with you long after you leave." }), _jsxs("div", { className: "hero__actions", children: [_jsx("button", { className: "btn-primary", onClick: () => navigate("/blog"), children: "Read the stories" }), _jsx("button", { className: "btn-ghost btn-ghost--light", onClick: () => navigate("/about"), children: "Meet the writers" })] })] }), _jsxs("aside", { className: "hero__panel", "aria-label": "Latest route notes", children: [_jsx("p", { className: "hero__panel-label", children: "This month" }), _jsx("h2", { children: "Slow travel, sharper stories" }), _jsxs("div", { className: "hero__stats", children: [_jsxs("span", { children: [_jsx("strong", { children: "27" }), " field notes"] }), _jsxs("span", { children: [_jsx("strong", { children: "5" }), " story trails"] })] }), _jsx("p", { children: "Highland cabins, coastal roads, hidden food markets, and the little detours that make a journey worth remembering." })] })] }), _jsx("section", { className: "route-strip", "aria-label": "Travel themes", children: [
                    ["01", "Ridges", "Cold mornings, long views"],
                    ["02", "Markets", "Food stalls and local rituals"],
                    ["03", "Coastlines", "Roads that follow the weather"],
                ].map(([number, title, copy]) => (_jsxs("div", { className: "route-strip__item", children: [_jsx("span", { children: number }), _jsxs("div", { children: [_jsx("h2", { children: title }), _jsx("p", { children: copy })] })] }, title))) }), _jsxs("section", { className: "section", children: [_jsxs("div", { className: "section__header", children: [_jsxs("div", { children: [_jsx("p", { className: "section__eyebrow", children: "Editor picks" }), _jsx("h2", { className: "section__title", children: "Stories with dust on their boots" })] }), _jsx("button", { className: "btn-ghost", onClick: () => navigate("/blog"), children: "View all" })] }), _jsx("div", { className: "featured-grid", children: (featured ?? []).map((post, i) => (_jsx(PostCard, { post: post, featured: i === 0, onSelect: (slug) => navigate(`/blog/${slug}`) }, post.id))) })] }), _jsx("section", { className: "banner", children: _jsxs("div", { className: "banner__inner", children: [_jsx("span", { className: "banner__icon", children: "Travel well" }), _jsx("p", { className: "banner__text", children: "\"Not all those who wander are lost -- but some of us are, and we're having a great time.\"" })] }) })] }));
};
export default HomePage;
