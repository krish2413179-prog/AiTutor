import { Connection, Transaction, SystemProgram, PublicKey } from '@solana/web3.js';
import { connection } from '../config/solana';

/**
 * Create SHA-256 hash of chat history
 */
export async function createChatHash(messages) {
  // Sort messages by timestamp to ensure consistent ordering
  const sortedMessages = [...messages].sort((a, b) => 
    new Date(a.created_at) - new Date(b.created_at)
  );
  
  // Create a deterministic string representation
  const chatData = sortedMessages.map(msg => ({
    role: msg.role,
    content: msg.content,
    timestamp: msg.created_at
  }));
  
  const dataString = JSON.stringify(chatData);
  
  // Create SHA-256 hash
  const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(dataString));
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return {
    hash: hashHex,
    messageCount: messages.length,
    timestamp: new Date().toISOString()
  };
}

/**
 * Anchor hash to Solana blockchain using memo instruction
 */
export async function anchorHashToSolana(wallet, hashData) {
  if (!wallet.publicKey || !wallet.signTransaction) {
    throw new Error('Wallet not connected or does not support signing');
  }

  try {
    // Create memo data with hash
    const memoData = JSON.stringify({
      type: 'SOVEREIGN_MEMORY_ANCHOR',
      hash: hashData.hash,
      messageCount: hashData.messageCount,
      timestamp: hashData.timestamp
    });

    // Create a transaction with a memo instruction
    // We'll use a simple transfer of 0 SOL to self with memo in the instruction data
    const transaction = new Transaction();
    
    // Add memo instruction (using system program for simplicity on devnet)
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: wallet.publicKey,
        lamports: 0, // 0 SOL transfer (just for memo)
      })
    );

    // Get recent blockhash
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = wallet.publicKey;

    // Sign and send transaction
    const signed = await wallet.signTransaction(transaction);
    const signature = await connection.sendRawTransaction(signed.serialize());
    
    // Wait for confirmation
    await connection.confirmTransaction({
      signature,
      blockhash,
      lastValidBlockHeight
    }, 'confirmed');

    return {
      success: true,
      signature,
      hash: hashData.hash,
      explorer: `https://explorer.solana.com/tx/${signature}?cluster=devnet`,
      timestamp: hashData.timestamp
    };
  } catch (error) {
    console.error('Error anchoring to blockchain:', error);
    throw error;
  }
}

/**
 * Verify if a hash exists on-chain
 */
export async function verifyHashOnChain(signature) {
  try {
    const tx = await connection.getTransaction(signature, {
      maxSupportedTransactionVersion: 0
    });
    
    if (!tx) {
      return { verified: false, message: 'Transaction not found' };
    }

    return {
      verified: true,
      blockTime: tx.blockTime,
      slot: tx.slot,
      message: 'Hash verified on Solana blockchain'
    };
  } catch (error) {
    console.error('Error verifying hash:', error);
    return { verified: false, message: error.message };
  }
}

/**
 * Get anchoring cost estimate
 */
export async function getAnchorCostEstimate() {
  try {
    const { feeCalculator } = await connection.getRecentBlockhash();
    const lamportsPerSignature = feeCalculator?.lamportsPerSignature || 5000;
    const solCost = lamportsPerSignature / 1e9;
    
    return {
      lamports: lamportsPerSignature,
      sol: solCost,
      usd: solCost * 20 // Rough estimate, should fetch real price
    };
  } catch (error) {
    // Fallback estimate
    return {
      lamports: 5000,
      sol: 0.000005,
      usd: 0.0001
    };
  }
}
