# Database Migration Guide: User Progress Tracking

## Overview
This guide will walk you through creating the database tables needed for the user progress tracking system.

## Prerequisites
- Access to your Supabase Dashboard
- The migration SQL file: `server/migrations/001_user_progress_tracking.sql`

## Step-by-Step Instructions

### Step 1: Open Supabase Dashboard
1. Go to: https://zaufpronmoljybsmbkps.supabase.co
2. Log in with your credentials

### Step 2: Navigate to SQL Editor
1. In the left sidebar, click on **"SQL Editor"**
2. Click **"New query"** button (top right)

### Step 3: Copy the Migration SQL
1. Open the file: `server/migrations/001_user_progress_tracking.sql`
2. Copy the entire contents of the file (Ctrl+A, Ctrl+C)

### Step 4: Paste and Execute
1. Paste the SQL into the SQL Editor in Supabase
2. Click the **"Run"** button (or press Ctrl+Enter)
3. Wait for the execution to complete

### Step 5: Verify Success
You should see a success message indicating:
- 3 tables created: `users`, `user_progress`, `quiz_results`
- Multiple indexes created for performance
- Constraints and foreign keys established

### Step 6: Verify Tables Exist
After running the migration, you can verify the tables were created:

**Option A: Using the Supabase Dashboard**
1. Go to **"Table Editor"** in the left sidebar
2. You should see three new tables:
   - `users`
   - `user_progress`
   - `quiz_results`

**Option B: Using the verification script**
Run this command in your terminal:
```bash
cd server
node run-migration.js
```

You should see:
```
✅ All tables verified successfully!

Tables available:
  ✓ users (wallet profiles)
  ✓ user_progress (learning progress tracking)
  ✓ quiz_results (quiz performance history)

🎉 Migration verification complete!
```

## What Gets Created

### 1. Users Table
Stores user profiles tied to Solana wallet addresses.

**Columns:**
- `wallet_address` (TEXT, PRIMARY KEY) - Solana wallet public key
- `created_at` (TIMESTAMPTZ) - Account creation timestamp
- `last_login` (TIMESTAMPTZ) - Last wallet connection timestamp
- `total_xp` (INTEGER) - Cumulative experience points
- `current_level` (INTEGER) - User level (calculated from XP)

### 2. User_Progress Table
Tracks learning progress per topic for each user.

**Columns:**
- `id` (UUID, PRIMARY KEY) - Unique record identifier
- `wallet_address` (TEXT, FOREIGN KEY) - References users table
- `topic` (TEXT) - Learning topic name
- `progress_percentage` (INTEGER) - Completion percentage (0-100)
- `completed` (BOOLEAN) - Whether topic is completed
- `last_accessed` (TIMESTAMPTZ) - Last interaction timestamp

### 3. Quiz_Results Table
Stores quiz performance history for each user.

**Columns:**
- `id` (UUID, PRIMARY KEY) - Unique record identifier
- `wallet_address` (TEXT, FOREIGN KEY) - References users table
- `topic` (TEXT) - Quiz topic name
- `score` (INTEGER) - Number of correct answers
- `total_questions` (INTEGER) - Total number of questions
- `completed_at` (TIMESTAMPTZ) - Quiz completion timestamp

## Troubleshooting

### Error: "relation already exists"
This means the tables are already created. You can skip the migration or drop the existing tables first.

### Error: "permission denied"
Make sure you're logged in with an account that has database admin permissions.

### Error: "syntax error"
Make sure you copied the entire SQL file contents without any modifications.

## Next Steps

After successfully running the migration:

1. **Verify the migration:**
   ```bash
   cd server
   node run-migration.js
   ```

2. **Run the end-to-end test:**
   ```bash
   cd server
   node test-e2e-user-flow.js
   ```

3. **Test the API endpoints:**
   - Start your server: `npm start` (or `node index.js`)
   - Use the test scripts in the `server/` directory to test individual endpoints

## Support

If you encounter any issues:
1. Check the Supabase logs in the Dashboard
2. Verify your database connection in `server/.env`
3. Ensure the Supabase client is properly configured in `server/supabaseClient.js`
