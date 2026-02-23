import React, { useMemo, useEffect, Component, ErrorInfo, ReactNode } from 'react';
import {
  ConnectionProvider,
  WalletProvider as SolanaWalletProvider,
} from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare';
import { SOLANA_RPC_ENDPOINT } from '../config/solana';

// Import wallet adapter styles
import '@solana/wallet-adapter-react-ui/styles.css';

interface WalletProviderProps {
  children: React.ReactNode;
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary component to catch and handle errors in the WalletProvider tree
 */
class WalletErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    console.error('[WalletErrorBoundary] Error caught:', error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[WalletErrorBoundary] Component stack:', errorInfo.componentStack);
    console.error('[WalletErrorBoundary] Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-[#0f0f0f] min-h-screen w-full text-white font-sans p-8">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-red-500 mb-4">Wallet Provider Error</h1>
            <p className="mb-4">
              An error occurred while initializing the wallet provider. The application will continue
              to render, but wallet functionality may be limited.
            </p>
            <details className="bg-gray-800 p-4 rounded">
              <summary className="cursor-pointer font-semibold mb-2">Error Details</summary>
              <pre className="text-sm overflow-auto">
                {this.state.error?.message || 'Unknown error'}
              </pre>
            </details>
            <div className="mt-4">
              {this.props.children}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * WalletProvider component that wraps the application with Solana wallet connection functionality.
 * 
 * This component:
 * - Initializes wallet adapters for Phantom and Solflare wallets
 * - Provides connection to the Solana blockchain via RPC endpoint
 * - Enables wallet modal UI for user interaction
 * - Supports auto-connect for session persistence
 * - Includes error handling and debugging capabilities
 * 
 * @param {WalletProviderProps} props - Component props
 * @param {React.ReactNode} props.children - Child components to wrap
 */
export default function WalletProvider({ children }: WalletProviderProps) {
  console.log('[WalletProvider] Rendering WalletProvider');
  console.log('[WalletProvider] RPC Endpoint:', SOLANA_RPC_ENDPOINT);
  console.log('[WalletProvider] Children:', children);

  // Initialize wallet adapters
  // useMemo ensures adapters are only created once and not on every render
  const wallets = useMemo(() => {
    console.log('[WalletProvider] Initializing wallet adapters');
    try {
      const adapters = [
        new PhantomWalletAdapter(),
        new SolflareWalletAdapter(),
      ];
      console.log('[WalletProvider] Wallet adapters created successfully:', adapters.length);
      return adapters;
    } catch (error) {
      console.error('[WalletProvider] Error creating wallet adapters:', error);
      // Return empty array to allow app to continue without wallet support
      return [];
    }
  }, []);

  useEffect(() => {
    console.log('[WalletProvider] Component mounted');
    return () => {
      console.log('[WalletProvider] Component unmounting');
    };
  }, []);

  // Handle wallet errors gracefully
  const onError = (error: Error) => {
    console.error('[WalletProvider] Wallet error:', error);
    console.error('[WalletProvider] Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
  };

  try {
    console.log('[WalletProvider] Rendering provider tree');
    return (
      <WalletErrorBoundary>
        <ConnectionProvider endpoint={SOLANA_RPC_ENDPOINT}>
          <SolanaWalletProvider wallets={wallets} autoConnect onError={onError}>
            <WalletModalProvider>
              {children}
            </WalletModalProvider>
          </SolanaWalletProvider>
        </ConnectionProvider>
      </WalletErrorBoundary>
    );
  } catch (error) {
    console.error('[WalletProvider] Error during render:', error);
    // Fallback: render children without wallet provider
    return (
      <div>
        <div className="bg-yellow-900 text-yellow-100 p-4 text-center">
          Warning: Wallet provider failed to initialize. Wallet features are disabled.
        </div>
        {children}
      </div>
    );
  }
}
