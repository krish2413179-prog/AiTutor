# Transferable Progress & Achievement NFT System

## Overview
Sovereign now mints your learning progress and achievements as NFTs on Solana, making your educational credentials transferable between apps and platforms.

## Features

### 1. Progress NFT
A dynamic NFT that represents your overall learning journey:

**Metadata Includes:**
- Level (1-100+)
- Total XP earned
- Learning Rank (Novice → Master)
- Total messages exchanged
- Topics mastered
- Blockchain anchors created
- Learning streak (days active)
- Latest memory hash

**Ranks:**
- **Novice**: 0-499 XP or 0-49 messages
- **Apprentice**: 500-999 XP or 50-99 messages
- **Intermediate**: 1000-1999 XP or 100-199 messages
- **Advanced**: 2000-4999 XP or 200-499 messages
- **Expert**: 5000-9999 XP or 500-999 messages
- **Master**: 10000+ XP or 1000+ messages

### 2. Achievement NFTs
Individual NFTs for specific milestones:

**Available Achievements:**
- **First Steps** (Common): Send your first message
- **Blockchain Pioneer** (Uncommon): Anchor your first session
- **Conversationalist** (Rare): Exchange 100 messages
- **Week Warrior** (Rare): Maintain 7-day learning streak
- **Rising Star** (Epic): Reach Level 10
- **Grand Master** (Legendary): Achieve Master rank

### 3. XP System
Earn experience points through learning activities:

**XP Sources:**
- Send message: +10 XP
- Complete anchor: +50 XP (future)
- Master topic: +100 XP (future)
- Daily streak: +25 XP (future)

**Leveling:**
- Level = (Total XP / 1000) + 1
- Level 1: 0-999 XP
- Level 2: 1000-1999 XP
- Level 3: 2000-2999 XP
- And so on...

## How It Works

### Minting Progress NFT

1. **Click Trophy Icon** in chat header
2. **View Your Stats**:
   - Current level and XP
   - Learning rank
   - Total messages
   - Topics mastered
   - Achievements unlocked
   - Progress to next level

3. **Click "Mint Progress NFT"**
4. **Approve Transaction** in wallet (~0.000005 SOL)
5. **Receive NFT** with all your progress data

### Minting Achievement NFTs

1. **Unlock Achievement** by completing milestone
2. **Click Achievement Badge** in progress panel
3. **Approve Transaction** in wallet
4. **Receive Achievement NFT**

## NFT Metadata Structure

### Progress NFT
```json
{
  "name": "Sovereign Progress #5",
  "symbol": "SOVPROG",
  "description": "Learning Progress NFT - Level 5 | 4500 XP | 450 messages",
  "attributes": [
    { "trait_type": "Level", "value": "5" },
    { "trait_type": "XP", "value": 4500 },
    { "trait_type": "Rank", "value": "Advanced" },
    { "trait_type": "Total Messages", "value": 450 },
    { "trait_type": "Topics Mastered", "value": 12 },
    { "trait_type": "Learning Streak", "value": 15 },
    { "trait_type": "Blockchain Anchors", "value": 8 }
  ],
  "collection": {
    "name": "Sovereign Learning Progress",
    "family": "Sovereign"
  }
}
```

### Achievement NFT
```json
{
  "name": "Blockchain Pioneer",
  "symbol": "SOVACH",
  "description": "Anchored your first learning session to Solana",
  "attributes": [
    { "trait_type": "Achievement", "value": "first_anchor" },
    { "trait_type": "Rarity", "value": "Uncommon" },
    { "trait_type": "Earned At", "value": "2024-02-13T..." }
  ],
  "collection": {
    "name": "Sovereign Achievements",
    "family": "Sovereign"
  }
}
```

## Transferability

### Why It Matters
Your learning progress is stored as an NFT, which means:

1. **Portable**: Transfer to other educational platforms
2. **Verifiable**: Anyone can verify your credentials on-chain
3. **Owned**: You own your learning data, not the platform
4. **Tradeable**: Can be sold/transferred (if desired)
5. **Composable**: Other apps can read your progress

### Use Cases

**For Learners:**
- Prove your skills to employers
- Transfer progress between learning platforms
- Build a verifiable educational portfolio
- Showcase achievements in your wallet

**For Platforms:**
- Import user progress from other apps
- Verify user skill levels
- Create cross-platform learning paths
- Reward users with compatible NFTs

**For Employers:**
- Verify candidate skills on-chain
- Check learning history and dedication
- See verifiable proof of knowledge
- No fake credentials possible

## Technical Implementation

### Services
- `src/services/progressNFT.js` - NFT minting and metadata logic
- `src/services/supabaseService.js` - XP tracking and updates

### Components
- `src/components/ProgressNFT.jsx` - Progress display and minting UI
- `src/components/RightPanel.jsx` - Integration with chat interface

### Database
- `profiles` table tracks XP and level
- Automatic XP awards on message send
- Level calculation: `Math.floor(xp / 1000) + 1`

## Future Enhancements

### Phase 1 (Current)
- ✅ Progress NFT minting
- ✅ Achievement system
- ✅ XP tracking
- ✅ Rank calculation
- ✅ Basic metadata

### Phase 2 (Next)
- [ ] Metaplex integration for real NFTs
- [ ] IPFS/Arweave metadata storage
- [ ] Dynamic NFT images
- [ ] Achievement badges UI
- [ ] Progress history view

### Phase 3 (Future)
- [ ] Cross-platform progress import
- [ ] Skill verification system
- [ ] NFT marketplace integration
- [ ] Credential verification API
- [ ] Employer verification portal
- [ ] Learning path recommendations based on NFTs

## Cost

- **Progress NFT**: ~0.000005 SOL (~$0.0001 USD)
- **Achievement NFT**: ~0.000005 SOL (~$0.0001 USD)
- **Devnet**: FREE (test SOL from faucet)

## Verification

### On-Chain Verification
1. Get transaction signature from NFT mint
2. View on Solana Explorer
3. Verify metadata hash matches
4. Confirm ownership in wallet

### Cross-Platform Verification
Other apps can verify your progress by:
1. Reading NFT metadata from your wallet
2. Checking attributes (level, XP, rank)
3. Verifying on-chain transaction history
4. Importing your progress data

## Privacy

- **NFT is public**: Anyone can see your progress
- **Opt-in**: You choose when to mint
- **Selective sharing**: Mint specific achievements only
- **No PII**: No personal information in metadata
- **Wallet-based**: Tied to wallet address only

## Example Workflow

### New User Journey
1. Connect wallet → Create profile (Level 1, 0 XP)
2. Send 10 messages → Earn 100 XP
3. Unlock "First Steps" achievement
4. Mint achievement NFT
5. Continue learning → Reach Level 2 (1000 XP)
6. Mint progress NFT showing Level 2 status
7. Transfer to another learning platform
8. New platform reads NFT → Imports Level 2 progress
9. Continue learning with verified credentials

### Employer Verification
1. Candidate claims "Master" rank in Solana development
2. Employer requests wallet address
3. Employer checks wallet for Sovereign NFTs
4. Verifies on-chain: Level 15, 14500 XP, Master rank
5. Confirms 1200+ messages, 50+ topics mastered
6. Checks blockchain anchors for proof of learning
7. Hires with confidence in verified skills

## Integration Guide

### For Other Platforms

To integrate Sovereign progress NFTs:

```javascript
// 1. Read user's wallet
const wallet = await getWalletAddress();

// 2. Fetch NFTs from wallet
const nfts = await connection.getParsedTokenAccountsByOwner(wallet);

// 3. Filter for Sovereign NFTs
const sovereignNFTs = nfts.filter(nft => 
  nft.metadata?.collection?.family === 'Sovereign'
);

// 4. Parse metadata
const progressNFT = sovereignNFTs.find(nft => 
  nft.metadata?.symbol === 'SOVPROG'
);

// 5. Import user progress
const level = progressNFT.attributes.find(a => a.trait_type === 'Level').value;
const xp = progressNFT.attributes.find(a => a.trait_type === 'XP').value;
const rank = progressNFT.attributes.find(a => a.trait_type === 'Rank').value;

// 6. Set user's imported progress
await setUserProgress({ level, xp, rank });
```

## Benefits

### For Users
- Own your learning data
- Portable credentials
- Verifiable achievements
- Build educational portfolio
- Prove skills to employers

### For Platforms
- Import verified users
- Cross-platform compatibility
- Reduced onboarding friction
- Trust through verification
- Composable education ecosystem

### For Ecosystem
- Standardized credentials
- Interoperable learning data
- Decentralized education
- Verifiable skill marketplace
- Web3-native education

---

**Your learning journey, permanently on-chain, transferable everywhere.**
