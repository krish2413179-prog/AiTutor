import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Trophy, GitCommit, CheckCircle, BarChart3, AlertCircle } from 'lucide-react';

const DashboardPreview = () => {
  const [activeTab, setActiveTab] = useState('skills');

  return (
    <section className="py-24 bg-[#0f0f0f] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="mb-16 text-center space-y-4">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#9945FF]/10 border border-[#9945FF]/20 mb-4">
              <Sparkles className="w-3 h-3 text-[#9945FF]" />
              <span className="text-xs font-mono text-[#9945FF] tracking-wide uppercase">Live Dashboard</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
              Skill Dashboard <span className="text-[#9945FF]">Preview</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Track your progress, manage certifications, and showcase your verified on-chain resume.
            </p>
        </div>

        {/* Dashboard UI Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative max-w-5xl mx-auto rounded-3xl border border-white/10 bg-[#111] shadow-2xl overflow-hidden"
        >
          {/* Top Bar */}
          <div className="h-16 border-b border-white/5 bg-[#0a0a0a] flex items-center justify-between px-6 md:px-8">
             <div className="flex items-center gap-8">
               <div className="text-white font-bold text-lg tracking-tight">LearnLedger</div>
               <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-400">
                 <button className={`hover:text-white transition-colors ${activeTab === 'skills' ? 'text-white' : ''}`}>Skills</button>
                 <button className="hover:text-white transition-colors">Achievements</button>
                 <button className="hover:text-white transition-colors">Network</button>
               </nav>
             </div>
             
             <div className="flex items-center gap-4">
               <div className="hidden md:flex flex-col items-end mr-2">
                 <span className="text-xs text-gray-400">Total XP</span>
                 <span className="text-sm font-mono text-[#14F195]">12,450 XP</span>
               </div>
               <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#9945FF] to-[#14F195]" />
             </div>
          </div>

          {/* Main Content Area */}
          <div className="grid md:grid-cols-12 min-h-[500px]">
            
            {/* Sidebar */}
            <div className="hidden md:block col-span-3 border-r border-white/5 bg-[#0d0d0d] p-6 space-y-6">
               <div className="space-y-1">
                 <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Your Journey</p>
                 {['Overview', 'Smart Contracts', 'DeFi Protocols', 'Zero Knowledge', 'Security Audits'].map((item, idx) => (
                   <div key={idx} className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${idx === 0 ? 'bg-white/5 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
                     <span className="text-sm font-medium">{item}</span>
                     {idx === 0 && <div className="w-1.5 h-1.5 rounded-full bg-[#9945FF]" />}
                   </div>
                 ))}
               </div>

               <div className="mt-auto pt-6 border-t border-white/5">
                 <div className="p-4 rounded-xl bg-gradient-to-br from-[#9945FF]/10 to-transparent border border-[#9945FF]/20">
                   <h4 className="text-sm font-bold text-white mb-1">Weekly Challenge</h4>
                   <p className="text-xs text-gray-400 mb-3">Complete the Rust ownership module to earn 500 XP.</p>
                   <button className="w-full py-2 bg-[#9945FF] hover:bg-[#8833EE] text-white text-xs font-bold rounded transition-colors">
                     Start Now
                   </button>
                 </div>
               </div>
            </div>

            {/* Main Content */}
            <div className="col-span-12 md:col-span-9 bg-[#111] p-6 md:p-8 space-y-8">
              
              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <div className="p-4 rounded-xl bg-[#161616] border border-white/5 space-y-2">
                   <div className="flex justify-between items-start">
                     <span className="text-gray-400 text-xs uppercase">Current Level</span>
                     <Trophy className="w-4 h-4 text-[#14F195]" />
                   </div>
                   <div className="text-2xl font-bold text-white">Lvl 12</div>
                   <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden mt-2">
                     <div className="h-full w-[75%] bg-[#14F195]" />
                   </div>
                 </div>
                 
                 <div className="p-4 rounded-xl bg-[#161616] border border-white/5 space-y-2">
                   <div className="flex justify-between items-start">
                     <span className="text-gray-400 text-xs uppercase">Verified Skills</span>
                     <CheckCircle className="w-4 h-4 text-[#9945FF]" />
                   </div>
                   <div className="text-2xl font-bold text-white">18</div>
                   <div className="text-xs text-gray-500">+2 this week</div>
                 </div>

                 <div className="p-4 rounded-xl bg-[#161616] border border-white/5 space-y-2">
                   <div className="flex justify-between items-start">
                     <span className="text-gray-400 text-xs uppercase">On-Chain Rank</span>
                     <BarChart3 className="w-4 h-4 text-blue-400" />
                   </div>
                   <div className="text-2xl font-bold text-white">#428</div>
                   <div className="text-xs text-gray-500">Top 5% of learners</div>
                 </div>
              </div>

              {/* Active Module */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">Active Module: Advanced Solidity</h3>
                  <span className="px-2 py-1 bg-yellow-500/10 text-yellow-500 text-xs font-bold rounded border border-yellow-500/20">In Progress</span>
                </div>
                
                <div className="p-6 rounded-xl bg-[#0a0a0a] border border-white/5 relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-4 opacity-10">
                     <GitCommit className="w-32 h-32 text-white" />
                   </div>
                   
                   <div className="relative z-10 space-y-6">
                     <div className="flex gap-4 text-sm text-gray-400">
                       <div className="flex items-center gap-2">
                         <div className="w-2 h-2 rounded-full bg-green-500" />
                         Security Patterns
                       </div>
                       <div className="flex items-center gap-2">
                         <div className="w-2 h-2 rounded-full bg-gray-600" />
                         Gas Optimization
                       </div>
                     </div>

                     <div className="space-y-2">
                       <div className="flex justify-between text-xs text-gray-400">
                         <span>Module Progress</span>
                         <span>85%</span>
                       </div>
                       <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                         <div className="h-full w-[85%] bg-gradient-to-r from-[#9945FF] to-[#14F195]" />
                       </div>
                     </div>

                     <div className="flex gap-4 pt-2">
                       <button className="px-5 py-2 bg-white text-black text-sm font-bold rounded hover:bg-gray-200 transition-colors">
                         Continue Learning
                       </button>
                       <button className="px-5 py-2 border border-white/20 text-white text-sm font-bold rounded hover:border-[#14F195] hover:text-[#14F195] transition-colors flex items-center gap-2">
                         <AlertCircle className="w-4 h-4" />
                         Take Assessment
                       </button>
                     </div>
                   </div>
                </div>
              </div>

              {/* Recent Certifications List */}
              <div className="space-y-4">
                 <h3 className="text-lg font-bold text-white">Recent Anchors</h3>
                 <div className="space-y-2">
                   {[
                     { name: "DeFi Architecture 101", date: "2 days ago", hash: "0x7f...3a92" },
                     { name: "Rust Fundamentals", date: "1 week ago", hash: "0x2b...9c14" }
                   ].map((cert, i) => (
                     <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-[#161616] hover:bg-[#1a1a1a] transition-colors border border-transparent hover:border-white/5 group">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded bg-[#14F195]/10 text-[#14F195]">
                            <CheckCircle className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{cert.name}</p>
                            <p className="text-xs text-gray-500">{cert.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-mono text-gray-500 group-hover:text-[#9945FF] transition-colors cursor-pointer flex items-center gap-1">
                            {cert.hash}
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
                          </p>
                        </div>
                     </div>
                   ))}
                 </div>
              </div>

            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DashboardPreview;
