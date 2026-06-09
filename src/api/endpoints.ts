export const API = {
  AUTHORS:          "authors"          as const,
  POSTS:            "posts"            as const,
  POSTS_FEATURED:   "posts/featured"   as const,
  POSTS_SEARCH:     "posts/search"     as const,
  POST_BY_SLUG:     (slug: string) => `posts/${slug}` as const,
  POST_BY_ID:       (id: string)   => `posts/${id}`   as const,
  AUTH_SIGNUP:      "auth/signup"      as const,
} as const;
