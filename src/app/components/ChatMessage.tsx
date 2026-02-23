import React from 'react';
import { motion } from 'motion/react';
import { Bot, User } from 'lucide-react';

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp?: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isUser, timestamp }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
        isUser 
          ? 'bg-gradient-to-br from-[#14F195] to-[#14F195]/80' 
          : 'bg-gradient-to-br from-[#9945FF] to-[#9945FF]/80'
      }`}>
        {isUser ? (
          <User className="w-5 h-5 text-black" />
        ) : (
          <Bot className="w-5 h-5 text-white" />
        )}
      </div>

      <div className={`flex-1 max-w-[80%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        <div className={`px-4 py-3 rounded-2xl ${
          isUser 
            ? 'bg-[#14F195] text-black rounded-tr-sm' 
            : 'bg-white/10 text-white rounded-tl-sm border border-white/10'
        }`}>
          <p className="text-base leading-relaxed whitespace-pre-wrap">{message}</p>
        </div>
        {timestamp && (
          <span className="text-xs text-gray-500 px-2">{timestamp}</span>
        )}
      </div>
    </motion.div>
  );
};

export default ChatMessage;
