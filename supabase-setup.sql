-- Sovereign dApp - Supabase Database Setup
-- Run this SQL in your Supabase SQL Editor

-- 1. Create Users Table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address TEXT UNIQUE NOT NULL,
  system_prompt TEXT DEFAULT 'You are Sovereign, a personalized AI tutor that adapts to the user''s learning style.',
  level TEXT DEFAULT 'Beginner',
  topics_mastered TEXT[] DEFAULT '{}',
  last_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create Messages Table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_messages_wallet ON public.messages(wallet_address);
CREATE INDEX IF NOT EXISTS idx_messages_created ON public.messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_users_wallet ON public.users(wallet_address);
CREATE INDEX IF NOT EXISTS idx_users_hash ON public.users(last_hash);

-- 4. Enable Row Level Security (RLS) - Optional for development
-- Uncomment these for production:

-- ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Create policies (allow all for development)
-- CREATE POLICY "Allow all operations on users" ON public.users FOR ALL USING (true);
-- CREATE POLICY "Allow all operations on messages" ON public.messages FOR ALL USING (true);

-- 5. Create a function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 6. Create trigger for users table
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 7. Insert a test user (optional)
-- INSERT INTO public.users (wallet_address, level, topics_mastered)
-- VALUES ('27sh189H11aUeKzsj9S7G99cSJF1ZPngPiTNJ5NCnqA3', 'Beginner', ARRAY['Getting Started'])
-- ON CONFLICT (wallet_address) DO NOTHING;

-- Verify tables were created
SELECT 
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
AND table_name IN ('users', 'messages');
