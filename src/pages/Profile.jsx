import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useWallet } from '@solana/wallet-adapter-react';
import { useNavigate } from 'react-router-dom';
import { 
  Trophy, TrendingUp, Zap, Target, Star, Hash, Anchor, 
  ExternalLink, Calendar, MessageSquare, Award, ArrowLeft,
  BookOpen, Clock, Shield
} from 'lucide-react';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { Header } from '../components/Header';
import { getUserProfile, getRecentMessages, getAnchors } from '../services/supabaseService';
import { getProgressSummary } from '../services/progressNFT';

export default function Profile() {
  const { publicKey } = useWallet();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [messages, setMessages] = useState([]);
  const [anchors, setAnchors] = useState([]);
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    if (!publicKey) {
      navigate('/app');
      return;
    }
    loadData();
  }, [publicKey, navigate]);

  const loadData = async () => {
    setLoading(true);
    try {
      const profile = await getUserProfile(publicKey.toString());
      const msgs = await getRecentMessages(publicKey.toString(), 1000);
      const anchs = await getAnchors(publicKey.toString(), 100);
      
      setUserProfile(profile);
      setMessages(msgs);
      setAnchors(anchs);
      
      if (profile) {
        const summary = getProgressSummary(profile, msgs, anchs);
        setProgress(summary);
      }
    } catch (error) {
      console.error('Error loading profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="relative w-screen h-screen overflow-hidden bg-[#050505] text-white">
        <AnimatedBackground />
        <Header />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-[#9945FF] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-zinc-400 mono">Loading your progress...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!userProfile || !progress) {
    return (
      <div className="relative w-screen h-screen overflow-hidden bg-[#050505] text-white">
        <AnimatedBackground />
        <Header />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center space-y-4">
            <p className="text-zinc-400">No profile found</p>
            <button onClick={() => navigate('/app')} className="btn-primary px-6 py-3 rounded-xl">
              Go to App
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-screen min-h-screen overflow-hidden bg-[#050505] text-white">
      <AnimatedBackground />
      <Header />

      <main className="relative z-10 pt-24 pb-12 px-6 max-w-7xl mx-auto">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/app')}
          className="glass rounded-xl px-4 py-2 flex items-center gap-2 mb-6 hover:border-[#9945FF]/50 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back to Chat</span>
        </motion.button>

        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-strong rounded-2xl p-8 mb-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#9945FF] to-[#14F195] flex items-center justify-center glow-purple">
                <Trophy className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold gradient-text mb-1">Learning Profile</h1>
                <p className="text-sm text-zinc-400 mono">
                  {publicKey.toString().slice(0, 8)}...{publicKey.toString().slice(-8)}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold gradient-text">{progress.rank}</div>
              <div className="text-sm text-zinc-500 mono">Level {progress.level}</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-400 mono">Level {progress.level} Progress</span>
              <span className="text-white font-bold">{Math.round(progress.progress)}%</span>
            </div>
            <div className="h-3 bg-zinc-900 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress.progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-[#9945FF] to-[#14F195]"
              />
            </div>
            <div className="text-xs text-zinc-500 text-right mono">
              {progress.xp} / {progress.nextLevel * 1000} XP
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { icon: Zap, label: 'Total XP', value: progress.xp, color: '#14F195' },
            { icon: MessageSquare, label: 'Messages', value: progress.totalMessages, color: '#9945FF' },
            { icon: Anchor, label: 'Anchors', value: progress.blockchainAnchors, color: '#00D4FF' },
            { icon: Star, label: 'Achievements', value: progress.achievements, color: '#FFD700' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-strong rounded-xl p-6 text-center"
            >
              <stat.icon className="w-8 h-8 mx-auto mb-3" style={{ color: stat.color }} />
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-xs text-zinc-500 mono">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Blockchain Anchors */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-strong rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#9945FF]/20 flex items-center justify-center">
                <Anchor className="w-5 h-5 text-[#9945FF]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Blockchain Anchors</h2>
                <p className="text-xs text-zinc-500 mono">On-chain proof of learning</p>
              </div>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {anchors.length === 0 ? (
                <div className="text-center py-8 text-zinc-500">
                  <Shield className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No anchors yet</p>
                  <p className="text-xs">Save your progress to create anchors</p>
                </div>
              ) : (
                anchors.map((anchor, i) => (
                  <motion.div
                    key={anchor.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="glass rounded-xl p-4 hover:border-[#9945FF]/50 transition-all"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Hash className="w-4 h-4 text-[#14F195]" />
                        <span className="text-xs text-zinc-400 mono">
                          {new Date(anchor.anchored_at).toLocaleDateString()}
                        </span>
                      </div>
                      <a
                        href={`https://explorer.solana.com/tx/${anchor.tx_signature}?cluster=devnet`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#9945FF] hover:text-[#14F195] transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                    <div className="text-xs text-zinc-500 mono mb-2">
                      Hash: {anchor.memory_hash.slice(0, 16)}...
                    </div>
                    <div className="flex items-center gap-4 text-xs text-zinc-400">
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        {anchor.message_count} messages
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(anchor.anchored_at).toLocaleTimeString()}
                      </span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>

          {/* Topics Mastered */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="glass-strong rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#00D4FF]/20 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-[#00D4FF]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Topics Mastered</h2>
                <p className="text-xs text-zinc-500 mono">Subjects you've learned</p>
              </div>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {(!userProfile.topics_mastered || userProfile.topics_mastered.length === 0) ? (
                <div className="text-center py-8 text-zinc-500">
                  <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No topics yet</p>
                  <p className="text-xs">Keep learning to master topics</p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {userProfile.topics_mastered.map((topic, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="glass rounded-lg px-4 py-2 hover:border-[#00D4FF]/50 transition-all"
                    >
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-[#FFD700]" />
                        <span className="text-sm text-white font-medium">{topic}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          {/* Blockchain Anchors */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-strong rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#9945FF]/20 flex items-center justify-center">
                <Anchor className="w-5 h-5 text-[#9945FF]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Blockchain Anchors</h2>
                <p className="text-xs text-zinc-500 mono">On-chain proof of learning</p>
              </div>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {anchors.length === 0 ? (
                <div className="text-center py-8 text-zinc-500">
                  <Shield className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No anchors yet</p>
                  <p className="text-xs">Save your progress to create anchors</p>
                </div>
              ) : (
                anchors.map((anchor, i) => (
                  <motion.div
                    key={anchor.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="glass rounded-xl p-4 hover:border-[#9945FF]/50 transition-all"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Hash className="w-4 h-4 text-[#14F195]" />
                        <span className="text-xs text-zinc-400 mono">
                          {new Date(anchor.anchored_at).toLocaleDateString()}
                        </span>
                      </div>
                      <a
                        href={`https://explorer.solana.com/tx/${anchor.tx_signature}?cluster=devnet`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#9945FF] hover:text-[#14F195] transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                    <div className="text-xs text-zinc-500 mono mb-2">
                      Hash: {anchor.memory_hash.slice(0, 16)}...
                    </div>
                    <div className="flex items-center gap-4 text-xs text-zinc-400">
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        {anchor.message_count} messages
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(anchor.anchored_at).toLocaleTimeString()}
                      </span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>

          {/* Learning Stats & Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-6"
          >
            {/* Learning Stats */}
            <div className="glass-strong rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#14F195]/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-[#14F195]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Learning Stats</h2>
                  <p className="text-xs text-zinc-500 mono">Your progress overview</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-400">Current Level</span>
                  <span className="text-lg font-bold text-white">{progress.level}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-400">Total XP</span>
                  <span className="text-lg font-bold gradient-text">{progress.xp}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-400">Rank</span>
                  <span className="text-lg font-bold text-[#FFD700]">{progress.rank}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-400">Topics Mastered</span>
                  <span className="text-lg font-bold text-white">{progress.topicsMastered}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-400">Learning Streak</span>
                  <span className="text-lg font-bold text-[#14F195]">{progress.learningStreak} days</span>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="glass-strong rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#FFD700]/20 flex items-center justify-center">
                  <Award className="w-5 h-5 text-[#FFD700]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Achievements</h2>
                  <p className="text-xs text-zinc-500 mono">{progress.achievements} unlocked</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {progress.unlockedAchievements.length === 0 ? (
                  <div className="col-span-2 text-center py-8 text-zinc-500">
                    <Trophy className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">No achievements yet</p>
                    <p className="text-xs">Keep learning to unlock!</p>
                  </div>
                ) : (
                  progress.unlockedAchievements.map((achievement, i) => (
                    <motion.div
                      key={achievement}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className="glass rounded-lg p-3 text-center hover:border-[#FFD700]/50 transition-all"
                    >
                      <Star className="w-6 h-6 text-[#FFD700] mx-auto mb-2" />
                      <div className="text-xs font-bold text-white capitalize mb-1">
                        {achievement.replace(/_/g, ' ')}
                      </div>
                      <div className="text-[10px] text-zinc-500 mono">Unlocked</div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-strong rounded-2xl p-6 mt-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#00D4FF]/20 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-[#00D4FF]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Recent Activity</h2>
              <p className="text-xs text-zinc-500 mono">Last {Math.min(messages.length, 10)} messages</p>
            </div>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {messages.slice(-10).reverse().map((msg, i) => (
              <div key={i} className="glass rounded-lg p-3 flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  msg.role === 'user' 
                    ? 'bg-[#9945FF]/20' 
                    : 'bg-[#14F195]/20'
                }`}>
                  {msg.role === 'user' ? (
                    <MessageSquare className="w-4 h-4 text-[#9945FF]" />
                  ) : (
                    <Zap className="w-4 h-4 text-[#14F195]" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-zinc-400 mono mb-1">
                    {new Date(msg.created_at).toLocaleString()}
                  </div>
                  <div className="text-sm text-zinc-300 truncate">
                    {msg.content.slice(0, 100)}...
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
