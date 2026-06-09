import { useState, useMemo, useEffect } from "react";
import { fetchPosts } from "../api/client";
export function usePosts() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeCategory, setCategory] = useState("All");
    const [query, setQuery] = useState("");
    useEffect(() => {
        fetchPosts()
            .then((json) => {
            setPosts(json.data);
            setLoading(false);
        })
            .catch((err) => {
            setError(err.message);
            setLoading(false);
        });
    }, []);
    const filtered = useMemo(() => {
        let result = query
            ? posts.filter((p) => p.title.toLowerCase().includes(query.toLowerCase()) ||
                p.tags.some((t) => t.toLowerCase().includes(query.toLowerCase())))
            : posts;
        if (activeCategory !== "All") {
            result = result.filter((p) => p.category === activeCategory);
        }
        return result;
    }, [posts, activeCategory, query]);
    return { filtered, activeCategory, setCategory, query, setQuery, total: filtered.length, loading, error };
}
