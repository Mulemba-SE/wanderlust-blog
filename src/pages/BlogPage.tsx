import React from "react";
import { useNavigate } from "react-router-dom";
import { Category } from "../types";
import { usePosts } from "../hooks/usePosts";
import { Category as CategoryEnum } from "../types"; // Renamed to avoid conflict
import PostCard from "../components/PostCard";

const categories: Array<Category | "All"> = [
  "All",
  Category.Adventure,
  Category.Culture,
  Category.Food,
  Category.Nature,
 Category.City,
];

const BlogPage: React.FC = () => {
  const navigate = useNavigate();
  const { filtered, activeCategory, setCategory, query, setQuery, total, loading, error } = usePosts();

  if (loading) return <div className="loading">Loading stories...</div>;
  if (error)   return <div className="not-found"><h2>Error: {error}</h2></div>;

  return (
    <div className="blog-page">
      <div className="blog-page__hero">
        <div>
          <p className="section__eyebrow">Dispatch library</p>
          <h1 className="blog-page__title">Find your next route</h1>
          <p className="blog-page__intro">
            Browse honest travel notes by destination, appetite, weather, and
            the kind of day you want to remember.
          </p>
        </div>
        <div className="blog-page__count">
          <strong>{total}</strong>
          <span>{total === 1 ? "story" : "stories"}</span>
        </div>
      </div>

      {/* Added controls back from BlogPage.js */}
      <div className="blog-page__controls">
        <label className="search-label" htmlFor="story-search">
          Search stories
        </label>
        <input
          id="story-search"
          className="search-input"
          type="text"
          placeholder="Search destinations, topics..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="category-pills">{categories.map((cat) => (<button className={`cat-pill ${activeCategory === cat ? "cat-pill--active" : ""}`} onClick={() => setCategory(cat)} key={cat}>{cat}</button>))}</div></div>
      {filtered.length === 0 ? (
        <div className="empty-state">
          <span className="empty-state__icon">No match</span>
          <p>No stories match your search. Try a different destination.</p>
        </div>
      ) : (
        <div className="blog-grid">
          {filtered.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onSelect={(slug) => navigate(`/blog/${slug}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogPage;
