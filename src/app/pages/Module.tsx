import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useWallet } from '@solana/wallet-adapter-react';
import { BookOpen, ChevronLeft, ChevronRight, CheckCircle, MessageCircle } from 'lucide-react';
import WalletButton from '../components/WalletButton';

interface ModuleSection {
  title: string;
  content: string;
}

const Module: React.FC = () => {
  const { connected } = useWallet();
  const [currentSection, setCurrentSection] = useState(0);

  // TODO: Fetch module content from API
  const sections: ModuleSection[] = [];
  const moduleTitle = 'Module';
  const moduleNumber = '1';

  const handleNext = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

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
            Please connect your wallet to access learning modules and track your progress.
          </p>
          <WalletButton className="mx-auto" />
        </motion.div>
      </div>
    );
  }

  const progress = sections.length > 0 ? ((currentSection + 1) / sections.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-[#0f0f0f] pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#9945FF] to-[#14F195] flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">{moduleTitle}</h1>
              <p className="text-sm text-gray-400">Module {moduleNumber}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Progress</span>
              <span className="text-white font-medium">{progress.toFixed(0)}%</span>
            </div>
            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
                className="h-full bg-gradient-to-r from-[#9945FF] to-[#14F195]"
              />
            </div>
          </div>
        </motion.div>

        {/* Content */}
        {sections.length > 0 ? (
          <motion.div
            key={currentSection}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="p-8 rounded-xl bg-white/5 border border-white/10 mb-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6">{sections[currentSection].title}</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                {sections[currentSection].content}
              </p>
            </div>

            {currentSection === sections.length - 1 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-8 p-6 rounded-lg bg-[#14F195]/10 border border-[#14F195]/20 flex items-start gap-4"
              >
                <CheckCircle className="w-6 h-6 text-[#14F195] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Module Complete!</h3>
                  <p className="text-gray-300 text-sm">
                    You've finished this module. Take a quiz to test your knowledge and earn a skill badge.
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <div className="p-12 rounded-xl bg-white/5 border border-white/10 mb-8 text-center">
            <BookOpen className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">No module content available</h2>
            <p className="text-gray-400">
              This module's content will be available once it's added to the platform.
            </p>
          </div>
        )}

        {/* Navigation */}
        {sections.length > 0 && (
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={handlePrevious}
              disabled={currentSection === 0}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <ChevronLeft className="w-5 h-5" />
              Previous
            </button>

            <div className="flex gap-2">
              {sections.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSection(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentSection
                      ? 'bg-[#14F195] w-8'
                      : index < currentSection
                      ? 'bg-[#14F195]/50'
                      : 'bg-white/20'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={currentSection === sections.length - 1}
              className="px-6 py-3 bg-[#14F195] hover:bg-[#14F195]/90 text-black font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              Next
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Q&A Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-12 p-8 rounded-xl bg-gradient-to-br from-[#9945FF]/20 to-[#9945FF]/5 border border-[#9945FF]/20"
        >
          <div className="flex items-center gap-3 mb-4">
            <MessageCircle className="w-6 h-6 text-[#9945FF]" />
            <h3 className="text-xl font-bold text-white">Have Questions?</h3>
          </div>
          <p className="text-gray-300 mb-6">
            Ask our AI assistant anything about this module and get instant answers.
          </p>
          <Link to="/ask-ai">
            <button className="px-6 py-3 bg-[#9945FF] hover:bg-[#9945FF]/90 text-white font-medium rounded-lg transition-all">
              Ask AI Assistant
            </button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Module;
