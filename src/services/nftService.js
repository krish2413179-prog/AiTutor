import { connection } from '../config/solana';
import { PublicKey } from '@solana/web3.js';

export async function checkNFTOwnership(walletAddress) {
  try {
    const publicKey = new PublicKey(walletAddress);
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
      programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
    });
    return tokenAccounts.value.length > 0;
  } catch (error) {
    console.error('Error checking NFT:', error);
    return false;
  }
}

export function createKnowledgeHash(profileData) {
  const dataString = JSON.stringify(profileData);
  return crypto.subtle.digest('SHA-256', new TextEncoder().encode(dataString))
    .then(hashBuffer => {
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    });
}

export async function updateNFTMetadata(walletAddress, knowledgeHash) {
  console.log('Updating NFT metadata:', { walletAddress, knowledgeHash });
  return {
    success: true,
    hash: knowledgeHash,
    timestamp: new Date().toISOString()
  };
}
