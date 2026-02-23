import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle, XCircle } from 'lucide-react';

interface QuizCardProps {
  question: string;
  options: string[];
  selectedAnswer?: string;
  correctAnswer?: string;
  onSelectAnswer?: (answer: string) => void;
  showResult?: boolean;
  questionNumber: number;
}

const QuizCard: React.FC<QuizCardProps> = ({
  question,
  options,
  selectedAnswer,
  correctAnswer,
  onSelectAnswer,
  showResult = false,
  questionNumber,
}) => {
  const getOptionStyle = (option: string) => {
    if (!showResult) {
      return selectedAnswer === option
        ? 'bg-[#14F195]/20 border-[#14F195] text-white'
        : 'bg-white/5 border-white/10 text-gray-300 hover:border-[#9945FF]/50';
    }

    if (option === correctAnswer) {
      return 'bg-[#14F195]/20 border-[#14F195] text-white';
    }

    if (option === selectedAnswer && option !== correctAnswer) {
      return 'bg-red-500/20 border-red-500 text-white';
    }

    return 'bg-white/5 border-white/10 text-gray-400';
  };

  const getOptionIcon = (option: string) => {
    if (!showResult) return null;

    if (option === correctAnswer) {
      return <CheckCircle className="w-5 h-5 text-[#14F195]" />;
    }

    if (option === selectedAnswer && option !== correctAnswer) {
      return <XCircle className="w-5 h-5 text-red-500" />;
    }

    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-xl bg-white/5 border border-white/10 space-y-6"
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-[#9945FF] to-[#9945FF]/80 flex items-center justify-center">
          <span className="text-white font-bold">{questionNumber}</span>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white leading-relaxed">{question}</h3>
        </div>
      </div>

      <div className="space-y-3">
        {options.map((option, index) => (
          <motion.button
            key={index}
            whileHover={!showResult ? { scale: 1.01 } : {}}
            whileTap={!showResult ? { scale: 0.99 } : {}}
            onClick={() => !showResult && onSelectAnswer?.(option)}
            disabled={showResult}
            className={`w-full p-4 rounded-lg border-2 transition-all text-left flex items-center justify-between ${getOptionStyle(option)} ${
              showResult ? 'cursor-default' : 'cursor-pointer'
            }`}
          >
            <span className="font-medium">{option}</span>
            {getOptionIcon(option)}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default QuizCard;
