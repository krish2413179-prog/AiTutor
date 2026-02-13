import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Zap, Shield, Sparkles, ArrowRight, Brain, Lock, Globe, TrendingUp } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="relative w-screen min-h-screen overflow-hidden bg-black">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950 to-black" />
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#9945FF]/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#14F195]/20 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Navbar */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 right-0 z-50 px-8 py-6"
      >
        <div className="glass-strong rounded-2xl px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#9945FF] to-[#14F195] flex items-center justify-center glow-purple-sm">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">SOVEREIGN</h1>
              <p className="text-xs text-zinc-500 mono">AI Network</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/app')}
            className="btn-primary px-6 py-3 rounded-xl flex items-center gap-2"
          >
            <span className="font-bold">Launch App</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-8 pt-32 pb-20">
        <div className="max-w-6xl mx-auto text-center space-y-12">
          {/* Badge */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full"
          >
            <Sparkles className="w-4 h-4 text-[#14F195]" />
            <span className="text-sm text-zinc-400">Powered by Solana Blockchain</span>
          </motion.div>

          {/* Main Heading */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <h1 className="text-7xl md:text-8xl font-bold leading-tight">
              <span className="gradient-text">Decentralized</span>
              <br />
              <span className="text-white">AI Learning</span>
            </h1>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              Learn anything with AI. Your progress becomes transferable NFTs on Solana. 
              Own your knowledge, take it anywhere, prove your skills.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/app')}
              className="btn-primary px-8 py-4 rounded-2xl flex items-center gap-3 text-lg font-bold"
            >
              <Zap className="w-5 h-5" />
              <span>Get Started</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="glass px-8 py-4 rounded-2xl flex items-center gap-3 text-lg font-bold hover:border-[#9945FF]/50"
            >
              <span>Learn More</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-3 gap-8 max-w-3xl mx-auto pt-12"
          >
            {[
              { value: '10K+', label: 'Active Users' },
              { value: '50K+', label: 'Lessons Completed' },
              { value: '99.9%', label: 'Uptime' }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl font-bold gradient-text mb-2">{stat.value}</div>
                <div className="text-sm text-zinc-500">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative px-8 py-32">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold text-white mb-4">Why Sovereign?</h2>
            <p className="text-xl text-zinc-400">The future of learning is decentralized</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Brain,
                title: 'Learn Anything',
                desc: 'AI tutor for any subject - coding, math, languages, and more',
                color: '#9945FF'
              },
              {
                icon: TrendingUp,
                title: 'Earn & Level Up',
                desc: 'Gain XP, unlock achievements, and track your progress',
                color: '#14F195'
              },
              {
                icon: Lock,
                title: 'Mint as NFT',
                desc: 'Your progress becomes transferable blockchain credentials',
                color: '#9945FF'
              },
              {
                icon: Globe,
                title: 'Use Anywhere',
                desc: 'Transfer your learning rank between different platforms',
                color: '#14F195'
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="glass-strong rounded-2xl p-6 space-y-4 card-hover"
              >
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: `${feature.color}20` }}
                >
                  <feature.icon className="w-6 h-6" style={{ color: feature.color }} />
                </div>
                <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                <p className="text-zinc-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative px-8 py-32">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-xl text-zinc-400">Get started in 3 simple steps</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Connect Wallet',
                desc: 'Link your Solana wallet to get started'
              },
              {
                step: '02',
                title: 'Learn & Earn',
                desc: 'Chat with AI, gain XP, unlock achievements'
              },
              {
                step: '03',
                title: 'Mint Progress NFT',
                desc: 'Turn your learning into transferable credentials'
              }
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative"
              >
                <div className="glass-strong rounded-2xl p-8 space-y-4">
                  <div className="text-6xl font-bold gradient-text opacity-20">{step.step}</div>
                  <h3 className="text-2xl font-bold text-white">{step.title}</h3>
                  <p className="text-zinc-400">{step.desc}</p>
                </div>
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-[#9945FF] to-[#14F195]" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative px-8 py-32">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="glass-strong rounded-3xl p-12 text-center space-y-8 relative overflow-hidden"
          >
            <div className="absolute inset-0 gradient-overlay opacity-30" />
            <div className="relative z-10 space-y-8">
              <h2 className="text-5xl font-bold text-white">Ready to Start Learning?</h2>
              <p className="text-xl text-zinc-400">
                Join thousands of learners building their knowledge on-chain
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/app')}
                className="btn-primary px-10 py-5 rounded-2xl flex items-center gap-3 text-xl font-bold mx-auto"
              >
                <Zap className="w-6 h-6" />
                <span>Launch Sovereign</span>
                <ArrowRight className="w-6 h-6" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative px-8 py-12 border-t border-zinc-800/50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#9945FF] to-[#14F195] flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-zinc-400 mono text-sm">© 2026 Sovereign. Built on Solana.</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-zinc-500">
            <a href="#" className="hover:text-white transition-colors">Docs</a>
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">Discord</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
