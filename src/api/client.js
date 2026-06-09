import { API } from "./endpoints";
import { getToken } from "./auth";
const BASE_URL = import.meta.env.DEV
    ? "/api"
    : import.meta.env.VITE_API_URL
        ? `${import.meta.env.VITE_API_URL}/api`
        : "http://localhost:4000/api";
// Shared error type.
// Thrown when the server responds with 401. App.tsx catches this and signs
// the user out, rather than leaving them stuck on a broken page.
export class UnauthorizedError extends Error {
    constructor() {
        super("Session expired. Please sign in again.");
        this.name = "UnauthorizedError";
    }
}
// Core fetch wrapper.
async function apiFetch(path, options = {}) {
    const token = getToken();
    const headers = {
        "Content-Type": "application/json",
        ...options.headers,
    };
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }
    const res = await fetch(`${BASE_URL}/${path}`, { ...options, headers });
    if (res.status === 401)
        throw new UnauthorizedError();
    return res;
}
// Public read helpers.
export async function fetchAuthors() {
    const res = await apiFetch(API.AUTHORS);
    if (!res.ok)
        throw new Error("Failed to fetch authors");
    return res.json();
}
export async function fetchPosts() {
    const res = await apiFetch(API.POSTS);
    if (!res.ok)
        throw new Error("Failed to fetch posts");
    return res.json();
}
export async function fetchFeaturedPosts() {
    const res = await apiFetch(API.POSTS_FEATURED);
    if (!res.ok)
        throw new Error("Failed to fetch featured posts");
    return res.json();
}
export async function fetchPostBySlug(slug) {
    const res = await apiFetch(API.POST_BY_SLUG(slug));
    if (!res.ok)
        throw new Error("Post not found");
    return res.json();
}
export async function searchPosts(query) {
    const res = await apiFetch(`${API.POSTS_SEARCH}?q=${encodeURIComponent(query)}`);
    if (!res.ok)
        throw new Error("Search failed");
    return res.json();
}
export async function signup(payload) {
    const res = await apiFetch(API.AUTH_SIGNUP, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({ message: "Sign up failed." }));
        throw new Error(err.message ?? "Sign up failed.");
    }
    return res.json();
}
