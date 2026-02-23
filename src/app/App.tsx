import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WalletProvider from './providers/WalletProvider';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import DashboardPreview from './components/DashboardPreview';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import AskAI from './pages/AskAI';
import Quiz from './pages/Quiz';
import Module from './pages/Module';

function LandingPage() {
  return (
    <>
      <Hero />
      <Features />
      <DashboardPreview />
      <Footer />
    </>
  );
}

function App() {
  useEffect(() => {
    console.log('[App] Component mounted');
    console.log('[App] All components loaded:', {
      Navbar: !!Navbar,
      Hero: !!Hero,
      Features: !!Features,
      DashboardPreview: !!DashboardPreview,
      Footer: !!Footer,
    });
  }, []);

  console.log('[App] Rendering App component');

  return (
    <WalletProvider>
      <Router>
        <div className="bg-[#0f0f0f] min-h-screen w-full text-white font-sans selection:bg-[#14F195] selection:text-black">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/ask-ai" element={<AskAI />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/module" element={<Module />} />
            </Routes>
          </main>
        </div>
      </Router>
    </WalletProvider>
  );
}

export default App;
