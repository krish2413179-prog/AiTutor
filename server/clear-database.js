import { supabase } from './supabaseClient.js';

/**
 * Database Cleanup Script
 * Clears all data from LearnLedger database tables
 * Tables are cleared in order to respect foreign key constraints
 */

async function clearDatabase() {
  console.log('🧹 Starting database cleanup...\n');

  let totalDeleted = 0;

  try {
    // Clear quiz_results first (has foreign key to users)
    console.log('Clearing quiz_results table...');
    const { data: quizData, error: quizError } = await supabase
      .from('quiz_results')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records

    if (quizError) {
      console.error('❌ Error clearing quiz_results:', quizError.message);
    } else {
      const quizCount = quizData?.length || 0;
      totalDeleted += quizCount;
      console.log(`✅ Cleared ${quizCount} records from quiz_results\n`);
    }

    // Clear user_progress (has foreign key to users)
    console.log('Clearing user_progress table...');
    const { data: progressData, error: progressError } = await supabase
      .from('user_progress')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records

    if (progressError) {
      console.error('❌ Error clearing user_progress:', progressError.message);
    } else {
      const progressCount = progressData?.length || 0;
      totalDeleted += progressCount;
      console.log(`✅ Cleared ${progressCount} records from user_progress\n`);
    }

    // Clear users table
    console.log('Clearing users table...');
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .delete()
      .neq('wallet_address', 'dummy'); // Delete all records

    if (usersError) {
      console.error('❌ Error clearing users:', usersError.message);
    } else {
      const usersCount = usersData?.length || 0;
      totalDeleted += usersCount;
      console.log(`✅ Cleared ${usersCount} records from users\n`);
    }

    // Clear documents table (no foreign key dependencies)
    console.log('Clearing documents table...');
    const { data: docsData, error: docsError } = await supabase
      .from('documents')
      .delete()
      .neq('id', 0); // Delete all records

    if (docsError) {
      console.error('❌ Error clearing documents:', docsError.message);
    } else {
      const docsCount = docsData?.length || 0;
      totalDeleted += docsCount;
      console.log(`✅ Cleared ${docsCount} records from documents\n`);
    }

    console.log('═══════════════════════════════════════');
    console.log(`🎉 Database cleanup complete!`);
    console.log(`📊 Total records deleted: ${totalDeleted}`);
    console.log('═══════════════════════════════════════\n');

  } catch (error) {
    console.error('❌ Unexpected error during cleanup:', error);
    process.exit(1);
  }
}

// Run the cleanup
clearDatabase()
  .then(() => {
    console.log('✨ All done! Database is now clean.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });
