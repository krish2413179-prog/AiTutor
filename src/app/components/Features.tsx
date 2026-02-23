import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, ShieldCheck, Database, Zap, Code, Lock } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: <BookOpen className="w-8 h-8 text-[#9945FF]" />,
      title: "Interactive Learning",
      description: "Engage with AI-driven modules tailored to your skill level. Learn Rust, Solidity, and ZK-proofs through hands-on labs."
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-[#14F195]" />,
      title: "AI Validation",
      description: "Our proprietary AI engine analyzes your code submissions in real-time, verifying logic, security, and efficiency."
    },
    {
      icon: <Database className="w-8 h-8 text-blue-400" />,
      title: "On-Chain Proof",
      description: "Mint a Soulbound Token (SBT) for every mastered skill. Your resume is now immutable, verifiable, and decentralized."
    }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-[#0a0a0a] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            How LearnLedger Works
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            A seamless pipeline from knowledge acquisition to verifiable reputation.
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2, duration: 0.5 }}
              viewport={{ once: true }}
              className="group p-8 rounded-2xl bg-[#111] border border-white/5 hover:border-[#9945FF]/30 transition-all hover:-translate-y-1 shadow-lg hover:shadow-[#9945FF]/10 relative overflow-hidden"
            >
              {/* Subtle Gradient Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#9945FF]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative z-10 space-y-4">
                <div className="w-16 h-16 rounded-xl bg-[#0f0f0f] border border-white/10 flex items-center justify-center group-hover:scale-105 transition-transform">
                  {feature.icon}
                </div>
                
                <h3 className="text-xl font-bold text-white group-hover:text-[#9945FF] transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-gray-400 leading-relaxed text-sm">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
