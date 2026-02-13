-- Check if profiles table exists, if not create it
-- Run this in Supabase SQL Editor

-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address TEXT UNIQUE NOT NULL,
  system_prompt TEXT DEFAULT 'You are Sovereign, a personalized AI tutor.',
  level TEXT DEFAULT 'Beginner',
  topics_mastered TEXT[] DEFAULT '{}',
  last_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS profiles_wallet_address_idx ON public.profiles (wallet_address);

-- Enable Row Level Security (optional for development)
-- ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Verify both tables exist
SELECT 
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name AND table_schema = 'public') as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'chats')
ORDER BY table_name;
