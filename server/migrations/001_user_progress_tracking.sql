-- User Progress Tracking Migration
-- Creates three tables: users, user_progress, and quiz_results
-- Run this in your Supabase SQL Editor

-- ============================================
-- Table: users
-- Stores user profiles tied to Solana wallet addresses
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  wallet_address TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_login TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  total_xp INTEGER NOT NULL DEFAULT 0,
  current_level INTEGER NOT NULL DEFAULT 1,
  CONSTRAINT check_total_xp_non_negative CHECK (total_xp >= 0),
  CONSTRAINT check_current_level_positive CHECK (current_level >= 1)
);

-- Indexes for performance on users table
CREATE INDEX IF NOT EXISTS idx_users_level ON users(current_level);
CREATE INDEX IF NOT EXISTS idx_users_xp ON users(total_xp);

-- ============================================
-- Table: user_progress
-- Tracks learning progress per topic for each user
-- ============================================
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT NOT NULL REFERENCES users(wallet_address) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  progress_percentage INTEGER NOT NULL DEFAULT 0,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  last_accessed TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT check_progress_range CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  CONSTRAINT unique_wallet_topic UNIQUE(wallet_address, topic)
);

-- Indexes for performance on user_progress table
CREATE INDEX IF NOT EXISTS idx_user_progress_wallet ON user_progress(wallet_address);
CREATE INDEX IF NOT EXISTS idx_user_progress_completed ON user_progress(completed);
CREATE INDEX IF NOT EXISTS idx_user_progress_last_accessed ON user_progress(last_accessed);

-- ============================================
-- Table: quiz_results
-- Stores quiz performance history for each user
-- ============================================
CREATE TABLE IF NOT EXISTS quiz_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT NOT NULL REFERENCES users(wallet_address) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT check_score_non_negative CHECK (score >= 0),
  CONSTRAINT check_total_questions_positive CHECK (total_questions > 0),
  CONSTRAINT check_score_not_exceed_total CHECK (score <= total_questions)
);

-- Indexes for performance on quiz_results table
CREATE INDEX IF NOT EXISTS idx_quiz_results_wallet ON quiz_results(wallet_address);
CREATE INDEX IF NOT EXISTS idx_quiz_results_topic ON quiz_results(topic);
CREATE INDEX IF NOT EXISTS idx_quiz_results_completed_at ON quiz_results(completed_at);

-- Optional: Disable Row Level Security for development
-- WARNING: Only use this in development! Enable RLS in production
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress DISABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_results DISABLE ROW LEVEL SECURITY;

-- Verify the setup
SELECT 'User Progress Tracking tables created successfully!' AS status;
