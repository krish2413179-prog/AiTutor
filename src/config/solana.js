import { Connection, clusterApiUrl } from '@solana/web3.js';

export const NETWORK = 'devnet';
export const connection = new Connection(clusterApiUrl(NETWORK), 'confirmed');
export const SOVEREIGN_NFT_COLLECTION = import.meta.env.VITE_NFT_COLLECTION_ADDRESS || '';
export const MAKE_WEBHOOK_URL = import.meta.env.VITE_MAKE_WEBHOOK_URL || '';
