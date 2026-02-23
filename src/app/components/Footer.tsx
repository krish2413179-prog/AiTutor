import React from 'react';
import { Github, Twitter, Linkedin, MessageCircle } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#0a0a0a] pt-24 pb-12 border-t border-white/5 text-gray-400 text-sm">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
          <div className="col-span-2 lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#9945FF] to-[#14F195] flex items-center justify-center">
                <span className="text-black font-bold text-lg">L</span>
              </div>
              <span className="text-white font-bold text-xl tracking-tight">LearnLedger</span>
            </div>
            <p className="max-w-xs leading-relaxed">
              The first AI-validated skill verification protocol for the Web3 ecosystem. Build your on-chain reputation today.
            </p>
            <div className="flex items-center gap-4 pt-4">
              <a href="#" className="p-2 rounded-full bg-white/5 hover:bg-white/10 hover:text-[#14F195] transition-all">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 rounded-full bg-white/5 hover:bg-white/10 hover:text-[#9945FF] transition-all">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 rounded-full bg-white/5 hover:bg-white/10 hover:text-blue-400 transition-all">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-white font-bold mb-4">Platform</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-[#14F195] transition-colors">Curriculum</a></li>
              <li><a href="#" className="hover:text-[#14F195] transition-colors">Proof of Skill</a></li>
              <li><a href="#" className="hover:text-[#14F195] transition-colors">Leaderboard</a></li>
              <li><a href="#" className="hover:text-[#14F195] transition-colors">Pricing</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-white font-bold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-[#9945FF] transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-[#9945FF] transition-colors">API Reference</a></li>
              <li><a href="#" className="hover:text-[#9945FF] transition-colors">Community Hub</a></li>
              <li><a href="#" className="hover:text-[#9945FF] transition-colors">Blog</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-white font-bold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2024 LearnLedger Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#14F195] animate-pulse" />
              <span className="text-xs font-mono text-[#14F195]">System Operational</span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
