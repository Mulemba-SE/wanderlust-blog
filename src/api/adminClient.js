/**
 * Admin API client: write operations (create, update, delete).
 * All requests are authenticated via the JWT stored in localStorage.
 * Throws UnauthorizedError on 401 so App.tsx can sign the user out cleanly.
 */
import { API } from "./endpoints";
import { getToken } from "./auth";
import { UnauthorizedError } from "./client";
const BASE_URL = import.meta.env.DEV
    ? "/api"
    : import.meta.env.VITE_API_URL
        ? `${import.meta.env.VITE_API_URL}/api`
        : "http://localhost:4000/api";
// Core fetch wrapper.
async function adminFetch(path, options = {}) {
    const token = getToken();
    const res = await fetch(`${BASE_URL}/${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            ...options.headers,
        },
    });
    if (res.status === 401)
        throw new UnauthorizedError();
    return res;
}
// Write helpers.
export async function adminCreatePost(payload) {
    const res = await adminFetch(API.POSTS, {
        method: "POST",
        body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok)
        throw new Error(json.message ?? "Failed to create post.");
    return json.data;
}
export async function adminUpdatePost(id, payload) {
    const res = await adminFetch(API.POST_BY_ID(id), {
        method: "PUT",
        body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok)
        throw new Error(json.message ?? "Failed to update post.");
    return json.data;
}
export async function adminDeletePost(id) {
    const res = await adminFetch(API.POST_BY_ID(id), { method: "DELETE" });
    if (!res.ok) {
        const json = await res.json();
        throw new Error(json.message ?? "Failed to delete post.");
    }
}
