import { motion } from 'framer-motion';
import { LogOut, Zap, User } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useNavigate, useLocation } from 'react-router-dom';

export function Header() {
  const { publicKey, disconnect } = useWallet();
  const { setVisible } = useWalletModal();
  const navigate = useNavigate();
  const location = useLocation();

  const formatAddress = (address) => {
    if (!address) return '';
    const str = address.toString();
    return `${str.slice(0, 4)}...${str.slice(-4)}`;
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
    >
      <div className="glass-strong rounded-2xl px-6 py-3 flex items-center justify-between">
        {/* Left: Brand */}
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#9945FF] to-[#14F195] flex items-center justify-center glow-purple-sm"
          >
            <Zap className="w-4 h-4 text-white" />
          </motion.div>
          <div>
            <h1 className="text-lg font-bold tracking-tight flex items-center gap-2">
              <span className="gradient-text">SOVEREIGN</span>
              <span className="text-zinc-600 text-sm">//</span>
              <span className="text-[#14F195] mono text-xs font-normal">v2.0</span>
            </h1>
          </div>
        </div>

        {/* Right: Wallet */}
        <div className="flex items-center gap-3">
          {publicKey ? (
            <>
              <div className="glass rounded-xl px-3 py-2 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full status-online pulse" />
                <span className="mono text-xs text-white font-medium">{formatAddress(publicKey)}</span>
              </div>
              {location.pathname !== '/profile' && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/profile')}
                  className="glass rounded-xl px-3 py-2 flex items-center gap-2 hover:border-[#9945FF]/50 transition-all"
                  title="View Profile"
                >
                  <User className="w-4 h-4 text-[#9945FF]" />
                </motion.button>
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={disconnect}
                className="glass rounded-xl px-3 py-2 flex items-center gap-2 hover:border-red-500/50 hover:bg-red-500/10 transition-all"
              >
                <LogOut className="w-4 h-4 text-red-400" />
              </motion.button>
            </>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setVisible(true)}
              className="btn-primary rounded-xl px-4 py-2 flex items-center gap-2"
            >
              <span className="mono text-xs font-bold text-white">CONNECT WALLET</span>
            </motion.button>
          )}
        </div>
      </div>
    </motion.header>
  );
}
