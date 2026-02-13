import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Anchor, Check, ExternalLink, Loader, Shield, Hash } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { createChatHash, anchorHashToSolana, getAnchorCostEstimate } from '../services/blockchainAnchor';
import { saveAnchor, updateMemoryHash } from '../services/supabaseService';

export function AnchorButton({ messages }) {
  const { publicKey, signTransaction } = useWallet();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [cost, setCost] = useState(null);

  const handleAnchor = async () => {
    if (!publicKey || !signTransaction || messages.length === 0) return;
    
    setLoading(true);
    try {
      // Step 1: Create hash of chat history
      const hashData = await createChatHash(messages);
      
      // Step 2: Anchor to Solana blockchain
      const anchorResult = await anchorHashToSolana(
        { publicKey, signTransaction },
        hashData
      );
      
      // Step 3: Save to database
      await saveAnchor(
        publicKey.toString(),
        hashData.hash,
        anchorResult.signature,
        hashData.messageCount
      );
      
      // Step 4: Update profile with latest hash
      await updateMemoryHash(publicKey.toString(), hashData.hash);
      
      setResult(anchorResult);
      setShowModal(true);
    } catch (error) {
      console.error('Anchor error:', error);
      alert('Failed to anchor memory: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadCost = async () => {
    const estimate = await getAnchorCostEstimate();
    setCost(estimate);
  };

  useState(() => {
    loadCost();
  }, []);

  if (!publicKey || messages.length === 0) return null;

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleAnchor}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#9945FF] to-[#14F195] text-white font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-purple-500/50 transition-all"
      >
        {loading ? (
          <>
            <Loader className="w-4 h-4 animate-spin" />
            <span>Anchoring...</span>
          </>
        ) : (
          <>
            <Anchor className="w-4 h-4" />
            <span>Anchor to Blockchain</span>
          </>
        )}
      </motion.button>

      {/* Success Modal */}
      <AnimatePresence>
        {showModal && result && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-strong rounded-2xl p-8 max-w-lg w-full space-y-6"
            >
              {/* Success Icon */}
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#14F195] to-[#0ec77a] flex items-center justify-center glow-green">
                  <Check className="w-8 h-8 text-white" />
                </div>
              </div>

              {/* Title */}
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold text-white">Memory Anchored!</h3>
                <p className="text-sm text-zinc-400">Your chat history is now immutably stored on Solana</p>
              </div>

              {/* Details */}
              <div className="space-y-3">
                <div className="glass rounded-xl p-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-zinc-500 mono">
                    <Hash className="w-4 h-4" />
                    <span>MEMORY HASH</span>
                  </div>
                  <p className="text-xs text-[#14F195] mono break-all">{result.hash}</p>
                </div>

                <div className="glass rounded-xl p-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-zinc-500 mono">
                    <Shield className="w-4 h-4" />
                    <span>TRANSACTION</span>
                  </div>
                  <p className="text-xs text-[#9945FF] mono break-all">{result.signature}</p>
                </div>

                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <span>Messages Anchored:</span>
                  <span className="text-white font-bold">{messages.length}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <span>Network:</span>
                  <span className="text-white font-bold">Solana Devnet</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href={result.explorer}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>View on Explorer</span>
                </motion.a>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#9945FF] to-[#14F195] text-white font-bold text-sm"
                >
                  Done
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
