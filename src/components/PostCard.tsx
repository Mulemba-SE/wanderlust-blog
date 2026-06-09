import React from "react";
import { Post } from "../types";

interface PostCardProps {
  post: Post;
  onSelect: (slug: string) => void;
  featured?: boolean;
}

const categoryColors: Record<string, string> = {
  Adventure: "#c85f35",
  Culture:   "#6f5b3e",
  Food:      "#d79d3d",
  Nature:    "#2f7d68",
  City:      "#4f6f8f",
};

const PostCard: React.FC<PostCardProps> = ({ post, onSelect, featured = false }) => {
  const color = categoryColors[post.category] ?? "#666";

  return (
    <article
      className={`post-card ${featured ? "post-card--featured" : ""}`}
      onClick={() => onSelect(post.slug)}
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect(post.slug);
        }
      }}
    >
      <div className="post-card__img-wrap">
        <img
          src={post.cover}
          alt={post.title}
          className="post-card__img"
          loading="lazy"
          decoding="async"
        />
        <span className="post-card__cat" style={{ background: color }}>
          {post.category}
        </span>
      </div>
      <div className="post-card__body">
        <div className="post-card__meta">
          <img src={post.author.avatar} alt={post.author.name} className="post-card__avatar" />
          <span className="post-card__author">{post.author.name}</span>
          <span className="post-card__time">{post.readTime} min read</span>
        </div>
        <h2 className="post-card__title">{post.title}</h2>
        <p className="post-card__excerpt">{post.excerpt}</p>
        <div className="post-card__foot">
          <div className="post-card__tags">
            {post.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
