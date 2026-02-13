import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Check, ExternalLink, Loader, Shield, Hash, Trophy, Anchor } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { createChatHash, anchorHashToSolana } from '../services/blockchainAnchor';
import { saveAnchor, updateMemoryHash } from '../services/supabaseService';
import { mintProgressNFT } from '../services/progressNFT';
import { extractTopics } from '../services/topicExtractor';
import { supabase } from '../config/supabase';

export function SaveProgressButton({ messages, userProfile, anchors }) {
  const { publicKey, signTransaction } = useWallet();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleSaveProgress = async () => {
    if (!publicKey || !signTransaction || messages.length === 0) return;
    
    setLoading(true);
    try {
      // Step 1: Extract and save topics
      const detectedTopics = extractTopics(messages);
      if (detectedTopics.length > 0 && userProfile) {
        const existingTopics = userProfile.topics_mastered || [];
        const allTopics = [...new Set([...existingTopics, ...detectedTopics])];
        
        await supabase
          .from('profiles')
          .update({ topics_mastered: allTopics })
          .eq('wallet_address', publicKey.toString());
      }
      
      // Step 2: Create hash of chat history
      const hashData = await createChatHash(messages);
      
      // Step 3: Anchor to Solana blockchain
      const anchorResult = await anchorHashToSolana(
        { publicKey, signTransaction },
        hashData
      );
      
      // Step 4: Save anchor to database
      await saveAnchor(
        publicKey.toString(),
        hashData.hash,
        anchorResult.signature,
        hashData.messageCount
      );
      
      // Step 5: Update profile with latest hash
      await updateMemoryHash(publicKey.toString(), hashData.hash);
      
      // Step 6: Mint Progress NFT
      let nftResult = null;
      if (userProfile && anchors) {
        try {
          nftResult = await mintProgressNFT(
            { publicKey, signTransaction },
            userProfile,
            [...anchors, { 
              memory_hash: hashData.hash,
              tx_signature: anchorResult.signature,
              message_count: hashData.messageCount,
              anchored_at: new Date().toISOString()
            }]
          );
        } catch (nftError) {
          console.error('NFT minting failed, but anchor succeeded:', nftError);
        }
      }
      
      setResult({
        anchor: anchorResult,
        nft: nftResult,
        hash: hashData.hash,
        messageCount: hashData.messageCount,
        topicsDetected: detectedTopics.length
      });
      setShowModal(true);
    } catch (error) {
      console.error('Save progress error:', error);
      alert('Failed to save progress: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!publicKey || messages.length === 0) return null;

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSaveProgress}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#9945FF] to-[#14F195] text-white font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-purple-500/50 transition-all"
      >
        {loading ? (
          <>
            <Loader className="w-4 h-4 animate-spin" />
            <span>Saving...</span>
          </>
        ) : (
          <>
            <Save className="w-4 h-4" />
            <span>Save Progress</span>
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
                <h3 className="text-2xl font-bold text-white">Progress Saved!</h3>
                <p className="text-sm text-zinc-400">
                  Your learning progress is now permanently stored on Solana
                </p>
              </div>

              {/* Details */}
              <div className="space-y-3">
                {/* Memory Hash */}
                <div className="glass rounded-xl p-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-zinc-500 mono">
                    <Hash className="w-4 h-4" />
                    <span>MEMORY HASH</span>
                  </div>
                  <p className="text-xs text-[#14F195] mono break-all">{result.hash}</p>
                </div>

                {/* Blockchain Anchor */}
                <div className="glass rounded-xl p-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-zinc-500 mono">
                    <Anchor className="w-4 h-4" />
                    <span>BLOCKCHAIN ANCHOR</span>
                  </div>
                  <p className="text-xs text-[#9945FF] mono break-all">{result.anchor.signature}</p>
                </div>

                {/* Progress NFT */}
                {result.nft && (
                  <div className="glass rounded-xl p-4 space-y-2">
                    <div className="flex items-center gap-2 text-xs text-zinc-500 mono">
                      <Trophy className="w-4 h-4" />
                      <span>PROGRESS NFT</span>
                    </div>
                    <p className="text-xs text-white font-bold">{result.nft.metadata?.name || 'Minted Successfully'}</p>
                  </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="glass rounded-lg p-3 text-center">
                    <div className="text-xs text-zinc-500 mono mb-1">Messages</div>
                    <div className="text-lg font-bold text-white">{result.messageCount}</div>
                  </div>
                  <div className="glass rounded-lg p-3 text-center">
                    <div className="text-xs text-zinc-500 mono mb-1">Topics</div>
                    <div className="text-lg font-bold text-[#00D4FF]">{result.topicsDetected || 0}</div>
                  </div>
                  <div className="glass rounded-lg p-3 text-center">
                    <div className="text-xs text-zinc-500 mono mb-1">Network</div>
                    <div className="text-lg font-bold text-[#14F195]">Solana</div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href={result.anchor.explorer}
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

              <div className="text-center text-xs text-zinc-500 mono">
                ✓ Chat anchored • ✓ Progress NFT • ✓ Topics detected • ✓ Transferable
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
