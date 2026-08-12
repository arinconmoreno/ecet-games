-- E-CET Games Database Schema
-- Run this in the Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Registrations table (one game per user)
CREATE TABLE IF NOT EXISTS registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  game_id TEXT NOT NULL CHECK (game_id IN ('stopots', 'gartic', 'fifa', 'cod')),
  registered_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)  -- One registration per user
);

-- Scores table
CREATE TABLE IF NOT EXISTS scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  game_id TEXT NOT NULL CHECK (game_id IN ('stopots', 'gartic', 'fifa', 'cod')),
  points INTEGER DEFAULT 0,
  wins INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES users(id),
  UNIQUE(user_id, game_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_registrations_game ON registrations(game_id);
CREATE INDEX IF NOT EXISTS idx_registrations_user ON registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_scores_game ON scores(game_id);
CREATE INDEX IF NOT EXISTS idx_scores_points ON scores(game_id, points DESC);

-- Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;

-- Policies: Allow service role full access (API routes use service key)
CREATE POLICY "Service role full access users" ON users FOR ALL
  USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access registrations" ON registrations FOR ALL
  USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access scores" ON scores FOR ALL
  USING (true) WITH CHECK (true);

-- Seed admin users (optional — they auto-create on first login)
-- INSERT INTO users (name, email, is_admin) VALUES
--   ('Andres Felipe Mira Tabares', 'andres.mira@sofka.com.co', true),
--   ('Andres Rincon Moreno', 'andres.rincon@sofka.com.co', true),
--   ('Cristofer Buitrago Cocoma', 'david.buitrago@sofka.com.co', true),
--   ('Alejandra Calderon Moncada', 'alejandra.calderon@sofka.com.co', true)
-- ON CONFLICT (email) DO NOTHING;
