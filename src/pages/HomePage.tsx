import React from "react";
import { useNavigate } from "react-router-dom";
import { Post } from "../types";
import { fetchFeaturedPosts } from "../api/client";
import { useFetch } from "../hooks/useFetch";
import PostCard from "../components/PostCard";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const { data: featured, loading, error } = useFetch<Post[]>(
    () => fetchFeaturedPosts().then((json) => json.data),
    []
  );

  if (loading) return <div className="loading">Loading stories...</div>;
  if (error)   return <div className="not-found"><h2>Error: {error}</h2></div>;

  return (
    <div className="home">
      <section className="hero">
        <div className="hero__image" />
        <div className="hero__content">
          <p className="hero__eyebrow">Field notes for curious routes</p>
          <h1 className="hero__title">
            Adventure begins where the map gets quiet
          </h1>
          <p className="hero__sub">
            Real stories from mountain roads, slow trains, market mornings, and
            places that stay with you long after you leave.
          </p>
          <div className="hero__actions">
            <button className="btn-primary" onClick={() => navigate("/blog")}>
              Read the stories
            </button>
            <button className="btn-ghost btn-ghost--light" onClick={() => navigate("/about")}>
              Meet the writers
            </button>
          </div>
        </div>
        <aside className="hero__panel" aria-label="Latest route notes">
          <p className="hero__panel-label">This month</p>
          <h2>Slow travel, sharper stories</h2>
          <div className="hero__stats">
            <span><strong>27</strong> field notes</span>
            <span><strong>5</strong> story trails</span>
          </div>
          <p>
            Highland cabins, coastal roads, hidden food markets, and the little
            detours that make a journey worth remembering.
          </p>
        </aside>
      </section>

      <section className="route-strip" aria-label="Travel themes">
        {[
          ["01", "Ridges", "Cold mornings, long views"],
          ["02", "Markets", "Food stalls and local rituals"],
          ["03", "Coastlines", "Roads that follow the weather"],
        ].map(([number, title, copy]) => (
          <div className="route-strip__item" key={title}>
            <span>{number}</span>
            <div>
              <h2>{title}</h2>
              <p>{copy}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="section">
        <div className="section__header">
          <div>
            <p className="section__eyebrow">Editor picks</p>
            <h2 className="section__title">Stories with dust on their boots</h2>
          </div>
          <button className="btn-ghost" onClick={() => navigate("/blog")}>View all</button>
        </div>
        <div className="featured-grid">
          {(featured ?? []).map((post, i) => (
            <PostCard
              key={post.id}
              post={post}
              featured={i === 0}
              onSelect={(slug) => navigate(`/blog/${slug}`)}
            />
          ))}
        </div>
      </section>

      <section className="banner">
        <div className="banner__inner">
          <span className="banner__icon">Travel well</span>
          <p className="banner__text">
            "Not all those who wander are lost -- but some of us are, and we're having a great time."
          </p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
