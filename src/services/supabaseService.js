import { supabase } from '../config/supabase';

export async function createUserProfile(walletAddress) {
  const { data, error } = await supabase
    .from('profiles')
    .insert([{
      wallet_address: walletAddress,
      level: '1',
      topics_mastered: [],
      xp: 0,
      traits: {}
    }])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getUserProfile(walletAddress) {
  const { data, error} = await supabase
    .from('profiles')
    .select('*')
    .eq('wallet_address', walletAddress)
    .single();
  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function getRecentMessages(walletAddress, limit = 10) {
  const { data, error } = await supabase
    .from('chats')
    .select('*')
    .eq('wallet_address', walletAddress)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data.reverse();
}

export async function saveMessage(walletAddress, role, content, tokens = 0) {
  const { data, error } = await supabase
    .from('chats')
    .insert([{
      wallet_address: walletAddress,
      role,
      content,
      tokens
    }])
    .select()
    .single();
  if (error) throw error;
  
  // Award XP for messages
  if (role === 'user') {
    await updateUserXP(walletAddress, 10); // 10 XP per message
  }
  
  return data;
}

export async function updateUserXP(walletAddress, xpGained) {
  // Get current profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('xp, level')
    .eq('wallet_address', walletAddress)
    .single();
  
  if (!profile) return null;
  
  const newXP = (profile.xp || 0) + xpGained;
  const newLevel = Math.floor(newXP / 1000) + 1; // Level up every 1000 XP
  
  const { data, error } = await supabase
    .from('profiles')
    .update({ 
      xp: newXP,
      level: newLevel.toString()
    })
    .eq('wallet_address', walletAddress)
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

export async function updateMemoryHash(walletAddress, hash) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ 
      current_memory_hash: hash,
      last_anchored_at: new Date().toISOString()
    })
    .eq('wallet_address', walletAddress)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function saveAnchor(walletAddress, hash, signature, messageCount) {
  const { data, error } = await supabase
    .from('anchors')
    .insert([{
      wallet_address: walletAddress,
      memory_hash: hash,
      tx_signature: signature,
      message_count: messageCount,
      anchored_at: new Date().toISOString()
    }])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getAnchors(walletAddress, limit = 10) {
  const { data, error } = await supabase
    .from('anchors')
    .select('*')
    .eq('wallet_address', walletAddress)
    .order('anchored_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data || [];
}

export async function getLatestAnchor(walletAddress) {
  const { data, error } = await supabase
    .from('anchors')
    .select('*')
    .eq('wallet_address', walletAddress)
    .order('anchored_at', { ascending: false })
    .limit(1)
    .single();
  if (error && error.code !== 'PGRST116') throw error;
  return data;
}
