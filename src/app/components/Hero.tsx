import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Wallet } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import Scene3D from './Scene3D';
import WalletButton from './WalletButton';

const Hero = () => {
  const navigate = useNavigate();
  const { connected } = useWallet();

  const handleGetStarted = () => {
    if (connected) {
      navigate('/dashboard');
    }
  };

  return (
    <section className="relative w-full min-h-screen pt-32 pb-20 overflow-hidden bg-[#0f0f0f] flex items-center">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#9945FF]/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#14F195]/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center z-10">
        
        {/* Left Content */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
            <span className="w-2 h-2 rounded-full bg-[#14F195] animate-pulse" />
            <span className="text-xs font-mono text-[#14F195] tracking-wide uppercase">Beta Access Live</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white leading-[1.1] tracking-tight">
            AI-Validated Skill <span className="text-[#14F195]">Proof</span> for Web3
          </h1>
          
          <p className="text-xl text-gray-400 max-w-lg leading-relaxed">
            Learn. Validate. Anchor. Build verifiable on-chain skill reputation backed by real-time AI assessment.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            {connected ? (
              <button 
                onClick={handleGetStarted}
                className="px-8 py-4 bg-[#14F195] hover:bg-[#14F195]/90 text-black font-bold text-lg rounded-lg transition-all flex items-center justify-center gap-2 group"
              >
                Go to Dashboard
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <WalletButton className="px-8 py-4 text-lg group">
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </WalletButton>
            )}
            
            <button className="px-8 py-4 bg-transparent border border-white/20 hover:border-[#9945FF] hover:text-[#9945FF] text-white font-medium text-lg rounded-lg transition-all flex items-center justify-center">
              View Demo
            </button>
          </div>
          
          <div className="flex items-center gap-6 pt-8 border-t border-white/10">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full bg-gray-800 border-2 border-[#0f0f0f] flex items-center justify-center text-xs text-white overflow-hidden">
                   <div className={`w-full h-full bg-gradient-to-br from-gray-700 to-gray-900`} />
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-400">
              <span className="text-white font-bold">12,000+</span> verified developers
            </p>
          </div>
        </motion.div>

        {/* Right Content - 3D Scene */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative h-full flex items-center justify-center"
        >
          <Scene3D />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
