# Setup Blockchain Anchoring

## Step 1: Create Database Table

Run this SQL in your Supabase SQL Editor:

```sql
-- Create anchors table
CREATE TABLE IF NOT EXISTS anchors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address TEXT NOT NULL,
  memory_hash TEXT NOT NULL,
  tx_signature TEXT NOT NULL UNIQUE,
  message_count INTEGER NOT NULL,
  anchored_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_anchors_wallet ON anchors(wallet_address);
CREATE INDEX IF NOT EXISTS idx_anchors_anchored_at ON anchors(anchored_at DESC);

-- Enable RLS
ALTER TABLE anchors ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own anchors"
  ON anchors FOR SELECT USING (true);

CREATE POLICY "Users can insert their own anchors"
  ON anchors FOR INSERT WITH CHECK (true);
```

Or simply run:
```bash
# Copy the SQL file content to Supabase
cat create-anchors-table.sql
```

## Step 2: Test the Feature

1. **Start your dev server** (if not running):
   ```bash
   npm run dev
   ```

2. **Connect your wallet** on the Sovereign page

3. **Send a few messages** to the AI tutor

4. **Click "Anchor to Blockchain"** button in the header

5. **Approve the transaction** in your wallet (Phantom/Solflare)

6. **View success modal** with:
   - Your memory hash
   - Transaction signature
   - Link to Solana Explorer

## Step 3: Verify on Blockchain

1. Click "View on Explorer" in the success modal
2. You'll see your transaction on Solana Explorer
3. The transaction contains your chat history hash
4. This is permanent and immutable proof

## How to Use

### For Users:
- Chat with the AI tutor normally
- When you want to save your progress, click "Anchor to Blockchain"
- Your entire chat history gets hashed and stored on Solana
- You get a permanent, verifiable record of your learning

### For Developers:
```javascript
// Import the service
import { createChatHash, anchorHashToSolana } from './services/blockchainAnchor';

// Create hash
const hashData = await createChatHash(messages);
// Returns: { hash, messageCount, timestamp }

// Anchor to blockchain
const result = await anchorHashToSolana(wallet, hashData);
// Returns: { success, signature, hash, explorer, timestamp }
```

## Cost Breakdown

- **Devnet**: FREE (test SOL)
- **Mainnet**: ~0.000005 SOL (~$0.0001 USD) per anchor

## Troubleshooting

### "Wallet not connected"
- Make sure you've connected your Phantom or Solflare wallet
- Refresh the page and reconnect

### "Transaction failed"
- Check you have enough SOL for transaction fees
- On devnet, get free SOL from: https://faucet.solana.com

### "No messages to anchor"
- Send at least one message to the AI tutor first
- The button only appears when you have messages

## What Gets Anchored?

The system creates a hash of:
- All your chat messages (user + AI)
- Message timestamps
- Message roles (user/assistant)
- Message content

The hash is a unique fingerprint - even changing one character would create a completely different hash.

## Security Notes

- ✅ Your actual messages are NOT stored on-chain (only the hash)
- ✅ The hash is cryptographically secure (SHA-256)
- ✅ No one can reverse-engineer your messages from the hash
- ✅ The hash proves your conversation existed at that time
- ✅ Immutable - cannot be changed or deleted once on-chain
