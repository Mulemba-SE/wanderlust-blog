import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Post } from "../types";
import { fetchPostBySlug } from "../api/client";
import { useFetch } from "../hooks/useFetch";

const categoryColors: Record<string, string> = {
  Adventure: "#c85f35",
  Culture:   "#6f5b3e",
  Food:      "#d79d3d",
  Nature:    "#2f7d68",
  City:      "#4f6f8f",
};

const PostPage: React.FC = () => {
  const { slug = "" } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const { data: post, loading, error } = useFetch<Post>(
    () => fetchPostBySlug(slug).then((json) => json.data),
    [slug]
  );

  if (loading) return <div className="loading">Loading story...</div>;
  if (error) return (
    <div className="not-found">
      <h2>Story not found</h2>
      <button className="btn-primary" onClick={() => navigate("/blog")}>
        Back to stories
      </button>
    </div>
  );
  if (!post) return null;

  const color = categoryColors[post.category] ?? "#666";

  return (
    <article className="post-page">
      <button className="back-btn" onClick={() => navigate("/blog")}>
        Back to stories
      </button>

      <div className="post-page__hero" style={{ backgroundImage: `url(${post.cover})` }}>
        <div className="post-page__hero-overlay" />
        <div className="post-page__hero-content">
          <span className="post-card__cat" style={{ background: color }}>
            {post.category}
          </span>
          <h1 className="post-page__title">{post.title}</h1>
          <p className="post-page__excerpt">{post.excerpt}</p>
          <div className="post-page__hero-meta">
            <span>{post.author.name}</span>
            <span>{post.readTime} min read</span>
          </div>
        </div>
      </div>

      <div className="post-page__body">
        <div className="post-page__author-row">
          <img src={post.author.avatar} alt={post.author.name} className="post-page__avatar" />
          <div>
            <p className="post-page__author-name">{post.author.name}</p>
            <p className="post-page__author-bio">{post.author.bio}</p>
          </div>
          <div className="post-page__meta-right">
            <span>
              {new Date(post.publishedAt).toLocaleDateString("en-GB", {
                day: "numeric", month: "long", year: "numeric",
              })}
            </span>
            <span>{post.readTime} min read</span>
          </div>
        </div>

        <div className="post-page__content">
          {post.content.split("\n\n").map((para, i) => <p key={i}>{para}</p>)}
        </div>

        <div className="post-page__tags">
          {post.tags.map((tag) => <span key={tag} className="tag">{tag}</span>)}
        </div>
      </div>
    </article>
  );
};

export default PostPage;
