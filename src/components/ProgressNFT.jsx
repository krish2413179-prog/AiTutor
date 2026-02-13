import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Award, Zap, TrendingUp, Target, Star, ExternalLink, Sparkles } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { 
  mintProgressNFT, 
  mintAchievementNFT, 
  getProgressSummary,
  checkAchievements 
} from '../services/progressNFT';
import { getRecentMessages, getAnchors } from '../services/supabaseService';

export function ProgressNFT({ userProfile }) {
  const { publicKey, signTransaction } = useWallet();
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [result, setResult] = useState(null);
  const [progress, setProgress] = useState(null);
  const [messages, setMessages] = useState([]);
  const [anchors, setAnchors] = useState([]);

  useEffect(() => {
    if (publicKey && userProfile) {
      loadProgress();
    }
  }, [publicKey, userProfile]);

  const loadProgress = async () => {
    try {
      const msgs = await getRecentMessages(publicKey.toString(), 1000);
      const anchs = await getAnchors(publicKey.toString(), 100);
      setMessages(msgs);
      setAnchors(anchs);
      
      const summary = getProgressSummary(userProfile, msgs, anchs);
      setProgress(summary);
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  const handleMintProgress = async () => {
    if (!publicKey || !signTransaction) return;
    
    setLoading(true);
    try {
      const result = await mintProgressNFT(
        { publicKey, signTransaction },
        userProfile,
        anchors
      );
      
      setResult(result);
      setShowModal(true);
    } catch (error) {
      console.error('Error minting progress NFT:', error);
      alert('Failed to mint progress NFT: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMintAchievement = async (achievement) => {
    if (!publicKey || !signTransaction) return;
    
    setLoading(true);
    try {
      const result = await mintAchievementNFT(
        { publicKey, signTransaction },
        achievement,
        userProfile
      );
      
      setResult(result);
      setShowModal(true);
    } catch (error) {
      console.error('Error minting achievement NFT:', error);
      alert('Failed to mint achievement NFT: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!progress) return null;

  return (
    <>
      <div className="glass-strong rounded-2xl p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#9945FF] to-[#14F195] flex items-center justify-center glow-purple-sm">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Learning Progress</h3>
              <p className="text-xs text-zinc-500 mono">Mint as transferable NFT</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold gradient-text">{progress.rank}</div>
            <div className="text-xs text-zinc-500 mono">Level {progress.level}</div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass rounded-xl p-4 text-center">
            <Zap className="w-5 h-5 text-[#14F195] mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{progress.xp}</div>
            <div className="text-xs text-zinc-500 mono">XP</div>
          </div>
          
          <div className="glass rounded-xl p-4 text-center">
            <TrendingUp className="w-5 h-5 text-[#9945FF] mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{progress.totalMessages}</div>
            <div className="text-xs text-zinc-500 mono">Messages</div>
          </div>
          
          <div className="glass rounded-xl p-4 text-center">
            <Target className="w-5 h-5 text-[#00D4FF] mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{progress.topicsMastered}</div>
            <div className="text-xs text-zinc-500 mono">Topics</div>
          </div>
          
          <div className="glass rounded-xl p-4 text-center">
            <Star className="w-5 h-5 text-[#FFD700] mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{progress.achievements}</div>
            <div className="text-xs text-zinc-500 mono">Achievements</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-400 mono">Level {progress.level} Progress</span>
            <span className="text-white font-bold">{Math.round(progress.progress)}%</span>
          </div>
          <div className="h-2 bg-zinc-900 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress.progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-[#9945FF] to-[#14F195]"
            />
          </div>
          <div className="text-xs text-zinc-500 text-center mono">
            Next level at {progress.nextLevel * 1000} XP
          </div>
        </div>

        {/* Achievements */}
        {progress.unlockedAchievements.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-[#FFD700]" />
              <span className="text-sm font-bold text-white">Unlocked Achievements</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {progress.unlockedAchievements.slice(0, 4).map((achievement, i) => (
                <motion.button
                  key={achievement}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleMintAchievement(achievement)}
                  disabled={loading}
                  className="glass rounded-lg p-3 text-left hover:border-[#FFD700]/50 transition-all disabled:opacity-50"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-3 h-3 text-[#FFD700]" />
                    <span className="text-xs font-bold text-white capitalize">
                      {achievement.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div className="text-[10px] text-zinc-500 mono">Click to mint NFT</div>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Mint Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleMintProgress}
          disabled={loading}
          className="w-full btn-primary rounded-xl py-4 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span className="font-bold">Minting NFT...</span>
            </>
          ) : (
            <>
              <Trophy className="w-5 h-5" />
              <span className="font-bold">Mint Progress NFT</span>
            </>
          )}
        </motion.button>

        <div className="text-center text-xs text-zinc-500 mono">
          NFT contains: Level, XP, Rank, Messages, Topics, Anchors
        </div>
      </div>

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
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#9945FF] to-[#14F195] flex items-center justify-center glow-purple">
                  <Trophy className="w-10 h-10 text-white" />
                </div>
              </div>

              {/* Title */}
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold text-white">NFT Minted!</h3>
                <p className="text-sm text-zinc-400">{result.message}</p>
              </div>

              {/* NFT Preview */}
              {result.metadata && (
                <div className="glass rounded-xl p-4 space-y-3">
                  <div className="text-center">
                    <div className="text-lg font-bold text-white mb-1">{result.metadata.name}</div>
                    <div className="text-xs text-zinc-500">{result.metadata.description}</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {result.metadata.attributes.slice(0, 6).map((attr, i) => (
                      <div key={i} className="bg-black/30 rounded-lg p-2">
                        <div className="text-zinc-500 mono">{attr.trait_type}</div>
                        <div className="text-white font-bold">{attr.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Transaction */}
              <div className="glass rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs text-zinc-500 mono">
                  <Award className="w-4 h-4" />
                  <span>TRANSACTION</span>
                </div>
                <p className="text-xs text-[#14F195] mono break-all">{result.signature}</p>
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
