import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { clusterApiUrl } from '@solana/web3.js';

/**
 * Solana network configuration for the application.
 * Set to Devnet for development and testing.
 * Change to WalletAdapterNetwork.Mainnet for production.
 */
export const SOLANA_NETWORK = WalletAdapterNetwork.Devnet;

/**
 * Solana RPC endpoint URL based on the configured network.
 * Uses the official Solana cluster API URL for the selected network.
 */
export const SOLANA_RPC_ENDPOINT = clusterApiUrl(SOLANA_NETWORK);
