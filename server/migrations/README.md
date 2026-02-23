# Database Migrations

This directory contains SQL migration files for the LearnLedger database.

## Running Migrations

### Migration 001: User Progress Tracking

This migration creates three tables for user state management:
- `users` - User profiles tied to Solana wallet addresses
- `user_progress` - Learning progress tracking per topic
- `quiz_results` - Quiz performance history

**To run this migration:**

1. Open your Supabase Dashboard: https://zaufpronmoljybsmbkps.supabase.co
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the entire contents of `001_user_progress_tracking.sql`
5. Paste into the SQL Editor
6. Click **Run** (or press Ctrl+Enter)
7. Verify success message appears

**To verify the migration:**

Run the verification script:
```bash
cd server
node run-migration.js
```

This will check if all tables were created successfully.

## Migration Files

- `001_user_progress_tracking.sql` - Initial user progress tracking schema
