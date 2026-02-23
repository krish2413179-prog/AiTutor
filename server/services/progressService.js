import { supabase } from '../supabaseClient.js';

/**
 * Update or create progress record for a topic
 * @param {string} walletAddress - Solana wallet public key
 * @param {string} topic - Learning topic name
 * @param {number} progressPercentage - Completion percentage (0-100)
 * @returns {Promise<Object>} Updated progress record
 */
export async function updateProgress(walletAddress, topic, progressPercentage) {
  try {
    // Validate progress percentage
    if (progressPercentage < 0 || progressPercentage > 100) {
      throw new Error('Progress percentage must be between 0 and 100');
    }

    const completed = progressPercentage === 100;

    // Upsert progress record
    const { data, error } = await supabase
      .from('user_progress')
      .upsert({
        wallet_address: walletAddress,
        topic: topic,
        progress_percentage: progressPercentage,
        completed: completed,
        last_accessed: new Date().toISOString()
      }, {
        onConflict: 'wallet_address,topic'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error in updateProgress:', error);
    throw error;
  }
}

/**
 * Retrieve all progress records for a user
 * @param {string} walletAddress - Solana wallet public key
 * @returns {Promise<Array>} List of progress records
 */
export async function getUserProgress(walletAddress) {
  try {
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('wallet_address', walletAddress)
      .order('last_accessed', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error in getUserProgress:', error);
    throw error;
  }
}
