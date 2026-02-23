import { supabase } from './supabaseClient.js';

async function runMigration() {
  console.log('🚀 Starting User Progress Tracking migration...\n');

  try {
    // Verify tables were created by attempting to query them
    console.log('Verifying tables...');
    
    const { error: usersError } = await supabase
      .from('users')
      .select('wallet_address')
      .limit(0);
    
    const { error: progressError } = await supabase
      .from('user_progress')
      .select('id')
      .limit(0);
    
    const { error: quizError } = await supabase
      .from('quiz_results')
      .select('id')
      .limit(0);

    if (!usersError && !progressError && !quizError) {
      console.log('✅ All tables verified successfully!');
      console.log('\nTables available:');
      console.log('  ✓ users (wallet profiles)');
      console.log('  ✓ user_progress (learning progress tracking)');
      console.log('  ✓ quiz_results (quiz performance history)');
      console.log('\n🎉 Migration verification complete!');
    } else {
      console.log('⚠️  Tables not found. Manual migration required.\n');
      console.log('📝 To run the migration:');
      console.log('1. Open Supabase Dashboard: https://zaufpronmoljybsmbkps.supabase.co');
      console.log('2. Go to SQL Editor');
      console.log('3. Copy and paste the contents of: server/migrations/001_user_progress_tracking.sql');
      console.log('4. Click "Run" to execute the migration');
      console.log('5. Run this script again to verify\n');
      
      if (usersError) console.log('  ❌ users table:', usersError.message);
      if (progressError) console.log('  ❌ user_progress table:', progressError.message);
      if (quizError) console.log('  ❌ quiz_results table:', quizError.message);
      
      process.exit(1);
    }

  } catch (error) {
    console.error('❌ Migration verification failed:', error.message);
    console.log('\n📝 Manual migration required:');
    console.log('1. Open Supabase Dashboard: https://zaufpronmoljybsmbkps.supabase.co');
    console.log('2. Go to SQL Editor');
    console.log('3. Copy and paste the contents of: server/migrations/001_user_progress_tracking.sql');
    console.log('4. Click "Run" to execute the migration');
    process.exit(1);
  }
}

runMigration();
