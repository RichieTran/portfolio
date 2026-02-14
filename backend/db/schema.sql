CREATE TABLE IF NOT EXISTS scores (
  id SERIAL PRIMARY KEY,
  name VARCHAR(32) NOT NULL,
  time_seconds INTEGER NOT NULL,
  difficulty VARCHAR(16) NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS scores_difficulty_time ON scores (difficulty, time_seconds ASC);
