import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Terminal, Bot, User, Sparkles } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import ReactMarkdown from 'react-markdown';
import { getRecentMessages, getUserProfile, getAnchors } from '../services/supabaseService';
import { sendMessageToAI } from '../services/aiService';
import { SaveProgressButton } from './SaveProgressButton';

function ChatBubble({ message, isUser }) {
  // Clean AI responses that might have JSON wrapper
  const cleanContent = (content) => {
    if (!content || isUser) return content;
    
    // Remove JSON wrapper like { "reply": "..." } or { "response": "..." }
    const jsonMatch = content.match(/^\s*\{\s*"(?:reply|response)"\s*:\s*"(.*)"\s*\}\s*$/s);
    if (jsonMatch) {
      // Unescape the content
      return jsonMatch[1]
        .replace(/\\n/g, '\n')
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, '\\');
    }
    
    return content;
  };

  const displayContent = cleanContent(message.content);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
        isUser 
          ? 'bg-gradient-to-br from-[#9945FF] to-[#7d3acc] glow-purple-sm' 
          : 'glass border-[#14F195]/30'
      }`}>
        {isUser ? (
          <User className="w-5 h-5 text-white" />
        ) : (
          <Bot className="w-5 h-5 text-[#14F195]" />
        )}
      </div>

      {/* Message */}
      <div className={`flex-1 max-w-[75%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        <div className={`px-4 py-3 rounded-2xl ${
          isUser
            ? 'bg-gradient-to-br from-[#9945FF]/20 to-[#7d3acc]/20 border border-[#9945FF]/30'
            : 'glass'
        }`}>
          {isUser ? (
            <p className="text-sm text-zinc-100 leading-relaxed">{displayContent}</p>
          ) : (
            <div className="text-sm text-zinc-100 leading-relaxed markdown-content">
              <ReactMarkdown
                components={{
                  h1: ({node, ...props}) => <h1 className="text-xl font-bold text-white mb-3 mt-4" {...props} />,
                  h2: ({node, ...props}) => <h2 className="text-lg font-bold text-white mb-2 mt-3" {...props} />,
                  h3: ({node, ...props}) => <h3 className="text-base font-bold text-white mb-2 mt-2" {...props} />,
                  p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc list-inside mb-2 space-y-1" {...props} />,
                  ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-2 space-y-1" {...props} />,
                  li: ({node, ...props}) => <li className="text-zinc-200" {...props} />,
                  code: ({node, inline, className, children, ...props}) => {
                    const match = /language-(\w+)/.exec(className || '');
                    return inline ? (
                      <code className="bg-zinc-900/50 text-[#14F195] px-1.5 py-0.5 rounded text-xs font-mono" {...props}>
                        {children}
                      </code>
                    ) : (
                      <code className="block bg-zinc-900/80 text-[#14F195] p-3 rounded-lg text-xs font-mono overflow-x-auto my-2 whitespace-pre" {...props}>
                        {children}
                      </code>
                    );
                  },
                  pre: ({node, children, ...props}) => <pre className="my-2 overflow-x-auto" {...props}>{children}</pre>,
                  strong: ({node, ...props}) => <strong className="font-bold text-white" {...props} />,
                  em: ({node, ...props}) => <em className="italic text-zinc-300" {...props} />,
                  a: ({node, ...props}) => <a className="text-[#9945FF] hover:text-[#14F195] underline transition-colors" {...props} />,
                  hr: ({node, ...props}) => <hr className="border-zinc-700 my-3" {...props} />,
                  blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-[#9945FF] pl-4 italic text-zinc-300 my-2" {...props} />,
                }}
              >
                {displayContent}
              </ReactMarkdown>
            </div>
          )}
        </div>
        <span className="text-[10px] text-zinc-600 mono px-2">
          {new Date(message.created_at).toLocaleTimeString()}
        </span>
      </div>
    </motion.div>
  );
}

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-3"
    >
      <div className="w-10 h-10 rounded-xl glass border-[#14F195]/30 flex items-center justify-center">
        <Bot className="w-5 h-5 text-[#14F195]" />
      </div>
      <div className="glass px-5 py-3 rounded-2xl flex items-center gap-2">
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-[#14F195] rounded-full typing-dot" />
          <div className="w-2 h-2 bg-[#14F195] rounded-full typing-dot" />
          <div className="w-2 h-2 bg-[#14F195] rounded-full typing-dot" />
        </div>
        <span className="text-xs text-zinc-500 mono">Processing...</span>
      </div>
    </motion.div>
  );
}

export function RightPanel() {
  const { publicKey } = useWallet();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [anchors, setAnchors] = useState([]);
  const messagesEndRef = useRef(null);
  const lastMessageCountRef = useRef(0);

  useEffect(() => {
    if (publicKey) {
      loadMessages();
      loadProfile();
      loadAnchors();
    }
  }, [publicKey]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const loadProfile = async () => {
    try {
      const profile = await getUserProfile(publicKey.toString());
      setUserProfile(profile);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const loadAnchors = async () => {
    try {
      const anchorList = await getAnchors(publicKey.toString(), 100);
      setAnchors(anchorList);
    } catch (error) {
      console.error('Error loading anchors:', error);
    }
  };

  const loadMessages = async () => {
    try {
      const recentMessages = await getRecentMessages(publicKey.toString());
      
      // Only update if message count changed to prevent duplicate renders
      if (recentMessages.length !== lastMessageCountRef.current) {
        setMessages(recentMessages);
        lastMessageCountRef.current = recentMessages.length;
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !publicKey || loading) return;
    const userMessage = input;
    setInput('');
    setLoading(true);

  
    const tempUserMsg = {
      role: 'user',
      content: userMessage,
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempUserMsg]);

    try {
      const systemPrompt = `You are Sovereign, an advanced AI tutor that helps users learn anything they want to master.

Your capabilities:
- Teach any subject: programming, mathematics, science, languages, business, arts, and more
- Adapt to the user's learning style and pace
- Provide clear explanations with examples
- Break down complex topics into digestible parts
- Offer practice exercises and real-world applications
- Track progress and suggest next steps

Special features:
- User's learning progress is tracked with XP and levels
- Progress can be minted as NFTs on Solana blockchain
- Achievements unlock as users reach milestones
- Learning credentials are transferable between platforms

Your teaching style:
- Clear and concise explanations
- Use analogies and examples
- Encourage questions and curiosity
- Provide actionable next steps
- Celebrate progress and achievements

Remember: You're not just a Solana tutor - you can teach anything the user wants to learn!`;
      
      const result = await sendMessageToAI(publicKey.toString(), userMessage, systemPrompt);
      
      // Add AI response to UI
      const aiMsg = {
        role: 'assistant',
        content: result.response,
        created_at: new Date().toISOString()
      };
      setMessages(prev => [...prev, aiMsg]);
      lastMessageCountRef.current = messages.length + 2; // user + ai message
      
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Show user-friendly error message
      let errorMessage = 'Error: Unable to process your request.';
      
      if (error.message.includes('webhook URL not configured')) {
        errorMessage = '⚠️ Make.com webhook not configured. Add VITE_MAKE_WEBHOOK_URL to your .env file and restart the server.';
      } else if (error.message.includes('Invalid JSON')) {
        errorMessage = '⚠️ Webhook returned invalid response. Check your Make.com scenario output format.';
      } else if (error.message.includes('missing "response" field')) {
        errorMessage = '⚠️ Webhook response format incorrect. Ensure your Make.com scenario returns {"response": "text"}.';
      }
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: errorMessage,
        created_at: new Date().toISOString()
      }]);
    } finally {
      setLoading(false);
    }
  };

  if (!publicKey) {
    return (
      <div className="w-full h-full glass-strong rounded-2xl flex items-center justify-center">
        <div className="text-center p-8 space-y-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#9945FF] to-[#14F195] flex items-center justify-center mx-auto glow-purple"
          >
            <Terminal className="w-10 h-10 text-white" />
          </motion.div>
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">Connect Your Wallet</h3>
            <p className="text-sm text-zinc-500 mono">Start chatting with Sovereign AI</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full glass-strong rounded-2xl flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-zinc-800/50 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#14F195] to-[#0ec77a] flex items-center justify-center">
              <Terminal className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Sovereign AI Tutor</h2>
              <p className="text-[10px] text-zinc-500 mono">Learn anything - Your progress lives on-chain</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Save Progress Button */}
            {messages.length > 0 && (
              <SaveProgressButton 
                messages={messages} 
                userProfile={userProfile}
                anchors={anchors}
              />
            )}
          </div>
        </div>
      </div>

      {/* Messages - Takes all available space */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 space-y-4"
          >
            <Sparkles className="w-16 h-16 text-[#9945FF] mx-auto" />
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Start Learning</h3>
              <p className="text-sm text-zinc-500">Ask me anything - from coding to math, science to languages!</p>
            </div>
          </motion.div>
        )}
        
        <AnimatePresence mode="popLayout">
          {messages.map((msg, i) => (
            <ChatBubble key={i} message={msg} isUser={msg.role === 'user'} />
          ))}
        </AnimatePresence>
        
        {loading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input - Fixed at bottom */}
      <div className="p-4 border-t border-zinc-800/50 flex-shrink-0">
        <div className="flex items-end gap-3">
          <div className="flex-1 glass rounded-2xl px-4 py-3 focus-within:border-[#9945FF]/50 transition-all">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[#14F195] mono text-xs font-bold">{'>'}</span>
              <span className="text-xs text-zinc-600 mono">Type your message...</span>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask me anything..."
              disabled={loading}
              rows={1}
              className="w-full bg-transparent outline-none text-sm text-white placeholder-zinc-600 resize-none max-h-32"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="btn-primary w-12 h-12 rounded-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-5 h-5 spinner" />
            ) : (
              <Send className="w-5 h-5 text-white" />
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
