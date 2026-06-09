import React from "react";
import { Author } from "../types";
import { fetchAuthors } from "../api/client";
import { useFetch } from "../hooks/useFetch";

const AboutPage: React.FC = () => {
  const { data: authors, loading, error } = useFetch<Author[]>(
    () => fetchAuthors().then((json) => json.data),
    []
  );

  return (
    <div className="about-page">
      <div className="about-page__hero">
        <div>
          <p className="section__eyebrow">Independent travel journal</p>
          <h1 className="about-page__title">We go places.<br />We write things.</h1>
          <p className="about-page__sub">
            Wanderlust is an independent travel and lifestyle publication run by three friends
            who couldn't stop travelling and decided to write about it instead of getting proper jobs.
            No sponsored posts. No affiliate links. Just honest stories from the road.
          </p>
        </div>
        <div className="about-page__photo" aria-hidden="true" />
      </div>

      <div className="about-page__values">
        {[
          { icon: "01", title: "Honest writing",       desc: "We only write about places we've actually been. Revolutionary, we know." },
          { icon: "02", title: "Diverse perspectives", desc: "Three writers, three very different takes on the same planet." },
          { icon: "03", title: "No sponsored content", desc: "Nobody pays us to say nice things. That keeps us honest and occasionally broke." },
        ].map((v) => (
          <div key={v.title} className="value-card">
            <span className="value-card__icon">{v.icon}</span>
            <h3 className="value-card__title">{v.title}</h3>
            <p className="value-card__desc">{v.desc}</p>
          </div>
        ))}
      </div>

      <h2 className="about-page__team-title">The writers</h2>

      {loading && <div className="loading">Loading writers...</div>}
      {error   && <div className="not-found"><h2>Could not load authors.</h2></div>}

      {authors && (
        <div className="about-page__team">
          {authors.map((author) => (
            <div key={author.id} className="author-card">
              <img src={author.avatar} alt={author.name} className="author-card__avatar" />
              <h3 className="author-card__name">{author.name}</h3>
              <p className="author-card__bio">{author.bio}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AboutPage;
