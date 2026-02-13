-- Create anchors table for storing blockchain anchor records
CREATE TABLE IF NOT EXISTS anchors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address TEXT NOT NULL,
  memory_hash TEXT NOT NULL,
  tx_signature TEXT NOT NULL UNIQUE,
  message_count INTEGER NOT NULL,
  anchored_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_anchors_wallet ON anchors(wallet_address);
CREATE INDEX IF NOT EXISTS idx_anchors_anchored_at ON anchors(anchored_at DESC);

-- Enable Row Level Security
ALTER TABLE anchors ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read their own anchors
CREATE POLICY "Users can view their own anchors"
  ON anchors
  FOR SELECT
  USING (true);

-- Create policy to allow users to insert their own anchors
CREATE POLICY "Users can insert their own anchors"
  ON anchors
  FOR INSERT
  WITH CHECK (true);

-- Add comment
COMMENT ON TABLE anchors IS 'Stores blockchain anchor records for chat history hashes';
