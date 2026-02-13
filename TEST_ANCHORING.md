# Test Blockchain Anchoring - Quick Guide

## ✅ Prerequisites
- [x] Anchors table created in Supabase
- [ ] Dev server running (`npm run dev`)
- [ ] Wallet connected (Phantom/Solflare)
- [ ] Some devnet SOL in wallet (get from https://faucet.solana.com)

## 🧪 Test Steps

### 1. Start the App
```bash
npm run dev
```
Open http://localhost:5173

### 2. Connect Wallet
- Go to `/app` page
- Click "Connect Wallet" if not connected
- Approve wallet connection

### 3. Send Messages
- Type a message in the chat: "teach me react"
- Wait for AI response
- Send 2-3 more messages to build chat history

### 4. Anchor to Blockchain
- Look for "Anchor to Blockchain" button in the header (appears after first message)
- Click the button
- Wallet will prompt for transaction approval
- Approve the transaction (~0.000005 SOL fee)

### 5. Verify Success
You should see a success modal with:
- ✅ Green checkmark icon
- ✅ Your memory hash (SHA-256)
- ✅ Transaction signature
- ✅ Message count
- ✅ "View on Explorer" button

### 6. Check Blockchain
- Click "View on Explorer"
- Opens Solana Explorer (devnet)
- Verify transaction is confirmed
- Your chat hash is now permanently on-chain!

### 7. Verify Database
Check Supabase `anchors` table:
- Should have a new row with your wallet address
- Contains the memory hash
- Contains the transaction signature
- Shows message count and timestamp

## 🎯 What to Look For

### Success Indicators:
- ✅ Button shows "Anchoring..." while processing
- ✅ Wallet popup appears for signature
- ✅ Success modal displays after confirmation
- ✅ Explorer link works and shows transaction
- ✅ New row in Supabase `anchors` table

### Common Issues:

**"Wallet not connected"**
- Solution: Connect wallet first, then try again

**"Insufficient funds"**
- Solution: Get devnet SOL from https://faucet.solana.com

**"Transaction failed"**
- Solution: Check wallet has SOL, try again
- Check browser console for errors

**Button doesn't appear**
- Solution: Send at least one message first
- Refresh page if needed

## 🔍 Debug Mode

Open browser console (F12) to see:
- Hash creation logs
- Transaction details
- Any errors

## 📊 Expected Results

After successful anchor:
```
Hash: 64-character hex string (SHA-256)
Signature: Base58 transaction signature
Explorer: https://explorer.solana.com/tx/[signature]?cluster=devnet
Messages: Number of messages anchored
Network: Solana Devnet
```

## 🚀 Next Test

Try anchoring multiple times:
1. Send more messages
2. Click "Anchor to Blockchain" again
3. Each anchor creates a new record
4. Each has a unique hash (different messages = different hash)

## 💡 Pro Tips

- Anchor after important learning milestones
- Each anchor costs ~0.000005 SOL (basically free on devnet)
- Hashes are permanent and immutable
- You can verify any anchor anytime using the signature
- Your actual messages are NOT on-chain (only the hash)

## ✨ Feature Demo

Show someone:
1. Chat with AI tutor
2. Click anchor button
3. Show success modal
4. Open explorer link
5. Explain: "My learning progress is now permanently on Solana blockchain!"
