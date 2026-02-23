import { supabase } from '../supabaseClient.js';

/**
 * Initialize or update user profile on wallet connection
 * @param {string} walletAddress - Solana wallet public key
 * @returns {Promise<Object>} User profile data
 */
export async function initializeUser(walletAddress) {
  try {
    // Check if user exists
    const { data: existingUser, error: selectError } = await supabase
      .from('users')
      .select('*')
      .eq('wallet_address', walletAddress)
      .single();

    if (selectError && selectError.code !== 'PGRST116') {
      // PGRST116 is "not found" error, which is expected for new users
      throw selectError;
    }

    if (existingUser) {
      // Update last_login
      const { data, error } = await supabase
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('wallet_address', walletAddress)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } else {
      // Create new user
      const { data, error } = await supabase
        .from('users')
        .insert({
          wallet_address: walletAddress,
          total_xp: 0,
          current_level: 1
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }
  } catch (error) {
    console.error('Error in initializeUser:', error);
    throw error;
  }
}

/**
 * Retrieve user profile with aggregated statistics
 * @param {string} walletAddress - Solana wallet public key
 * @returns {Promise<Object>} User profile with stats
 */
export async function getUserProfile(walletAddress) {
  try {
    // Get user data
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('wallet_address', walletAddress)
      .single();
    
    if (userError) throw userError;

    // Get completed topics count
    const { count: completedCount } = await supabase
      .from('user_progress')
      .select('*', { count: 'exact', head: true })
      .eq('wallet_address', walletAddress)
      .eq('completed', true);

    // Get recent quiz results (last 5)
    const { data: recentQuizzes } = await supabase
      .from('quiz_results')
      .select('*')
      .eq('wallet_address', walletAddress)
      .order('completed_at', { ascending: false })
      .limit(5);

    return {
      ...user,
      completed_topics: completedCount || 0,
      recent_quizzes: recentQuizzes || []
    };
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    throw error;
  }
}
