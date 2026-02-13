import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { Header } from '../components/Header';
import { RightPanel } from '../components/RightPanel';
import { getUserProfile, createUserProfile } from '../services/supabaseService';
import { motion } from 'framer-motion';
import { Sparkles, Cpu, ShieldCheck, Zap, Lock, Terminal } from 'lucide-react';

export default function Sovereign() {
  const { publicKey } = useWallet();
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [viewState, setViewState] = useState('IDLE'); // IDLE, MINTING, DASHBOARD

  // 1. Handle Connection Logic
  useEffect(() => {
    if (!publicKey) {
      setViewState('IDLE');
      setUserProfile(null);
      return;
    }

    const initUser = async () => {
      setLoading(true);
      try {
        const profile = await getUserProfile(publicKey.toString());
        if (profile) {
          setUserProfile(profile);
          setViewState('DASHBOARD');
        } else {
          setViewState('MINTING');
        }
      } catch (err) {
        console.error("Auth Error:", err);
        setViewState('MINTING'); // Fallback to minting on error
      } finally {
        setLoading(false);
      }
    };

    initUser();
  }, [publicKey]);

  // 2. Handle Minting (Genesis)
  const handleMintNFT = async () => {
    setLoading(true);
    try {
      const walletAddress = publicKey.toString();
      
      // Attempt to create or fetch profile
      let profile;
      try {
        profile = await createUserProfile(walletAddress);
      } catch (error) {
        if (error.code === '23505') { // Duplicate key
          profile = await getUserProfile(walletAddress);
        } else {
          throw error;
        }
      }

      setUserProfile(profile);
      // Artificial delay for cinematic effect
      setTimeout(() => setViewState('DASHBOARD'), 1500);
      
    } catch (error) {
      console.error('Mint Error:', error);
      alert('Initialization Failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // --- RENDER STATES ---

  // State A: IDLE (Wallet Not Connected)
  if (!publicKey) {
    return (
      <div className="relative w-screen h-screen bg-black overflow-hidden flex flex-col items-center justify-center text-white font-mono selection:bg-green-500/30">
        <div className="absolute inset-0 z-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_black_100%)] pointer-events-none"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="z-10 flex flex-col items-center gap-8 max-w-md text-center p-8 border border-white/10 bg-black/50 backdrop-blur-md rounded-2xl shadow-[0_0_50px_-12px_rgba(147,51,234,0.3)]"
        >
          <div className="relative">
            <div className="absolute -inset-4 bg-purple-500/20 blur-xl rounded-full animate-pulse"></div>
            <Cpu size={64} className="text-white relative z-10" />
          </div>

          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500">
              SYSTEM_OFFLINE
            </h1>
            <p className="text-sm text-gray-400 leading-relaxed">
              Neural Interface disconnected. Please establish a secure wallet connection to access the Sovereign Network.
            </p>
          </div>

          <div className="w-full">
            <WalletMultiButton className="!bg-white !text-black !font-bold !w-full !justify-center !rounded-lg !h-12 hover:!scale-105 transition-all" />
          </div>

          <div className="flex gap-4 text-[10px] text-gray-600 uppercase tracking-widest">
            <span className="flex items-center gap-1"><Lock size={10}/> End-to-End Encrypted</span>
            <span className="flex items-center gap-1"><ShieldCheck size={10}/> Solana Secured</span>
          </div>
        </motion.div>
      </div>
    );
  }

  // State B: MINTING (Genesis Protocol)
  if (viewState === 'MINTING') {
    return (
      <div className="relative w-screen h-screen bg-[#050505] overflow-hidden flex items-center justify-center font-mono">
        <AnimatedBackground />
        
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative z-10 w-full max-w-2xl p-1"
        >
          {/* Glowing Border */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-green-500 to-purple-500 opacity-20 blur-xl rounded-3xl animate-pulse"></div>
          
          <div className="relative bg-black border border-white/10 rounded-2xl p-8 md:p-12 overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

            <div className="relative z-10 space-y-8">
              {/* Header */}
              <div className="text-center space-y-2">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 mx-auto bg-gradient-to-tr from-purple-900 to-black rounded-full flex items-center justify-center border border-white/20 mb-6"
                >
                  <Sparkles className="text-purple-400" size={24} />
                </motion.div>
                <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">INITIALIZE PROFILE</h2>
                <p className="text-gray-400 text-sm">Create your learning profile to begin your journey.</p>
              </div>

              {/* Feature Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { icon: <Terminal size={18}/>, label: "Universal AI", text: "Learn Anything" },
                  { icon: <ShieldCheck size={18}/>, label: "On-Chain", text: "NFT Progress" },
                  { icon: <Zap size={18}/>, label: "Transferable", text: "Use Anywhere" },
                ].map((item, i) => (
                  <div key={i} className="bg-white/5 border border-white/5 p-4 rounded-xl flex flex-col items-center text-center gap-2 hover:bg-white/10 transition-colors cursor-default">
                    <div className="text-purple-400">{item.icon}</div>
                    <div className="text-white font-bold text-sm">{item.label}</div>
                    <div className="text-xs text-gray-500">{item.text}</div>
                  </div>
                ))}
              </div>

              {/* Action Area */}
              <div className="pt-4">
                <button
                  onClick={handleMintNFT}
                  disabled={loading}
                  className="group relative w-full overflow-hidden rounded-xl bg-white text-black font-bold h-14 text-lg shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                        <span>ESTABLISHING UPLINK...</span>
                      </>
                    ) : (
                      <>
                        <Cpu className="group-hover:rotate-180 transition-transform duration-500" />
                        <span>CREATE PROFILE (FREE)</span>
                      </>
                    )}
                  </span>
                  {/* Button Hover Shine */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-12"></div>
                </button>
                <p className="text-center text-[10px] text-gray-600 mt-4 font-mono">
                  FREE PROFILE CREATION • NETWORK: SOLANA DEVNET
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // State C: DASHBOARD (Main App)
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#050505] text-white">
      {/* Dynamic Background */}
      <AnimatedBackground />
      
      {/* Minimal Top Header */}
      <Header />

      {/* Fullscreen Chat Container */}
      <main className="relative z-10 h-screen pt-16 pb-4 px-4">
        <div className="w-full h-full max-w-6xl mx-auto">
          <RightPanel />
        </div>
      </main>
    </div>
  );
}