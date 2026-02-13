import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { WalletContextProvider } from './contexts/WalletContext';
import Sovereign from './pages/Sovereign';
import Landing from './pages/landing';
import Profile from './pages/Profile';

export default function App() {
  return (
    <WalletContextProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/app" element={<Sovereign />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Landing />} />
      </Routes>
    </WalletContextProvider>
  );
}
