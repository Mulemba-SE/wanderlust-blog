import { useState, useMemo, useEffect } from "react";
import { Post, Category } from "../types";
import { fetchPosts } from "../api/client";

interface UsePostsResult {
  filtered: Post[];
  activeCategory: Category | "All";
  setCategory: (cat: Category | "All") => void;
  query: string;
  setQuery: (q: string) => void;
  total: number;
  loading: boolean;
  error: string | null;
}

export function usePosts(): UsePostsResult {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setCategory] = useState<Category | "All">("All");
  const [query, setQuery] = useState<string>("");

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

  const filtered = useMemo<Post[]>(() => {
    let result = query
      ? posts.filter(
          (p) =>
            p.title.toLowerCase().includes(query.toLowerCase()) ||
            p.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()))
        )
      : posts;

    if (activeCategory !== "All") {
      result = result.filter((p) => p.category === activeCategory);
    }
    return result;
  }, [posts, activeCategory, query]);

  return { filtered, activeCategory, setCategory, query, setQuery, total: filtered.length, loading, error };
}
