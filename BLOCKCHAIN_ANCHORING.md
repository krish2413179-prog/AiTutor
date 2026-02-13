# Blockchain Anchoring System

## Overview
This system allows users to cryptographically anchor their chat history to the Solana blockchain, creating an immutable proof of their learning journey.

## How It Works

### 1. Hash Creation
- Grabs all chat messages from the current session
- Sorts them by timestamp for deterministic ordering
- Creates a JSON representation of the conversation
- Generates a SHA-256 hash (unique fingerprint) of the data

### 2. Blockchain Anchoring
- Creates a Solana transaction with the hash embedded
- Uses a 0 SOL self-transfer (minimal cost, ~0.000005 SOL)
- Signs the transaction with the user's wallet
- Submits to Solana devnet and waits for confirmation
- Returns the transaction signature as proof

### 3. Database Recording
- Saves the anchor record to Supabase `anchors` table
- Updates the user's profile with the latest memory hash
- Stores: hash, transaction signature, message count, timestamp

## Features

### AnchorButton Component
- Shows "Anchor to Blockchain" button when messages exist
- Displays loading state during anchoring process
- Shows success modal with:
  - Memory hash (SHA-256)
  - Transaction signature
  - Link to Solana Explorer
  - Message count and network info

### Security & Verification
- Hash is cryptographically secure (SHA-256)
- Transaction is permanently stored on Solana blockchain
- Anyone can verify the hash exists on-chain using the signature
- Immutable proof of learning progress

## Database Schema

### anchors table
```sql
- id: UUID (primary key)
- wallet_address: TEXT (user's wallet)
- memory_hash: TEXT (SHA-256 hash)
- tx_signature: TEXT (Solana transaction signature)
- message_count: INTEGER (number of messages)
- anchored_at: TIMESTAMPTZ (when anchored)
```

## Usage

1. **User chats with AI tutor**
2. **Clicks "Anchor to Blockchain" button**
3. **System creates hash of chat history**
4. **Wallet prompts for transaction signature**
5. **Hash is anchored to Solana blockchain**
6. **Success modal shows proof and explorer link**

## Cost
- Network: Solana Devnet (free)
- Transaction fee: ~0.000005 SOL (~$0.0001 USD)
- For mainnet: Same minimal cost

## Files

### Services
- `src/services/blockchainAnchor.js` - Core anchoring logic
- `src/services/supabaseService.js` - Database operations (updated)

### Components
- `src/components/AnchorButton.jsx` - UI for anchoring
- `src/components/RightPanel.jsx` - Chat interface (updated)

### Database
- `create-anchors-table.sql` - SQL schema for anchors table

## Future Enhancements
- Show anchor history in user profile
- Verify previous anchors
- Export anchor certificates
- Anchor automatically after X messages
- NFT metadata updates with latest hash
- Mainnet deployment
