import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { Wallet } from 'lucide-react';
import type { PublicKey } from '@solana/web3.js';

interface WalletButtonProps {
  className?: string;
  variant?: 'default' | 'mobile';
  children?: React.ReactNode;
}

/**
 * Helper function to truncate a Solana public key for display.
 * Formats the public key as {first4}...{last4}.
 * 
 * @param publicKey - The Solana public key to truncate
 * @returns Truncated public key string in format "XXXX...XXXX"
 */
function truncatePublicKey(publicKey: PublicKey): string {
  const address = publicKey.toBase58();
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

/**
 * WalletButton component that provides wallet connection interface.
 * 
 * Features:
 * - Displays "Connect Wallet" when disconnected
 * - Shows truncated public key when connected
 * - Displays loading state when connecting
 * - Triggers wallet modal on click when disconnected
 * - Shows disconnect option when connected
 * - Supports desktop and mobile variants
 * 
 * References:
 * - Requirement 2: Display Connection Status
 * - Requirement 3: Wallet Disconnection
 * - Design: WalletButton Component section
 */
export default function WalletButton({ className = '', variant = 'default', children }: WalletButtonProps) {
  const { publicKey, connected, connecting, disconnect } = useWallet();
  const { setVisible } = useWalletModal();

  const handleClick = () => {
    if (connected) {
      // When connected, disconnect the wallet
      disconnect();
    } else {
      // When disconnected, show the wallet selection modal
      setVisible(true);
    }
  };

  // Determine button text based on connection state
  const getButtonText = () => {
    if (connecting) {
      return 'Connecting...';
    }
    if (connected && publicKey) {
      return truncatePublicKey(publicKey);
    }
    return 'Connect Wallet';
  };

  // Base styles for both variants
  const baseStyles = 'flex items-center justify-center gap-2 font-bold text-sm rounded-lg transition-all';
  
  // Variant-specific styles
  const variantStyles = {
    default: 'px-5 py-2.5 bg-[#14F195] hover:bg-[#14F195]/90 text-black',
    mobile: 'w-full py-3 bg-[#14F195] hover:bg-[#14F195]/90 text-black',
  };

  return (
    <button
      onClick={handleClick}
      disabled={connecting}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      <Wallet className="w-4 h-4" />
      {getButtonText()}
      {children}
    </button>
  );
}
