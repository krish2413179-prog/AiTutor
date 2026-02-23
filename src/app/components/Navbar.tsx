import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Menu, X, ChevronRight } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import WalletButton from './WalletButton';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { connected } = useWallet();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0f0f0f]/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#9945FF] to-[#14F195] flex items-center justify-center">
              <span className="text-black font-bold text-lg">L</span>
            </div>
            <span className="text-white font-bold text-xl tracking-tight">LearnLedger</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {connected && (
              <>
                <Link 
                  to="/dashboard" 
                  className={`text-sm font-medium transition-colors ${
                    isActive('/dashboard') ? 'text-[#14F195]' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/ask-ai" 
                  className={`text-sm font-medium transition-colors ${
                    isActive('/ask-ai') ? 'text-[#14F195]' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Ask AI
                </Link>
                <Link 
                  to="/quiz" 
                  className={`text-sm font-medium transition-colors ${
                    isActive('/quiz') ? 'text-[#14F195]' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Quiz
                </Link>
                <Link 
                  to="/module" 
                  className={`text-sm font-medium transition-colors ${
                    isActive('/module') ? 'text-[#14F195]' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Modules
                </Link>
              </>
            )}
            {!connected && (
              <>
                <a href="#how-it-works" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">How it Works</a>
                <a href="#features" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Features</a>
                <a href="#community" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Community</a>
              </>
            )}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <WalletButton />
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden absolute top-20 left-0 right-0 bg-[#0f0f0f] border-b border-white/10 p-6 flex flex-col gap-4"
        >
          {connected ? (
            <>
              <Link to="/dashboard" className="text-gray-300 hover:text-white py-2" onClick={() => setIsOpen(false)}>Dashboard</Link>
              <Link to="/ask-ai" className="text-gray-300 hover:text-white py-2" onClick={() => setIsOpen(false)}>Ask AI</Link>
              <Link to="/quiz" className="text-gray-300 hover:text-white py-2" onClick={() => setIsOpen(false)}>Quiz</Link>
              <Link to="/module" className="text-gray-300 hover:text-white py-2" onClick={() => setIsOpen(false)}>Modules</Link>
            </>
          ) : (
            <>
              <a href="#how-it-works" className="text-gray-300 hover:text-white py-2">How it Works</a>
              <a href="#features" className="text-gray-300 hover:text-white py-2">Features</a>
              <a href="#community" className="text-gray-300 hover:text-white py-2">Community</a>
            </>
          )}
          <WalletButton variant="mobile" />
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
