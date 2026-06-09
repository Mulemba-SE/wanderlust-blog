export const API = {
    AUTHORS: "authors",
    POSTS: "posts",
    POSTS_FEATURED: "posts/featured",
    POSTS_SEARCH: "posts/search",
    POST_BY_SLUG: (slug) => `posts/${slug}`,
    POST_BY_ID: (id) => `posts/${id}`,
    AUTH_SIGNUP: "auth/signup",
};
