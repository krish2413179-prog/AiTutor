import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Clock, CheckCircle } from 'lucide-react';

interface ModuleCardProps {
  title: string;
  description: string;
  duration: string;
  progress: number;
  isCompleted?: boolean;
  onClick?: () => void;
}

const ModuleCard: React.FC<ModuleCardProps> = ({
  title,
  description,
  duration,
  progress,
  isCompleted = false,
  onClick,
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="relative p-6 rounded-xl bg-white/5 border border-white/10 hover:border-[#14F195]/50 transition-all cursor-pointer group"
    >
      {isCompleted && (
        <div className="absolute top-4 right-4">
          <CheckCircle className="w-6 h-6 text-[#14F195]" />
        </div>
      )}

      <div className="flex items-start gap-4 mb-4">
        <div className="p-3 rounded-lg bg-gradient-to-br from-[#9945FF]/20 to-[#9945FF]/5 border border-[#9945FF]/20">
          <BookOpen className="w-6 h-6 text-[#9945FF]" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#14F195] transition-colors">
            {title}
          </h3>
          <p className="text-sm text-gray-400 line-clamp-2">{description}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4 text-sm text-gray-400">
        <Clock className="w-4 h-4" />
        <span>{duration}</span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Progress</span>
          <span className="text-white font-medium">{progress}%</span>
        </div>
        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-[#9945FF] to-[#14F195]"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default ModuleCard;
