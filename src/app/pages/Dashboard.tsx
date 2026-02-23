import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useWallet } from '@solana/wallet-adapter-react';
import { BookOpen, Trophy, Target, TrendingUp, Brain, Zap, Loader2 } from 'lucide-react';
import StatsCard from '../components/StatsCard';
import ModuleCard from '../components/ModuleCard';
import WalletButton from '../components/WalletButton';
import api from '../services/api';

interface UserProgress {
  id: string;
  wallet_address: string;
  topic: string;
  progress_percentage: number;
  completed: boolean;
  last_accessed: string;
  created_at: string;
}

interface UserProfile {
  wallet_address: string;
  total_xp: number;
  current_level: number;
  created_at: string;
  last_login: string;
}

const Dashboard: React.FC = () => {
  const { connected, publicKey } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Fetch user data when wallet is connected
  useEffect(() => {
    const fetchUserData = async () => {
      if (!connected || !publicKey) return;

      setLoading(true);
      setError(null);

      try {
        const walletAddress = publicKey.toBase58();

        // Initialize user if not exists
        await api.post('/user/init', { walletAddress });

        // Fetch user progress and profile in parallel
        const [progressResponse, profileResponse] = await Promise.all([
          api.get(`/progress/${walletAddress}`),
          api.get(`/user/${walletAddress}`)
        ]);

        setUserProgress(progressResponse.data.data || []);
        setUserProfile(profileResponse.data.data || null);
      } catch (err: any) {
        console.error('Error fetching user data:', err);
        setError(err.response?.data?.error || 'Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [connected, publicKey]);

  // Calculate stats from user data
  const calculateStats = () => {
    const modulesCompleted = userProgress.filter(p => p.completed).length;
    const totalModules = userProgress.length;
    
    // Calculate average progress percentage for quiz score approximation
    const avgProgress = totalModules > 0
      ? Math.round(userProgress.reduce((sum, p) => sum + p.progress_percentage, 0) / totalModules)
      : 0;

    // Calculate learning streak (days since last activity)
    let learningStreak = 0;
    if (userProgress.length > 0) {
      const lastAccessed = userProgress
        .map(p => new Date(p.last_accessed))
        .sort((a, b) => b.getTime() - a.getTime())[0];
      
      const daysSinceLastActivity = Math.floor(
        (Date.now() - lastAccessed.getTime()) / (1000 * 60 * 60 * 24)
      );
      
      // If accessed within last 24 hours, count as active streak
      learningStreak = daysSinceLastActivity <= 1 ? 1 : 0;
    }

    // Skills earned based on XP (1 skill per 100 XP)
    const skillsEarned = userProfile ? Math.floor(userProfile.total_xp / 100) : 0;

    return {
      modulesCompleted,
      quizScore: avgProgress,
      learningStreak,
      skillsEarned
    };
  };

  const stats = calculateStats();

  // Transform user progress into module cards
  const modules = userProgress.map(progress => ({
    id: progress.id,
    title: progress.topic,
    description: `Continue learning about ${progress.topic}`,
    duration: 'Self-paced',
    progress: progress.progress_percentage,
    isCompleted: progress.completed,
    lastAccessed: new Date(progress.last_accessed).toLocaleDateString()
  }));

  if (!connected) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6 max-w-md"
        >
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-[#9945FF] to-[#14F195] flex items-center justify-center">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white">Connect Your Wallet</h2>
          <p className="text-gray-400">
            Please connect your wallet to access your learning dashboard and track your progress.
          </p>
          <WalletButton className="mx-auto" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Welcome back, <span className="text-[#14F195]">Learner</span>
          </h1>
          <p className="text-xl text-gray-400">
            Continue your journey to Web3 mastery
            {userProfile && (
              <span className="ml-2 text-[#9945FF]">
                • Level {userProfile.current_level} • {userProfile.total_xp} XP
              </span>
            )}
          </p>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-[#14F195] animate-spin" />
            <span className="ml-3 text-gray-400">Loading your progress...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Stats Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Modules Completed"
              value={stats.modulesCompleted.toString()}
              icon={BookOpen}
              trend={stats.modulesCompleted > 0 ? `${stats.modulesCompleted} completed` : 'Start learning'}
              color="green"
            />
            <StatsCard
              title="Quiz Score"
              value={`${stats.quizScore}%`}
              icon={Trophy}
              trend={stats.quizScore > 0 ? 'Keep it up!' : 'No quizzes yet'}
              color="purple"
            />
            <StatsCard
              title="Learning Streak"
              value={`${stats.learningStreak} day${stats.learningStreak !== 1 ? 's' : ''}`}
              icon={Target}
              trend={stats.learningStreak > 0 ? 'Active today!' : 'Begin your journey'}
              color="blue"
            />
            <StatsCard
              title="Skills Earned"
              value={stats.skillsEarned.toString()}
              icon={Zap}
              trend={stats.skillsEarned > 0 ? `${stats.skillsEarned} skills unlocked` : 'Earn your first skill'}
              color="green"
            />
          </div>
        )}

        {/* Recent Activity */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Continue Learning</h2>
              {modules.length > 0 && (
                <Link to="/quiz" className="text-[#14F195] hover:text-[#14F195]/80 transition-colors text-sm font-medium">
                  View All
                </Link>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {modules.length > 0 ? (
                modules.map((module) => (
                  <ModuleCard key={module.id} {...module} />
                ))
              ) : (
                <div className="col-span-full p-12 rounded-xl bg-white/5 border border-white/10 text-center">
                  <BookOpen className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Start Your Learning Journey</h3>
                  <p className="text-gray-400 mb-6">
                    Take a quiz or ask the AI assistant to begin tracking your progress.
                  </p>
                  <div className="flex gap-4 justify-center">
                    <Link to="/quiz">
                      <button className="px-6 py-3 bg-[#14F195] hover:bg-[#14F195]/90 text-black font-medium rounded-lg transition-all">
                        Take a Quiz
                      </button>
                    </Link>
                    <Link to="/ask-ai">
                      <button className="px-6 py-3 bg-[#9945FF] hover:bg-[#9945FF]/90 text-white font-medium rounded-lg transition-all">
                        Ask AI
                      </button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="p-8 rounded-xl bg-gradient-to-br from-[#9945FF]/20 to-[#9945FF]/5 border border-[#9945FF]/20">
            <Brain className="w-12 h-12 text-[#9945FF] mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">Ask AI Assistant</h3>
            <p className="text-gray-400 mb-6">
              Get instant answers to your learning questions powered by AI.
            </p>
            <Link to="/ask-ai">
              <button className="px-6 py-3 bg-[#9945FF] hover:bg-[#9945FF]/90 text-white font-medium rounded-lg transition-all">
                Start Asking
              </button>
            </Link>
          </div>

          <div className="p-8 rounded-xl bg-gradient-to-br from-[#14F195]/20 to-[#14F195]/5 border border-[#14F195]/20">
            <TrendingUp className="w-12 h-12 text-[#14F195] mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">Take a Quiz</h3>
            <p className="text-gray-400 mb-6">
              Test your knowledge and earn skill badges on the blockchain.
            </p>
            <Link to="/quiz">
              <button className="px-6 py-3 bg-[#14F195] hover:bg-[#14F195]/90 text-black font-medium rounded-lg transition-all">
                Start Quiz
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
