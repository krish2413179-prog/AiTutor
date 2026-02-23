import { supabase } from '../supabaseClient.js';

/**
 * Save quiz result, award XP, update level, and mark topic completion
 * @param {string} walletAddress - Solana wallet public key
 * @param {string} topic - Quiz topic name
 * @param {number} score - Number of correct answers
 * @param {number} totalQuestions - Total number of questions
 * @returns {Promise<Object>} Quiz result with XP and level updates
 */
export async function saveQuizResult(walletAddress, topic, score, totalQuestions) {
  try {
    // Validate inputs
    if (score > totalQuestions) {
      throw new Error('Score cannot exceed total questions');
    }

    if (score < 0) {
      throw new Error('Score cannot be negative');
    }

    if (totalQuestions <= 0) {
      throw new Error('Total questions must be positive');
    }

    // Save quiz result
    const { data: quizResult, error: quizError } = await supabase
      .from('quiz_results')
      .insert({
        wallet_address: walletAddress,
        topic: topic,
        score: score,
        total_questions: totalQuestions,
        completed_at: new Date().toISOString()
      })
      .select()
      .single();

    if (quizError) throw quizError;

    // Calculate XP (10 per correct answer)
    const xpAwarded = score * 10;

    // Get current user data
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('total_xp')
      .eq('wallet_address', walletAddress)
      .single();

    if (userError) throw userError;

    // Calculate new XP and level
    const newTotalXp = user.total_xp + xpAwarded;
    const newLevel = Math.floor(newTotalXp / 100) + 1;

    // Update user XP and level
    const { error: updateError } = await supabase
      .from('users')
      .update({
        total_xp: newTotalXp,
        current_level: newLevel
      })
      .eq('wallet_address', walletAddress);

    if (updateError) throw updateError;

    // Check if quiz passed (70% threshold)
    const percentage = (score / totalQuestions) * 100;
    const passed = percentage >= 70;

    if (passed) {
      // Mark topic as completed
      await supabase
        .from('user_progress')
        .upsert({
          wallet_address: walletAddress,
          topic: topic,
          progress_percentage: 100,
          completed: true,
          last_accessed: new Date().toISOString()
        }, {
          onConflict: 'wallet_address,topic'
        });
    }

    return {
      quiz_result: quizResult,
      xp_awarded: xpAwarded,
      new_total_xp: newTotalXp,
      new_level: newLevel,
      passed: passed
    };
  } catch (error) {
    console.error('Error in saveQuizResult:', error);
    throw error;
  }
}
