import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, Database, Activity, TrendingUp, Award, Sparkles } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { getUserProfile } from '../services/supabaseService';

function StatBar({ label, value, color, icon: Icon, maxValue = 100 }) {
  const percentage = (value / maxValue) * 100;
  
  return (
    <motion.div 
      initial={{ x: -20, opacity: 0 }} 
      animate={{ x: 0, opacity: 1 }} 
      className="space-y-3"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}20` }}>
            <Icon className="w-4 h-4" style={{ color }} />
          </div>
          <div>
            <span className="text-sm text-white font-medium">{label}</span>
            <p className="text-xs text-zinc-500 mono">{value}/{maxValue}</p>
          </div>
        </div>
        <span className="mono text-lg font-bold" style={{ color }}>{Math.round(percentage)}%</span>
      </div>
      <div className="h-2 bg-zinc-900 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className="h-full rounded-full relative"
          style={{ 
            background: `linear-gradient(90deg, ${color}60, ${color})`,
            boxShadow: `0 0 15px ${color}80`
          }}
        >
          <div className="absolute inset-0 shimmer" />
        </motion.div>
      </div>
    </motion.div>
  );
}

function InfoCard({ icon: Icon, label, value, color }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="glass rounded-xl p-4 card-hover"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `${color}20` }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <div className="flex-1">
          <p className="text-xs text-zinc-500 uppercase tracking-wide">{label}</p>
          <p className="text-lg font-bold text-white mono">{value}</p>
        </div>
      </div>
    </motion.div>
  );
}

export function LeftPanel() {
  const { publicKey } = useWallet();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (publicKey) {
      getUserProfile(publicKey.toString()).then(setProfile).catch(console.error);
    }
  }, [publicKey]);

  return (
    <motion.aside
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="fixed left-8 top-32 w-96 space-y-4"
    >
      {/* Main Stats Card */}
      <div className="glass-strong rounded-2xl p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">Neural State</h2>
            <p className="text-xs text-zinc-500 mono">Live System Diagnostics</p>
          </div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-6 h-6 text-[#9945FF]" />
          </motion.div>
        </div>

        <div className="space-y-5">
          <StatBar 
            label="Memory Integrity" 
            value={94} 
            maxValue={100}
            color="#9945FF"
            icon={Brain}
          />
          <StatBar 
            label="Knowledge Graph" 
            value={profile?.xp || 0} 
            maxValue={1000}
            color="#14F195"
            icon={Database}
          />
          <StatBar 
            label="Sync Status" 
            value={publicKey ? 100 : 0} 
            maxValue={100}
            color="#14F195"
            icon={Activity}
          />
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-2 gap-3">
        <InfoCard 
          icon={Award}
          label="Level"
          value={profile?.level || '1'}
          color="#9945FF"
        />
        <InfoCard 
          icon={TrendingUp}
          label="XP"
          value={profile?.xp || 0}
          color="#14F195"
        />
      </div>

      {/* Network Info */}
      <div className="glass-strong rounded-2xl p-5 space-y-3">
        <h3 className="text-sm font-bold text-white uppercase tracking-wide">Network Info</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-zinc-500">Chain</span>
            <span className="mono text-xs text-[#14F195] font-medium">SOLANA_DEVNET</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-zinc-500">Latency</span>
            <span className="mono text-xs text-white font-medium">12ms</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-zinc-500">Status</span>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${publicKey ? 'status-online' : 'status-offline'}`} />
              <span className="mono text-xs text-zinc-400 font-medium">
                {publicKey ? 'ONLINE' : 'OFFLINE'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.aside>
  );
}
