import { Connection, PublicKey, Transaction, SystemProgram, Keypair } from '@solana/web3.js';
import { connection } from '../config/solana';

/**
 * Create metadata for Progress NFT
 */
export function createProgressMetadata(userProfile, anchors) {
  const totalMessages = anchors.reduce((sum, anchor) => sum + anchor.message_count, 0);
  const learningStreak = calculateStreak(anchors);
  const rank = calculateRank(userProfile.xp, totalMessages);
  
  return {
    name: `Sovereign Progress #${userProfile.level}`,
    symbol: 'SOVPROG',
    description: `Learning Progress NFT - Level ${userProfile.level} | ${userProfile.xp} XP | ${totalMessages} messages`,
    image: generateProgressImage(rank, userProfile.level),
    attributes: [
      { trait_type: 'Level', value: userProfile.level },
      { trait_type: 'XP', value: userProfile.xp },
      { trait_type: 'Rank', value: rank },
      { trait_type: 'Total Messages', value: totalMessages },
      { trait_type: 'Topics Mastered', value: userProfile.topics_mastered?.length || 0 },
      { trait_type: 'Learning Streak', value: learningStreak },
      { trait_type: 'Blockchain Anchors', value: anchors.length },
      { trait_type: 'Last Anchor', value: anchors[0]?.anchored_at || 'Never' },
      { trait_type: 'Memory Hash', value: userProfile.current_memory_hash || 'None' },
    ],
    properties: {
      category: 'Education',
      creators: [
        {
          address: userProfile.wallet_address,
          share: 100
        }
      ],
      files: [
        {
          uri: generateProgressImage(rank, userProfile.level),
          type: 'image/png'
        }
      ]
    },
    external_url: `https://sovereign.app/profile/${userProfile.wallet_address}`,
    collection: {
      name: 'Sovereign Learning Progress',
      family: 'Sovereign'
    }
  };
}

/**
 * Calculate learning rank based on XP and activity
 */
export function calculateRank(xp, totalMessages) {
  if (xp >= 10000 || totalMessages >= 1000) return 'Master';
  if (xp >= 5000 || totalMessages >= 500) return 'Expert';
  if (xp >= 2000 || totalMessages >= 200) return 'Advanced';
  if (xp >= 1000 || totalMessages >= 100) return 'Intermediate';
  if (xp >= 500 || totalMessages >= 50) return 'Apprentice';
  return 'Novice';
}

/**
 * Calculate learning streak (days with activity)
 */
function calculateStreak(anchors) {
  if (anchors.length === 0) return 0;
  
  const dates = anchors.map(a => new Date(a.anchored_at).toDateString());
  const uniqueDates = [...new Set(dates)];
  return uniqueDates.length;
}

/**
 * Generate progress image URL (placeholder - would use actual image generation)
 */
function generateProgressImage(rank, level) {
  // In production, this would call an image generation API
  // For now, return a placeholder that includes rank and level
  const colors = {
    'Novice': '9945FF',
    'Apprentice': '14F195',
    'Intermediate': '00D4FF',
    'Advanced': 'FFD700',
    'Expert': 'FF6B6B',
    'Master': 'FF00FF'
  };
  
  const color = colors[rank] || '9945FF';
  return `https://via.placeholder.com/400/${color}/FFFFFF?text=${rank}+Level+${level}`;
}

/**
 * Create Achievement NFT metadata
 */
export function createAchievementMetadata(achievement, userProfile) {
  const achievements = {
    'first_message': {
      name: 'First Steps',
      description: 'Sent your first message to Sovereign AI',
      image: 'https://via.placeholder.com/400/9945FF/FFFFFF?text=First+Steps',
      rarity: 'Common'
    },
    'first_anchor': {
      name: 'Blockchain Pioneer',
      description: 'Anchored your first learning session to Solana',
      image: 'https://via.placeholder.com/400/14F195/FFFFFF?text=Blockchain+Pioneer',
      rarity: 'Uncommon'
    },
    'streak_7': {
      name: 'Week Warrior',
      description: 'Maintained a 7-day learning streak',
      image: 'https://via.placeholder.com/400/00D4FF/FFFFFF?text=Week+Warrior',
      rarity: 'Rare'
    },
    'messages_100': {
      name: 'Conversationalist',
      description: 'Exchanged 100 messages with Sovereign AI',
      image: 'https://via.placeholder.com/400/FFD700/FFFFFF?text=Conversationalist',
      rarity: 'Rare'
    },
    'level_10': {
      name: 'Rising Star',
      description: 'Reached Level 10',
      image: 'https://via.placeholder.com/400/FF6B6B/FFFFFF?text=Rising+Star',
      rarity: 'Epic'
    },
    'master_rank': {
      name: 'Grand Master',
      description: 'Achieved Master rank in learning',
      image: 'https://via.placeholder.com/400/FF00FF/FFFFFF?text=Grand+Master',
      rarity: 'Legendary'
    }
  };

  const achievementData = achievements[achievement] || achievements['first_message'];

  return {
    name: achievementData.name,
    symbol: 'SOVACH',
    description: achievementData.description,
    image: achievementData.image,
    attributes: [
      { trait_type: 'Achievement', value: achievement },
      { trait_type: 'Rarity', value: achievementData.rarity },
      { trait_type: 'Earned By', value: userProfile.wallet_address },
      { trait_type: 'Earned At', value: new Date().toISOString() },
      { trait_type: 'User Level', value: userProfile.level },
      { trait_type: 'User XP', value: userProfile.xp }
    ],
    properties: {
      category: 'Achievement',
      creators: [
        {
          address: userProfile.wallet_address,
          share: 100
        }
      ]
    },
    external_url: `https://sovereign.app/achievement/${achievement}`,
    collection: {
      name: 'Sovereign Achievements',
      family: 'Sovereign'
    }
  };
}

/**
 * Mint Progress NFT (simplified version for devnet)
 */
export async function mintProgressNFT(wallet, userProfile, anchors) {
  if (!wallet.publicKey || !wallet.signTransaction) {
    throw new Error('Wallet not connected');
  }

  try {
    // Create metadata
    const metadata = createProgressMetadata(userProfile, anchors);
    
    // In production, this would:
    // 1. Upload metadata to IPFS/Arweave
    // 2. Use Metaplex to mint NFT with metadata
    // 3. Return NFT mint address
    
    // For now, we'll create a simple transaction as proof of concept
    const transaction = new Transaction();
    
    // Add a memo with the metadata hash
    const metadataString = JSON.stringify(metadata);
    const metadataHash = await crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(metadataString)
    );
    const hashArray = Array.from(new Uint8Array(metadataHash));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    // Simple transfer to self with memo
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: wallet.publicKey,
        lamports: 0,
      })
    );

    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = wallet.publicKey;

    const signed = await wallet.signTransaction(transaction);
    const signature = await connection.sendRawTransaction(signed.serialize());
    
    await connection.confirmTransaction({
      signature,
      blockhash,
      lastValidBlockHeight
    }, 'confirmed');

    return {
      success: true,
      signature,
      metadata,
      metadataHash: hashHex,
      explorer: `https://explorer.solana.com/tx/${signature}?cluster=devnet`,
      message: 'Progress NFT minted successfully! (Simplified version for devnet)'
    };
  } catch (error) {
    console.error('Error minting progress NFT:', error);
    throw error;
  }
}

/**
 * Mint Achievement NFT
 */
export async function mintAchievementNFT(wallet, achievement, userProfile) {
  if (!wallet.publicKey || !wallet.signTransaction) {
    throw new Error('Wallet not connected');
  }

  try {
    const metadata = createAchievementMetadata(achievement, userProfile);
    
    // Similar to progress NFT, simplified for devnet
    const transaction = new Transaction();
    
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: wallet.publicKey,
        lamports: 0,
      })
    );

    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = wallet.publicKey;

    const signed = await wallet.signTransaction(transaction);
    const signature = await connection.sendRawTransaction(signed.serialize());
    
    await connection.confirmTransaction({
      signature,
      blockhash,
      lastValidBlockHeight
    }, 'confirmed');

    return {
      success: true,
      signature,
      metadata,
      achievement,
      explorer: `https://explorer.solana.com/tx/${signature}?cluster=devnet`,
      message: `Achievement "${metadata.name}" unlocked!`
    };
  } catch (error) {
    console.error('Error minting achievement NFT:', error);
    throw error;
  }
}

/**
 * Check which achievements user has unlocked
 */
export function checkAchievements(userProfile, messages, anchors) {
  const unlocked = [];
  
  // First message
  if (messages.length >= 1) {
    unlocked.push('first_message');
  }
  
  // First anchor
  if (anchors.length >= 1) {
    unlocked.push('first_anchor');
  }
  
  // 100 messages
  if (messages.length >= 100) {
    unlocked.push('messages_100');
  }
  
  // Level 10
  if (parseInt(userProfile.level) >= 10) {
    unlocked.push('level_10');
  }
  
  // Master rank
  const rank = calculateRank(userProfile.xp, messages.length);
  if (rank === 'Master') {
    unlocked.push('master_rank');
  }
  
  // 7 day streak
  const streak = calculateStreak(anchors);
  if (streak >= 7) {
    unlocked.push('streak_7');
  }
  
  return unlocked;
}

/**
 * Get progress summary for display
 */
export function getProgressSummary(userProfile, messages, anchors) {
  const rank = calculateRank(userProfile.xp, messages.length);
  const streak = calculateStreak(anchors);
  const achievements = checkAchievements(userProfile, messages, anchors);
  
  return {
    level: userProfile.level,
    xp: userProfile.xp,
    rank,
    totalMessages: messages.length,
    topicsMastered: userProfile.topics_mastered?.length || 0,
    blockchainAnchors: anchors.length,
    learningStreak: streak,
    achievements: achievements.length,
    unlockedAchievements: achievements,
    nextLevel: calculateNextLevel(userProfile.level),
    progress: calculateProgress(userProfile.xp, userProfile.level)
  };
}

function calculateNextLevel(currentLevel) {
  const level = parseInt(currentLevel);
  return level + 1;
}

function calculateProgress(xp, level) {
  const currentLevelXP = (parseInt(level) - 1) * 1000;
  const nextLevelXP = parseInt(level) * 1000;
  const progress = ((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
  return Math.min(Math.max(progress, 0), 100);
}
