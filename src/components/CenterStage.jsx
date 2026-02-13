import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Zap, Brain, Database } from 'lucide-react';

export function CenterStage() {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px]"
    >
      <div className="relative w-full h-full">
        {/* Outer Rotating Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full"
          style={{
            background: 'conic-gradient(from 0deg, transparent 0%, rgba(153, 69, 255, 0.3) 50%, transparent 100%)',
          }}
        />

        {/* Main Glow Ring */}
        <motion.div
          animate={{ 
            scale: [1, 1.05, 1],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute inset-4 rounded-full border-2 border-[#9945FF]/40 glow-purple"
        />

        {/* Inner Ring */}
        <motion.div
          animate={{ 
            rotate: -360,
            scale: [1, 0.98, 1]
          }}
          transition={{ 
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute inset-12 rounded-full border border-[#14F195]/30"
        />

        {/* Center Content */}
        <div className="absolute inset-20 rounded-full glass-strong flex items-center justify-center">
          <div className="text-center space-y-6">
            {/* Animated Logo */}
            <motion.div
              animate={{ 
                rotate: 360,
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }}
              className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-[#9945FF] to-[#14F195] flex items-center justify-center glow-purple"
            >
              <Zap className="w-12 h-12 text-white" />
            </motion.div>

            {/* Text */}
            <div>
              <h2 className="text-2xl font-bold gradient-text mb-2">SOVEREIGN</h2>
              <p className="text-xs text-zinc-500 mono">AI Neural Network</p>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center gap-4">
              {[
                { icon: Brain, color: '#9945FF' },
                { icon: Database, color: '#14F195' },
                { icon: Cpu, color: '#9945FF' }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                  className="w-8 h-8 rounded-lg glass flex items-center justify-center"
                >
                  <item.icon className="w-4 h-4" style={{ color: item.color }} />
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Corner Brackets */}
        {[
          { pos: 'top-0 left-0', rotate: 0 },
          { pos: 'top-0 right-0', rotate: 90 },
          { pos: 'bottom-0 right-0', rotate: 180 },
          { pos: 'bottom-0 left-0', rotate: 270 }
        ].map((corner, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
            className={`absolute ${corner.pos} w-16 h-16`}
            style={{ transform: `rotate(${corner.rotate}deg)` }}
          >
            <svg width="64" height="64" viewBox="0 0 64 64">
              <path
                d="M 0 16 L 0 0 L 16 0"
                stroke="#9945FF"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="M 4 16 L 4 4 L 16 4"
                stroke="#14F195"
                strokeWidth="1"
                fill="none"
                opacity="0.5"
              />
            </svg>
          </motion.div>
        ))}

        {/* Orbital Dots */}
        {[0, 120, 240].map((angle, i) => (
          <motion.div
            key={i}
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear", delay: i * 0.3 }}
            className="absolute inset-0"
          >
            <div 
              className="absolute w-3 h-3 rounded-full bg-[#14F195] glow-green-sm"
              style={{
                top: '50%',
                left: '50%',
                transform: `rotate(${angle}deg) translateX(220px) translateY(-50%)`
              }}
            />
          </motion.div>
        ))}

        {/* Status Indicator */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute -bottom-16 left-1/2 -translate-x-1/2"
        >
          <div className="glass-strong px-6 py-3 rounded-full flex items-center gap-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Cpu className="w-5 h-5 text-[#9945FF]" />
            </motion.div>
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 bg-[#14F195] rounded-full"
              />
              <span className="mono text-sm text-zinc-400 font-medium">SYSTEM_ACTIVE</span>
            </div>
            <div className="w-px h-4 bg-zinc-700" />
            <span className="mono text-xs text-zinc-600">v2.0</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
