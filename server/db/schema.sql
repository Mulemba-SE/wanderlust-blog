CREATE TABLE IF NOT EXISTS authors (
  id         TEXT        PRIMARY KEY,
  name       TEXT        NOT NULL,
  avatar     TEXT        NOT NULL,
  bio        TEXT        NOT NULL
);

CREATE TABLE IF NOT EXISTS posts (
  id           TEXT        PRIMARY KEY,
  slug         TEXT        NOT NULL UNIQUE,
  title        TEXT        NOT NULL,
  excerpt      TEXT        NOT NULL,
  content      TEXT        NOT NULL,
  cover        TEXT        NOT NULL,
  category     TEXT        NOT NULL,
  author_id    TEXT        NOT NULL REFERENCES authors(id),
  published_at DATE        NOT NULL,
  read_time    INTEGER     NOT NULL,
  featured     BOOLEAN     NOT NULL DEFAULT FALSE,
  tags         TEXT[]      NOT NULL DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS admins (
  id         SERIAL      PRIMARY KEY,
  email      TEXT        NOT NULL UNIQUE,
  password   TEXT        NOT NULL,
  role       TEXT        NOT NULL DEFAULT 'editor',
  name       TEXT        NOT NULL DEFAULT '',
  phone      TEXT        NOT NULL DEFAULT '',
  gender     TEXT        NOT NULL DEFAULT '',
  reset_token TEXT,
  reset_token_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_posts_slug     ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_featured ON posts(featured);
