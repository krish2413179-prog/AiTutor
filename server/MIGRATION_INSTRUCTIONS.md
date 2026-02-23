# User Progress Tracking - Database Migration Instructions

## Overview

Task 1 has created the database schema for user progress tracking. The migration file is ready but needs to be executed in Supabase.

## What Was Created

### Migration File
- **Location**: `server/migrations/001_user_progress_tracking.sql`
- **Tables Created**: 3 tables with full schema
- **Constraints**: Foreign keys, CHECK constraints, unique constraints
- **Indexes**: Performance indexes on all tables

### Tables

#### 1. users
Stores user profiles tied to Solana wallet addresses.

**Columns:**
- `wallet_address` (TEXT, PRIMARY KEY) - Solana wallet public key
- `created_at` (TIMESTAMPTZ) - Account creation timestamp
- `last_login` (TIMESTAMPTZ) - Last wallet connection timestamp
- `total_xp` (INTEGER, DEFAULT 0) - Cumulative experience points
- `current_level` (INTEGER, DEFAULT 1) - User level

**Constraints:**
- `total_xp >= 0`
- `current_level >= 1`

**Indexes:**
- `idx_users_level` on `current_level`
- `idx_users_xp` on `total_xp`

#### 2. user_progress
Tracks learning progress per topic for each user.

**Columns:**
- `id` (UUID, PRIMARY KEY) - Unique record identifier
- `wallet_address` (TEXT, FOREIGN KEY) - References users table
- `topic` (TEXT) - Learning topic name
- `progress_percentage` (INTEGER, DEFAULT 0) - Completion percentage (0-100)
- `completed` (BOOLEAN, DEFAULT FALSE) - Whether topic is completed
- `last_accessed` (TIMESTAMPTZ) - Last interaction timestamp

**Constraints:**
- Foreign key to `users(wallet_address)` with CASCADE delete
- `progress_percentage >= 0 AND progress_percentage <= 100`
- Unique constraint on `(wallet_address, topic)`

**Indexes:**
- `idx_user_progress_wallet` on `wallet_address`
- `idx_user_progress_completed` on `completed`
- `idx_user_progress_last_accessed` on `last_accessed`

#### 3. quiz_results
Stores quiz performance history for each user.

**Columns:**
- `id` (UUID, PRIMARY KEY) - Unique record identifier
- `wallet_address` (TEXT, FOREIGN KEY) - References users table
- `topic` (TEXT) - Quiz topic name
- `score` (INTEGER) - Number of correct answers
- `total_questions` (INTEGER) - Total number of questions
- `completed_at` (TIMESTAMPTZ) - Quiz completion timestamp

**Constraints:**
- Foreign key to `users(wallet_address)` with CASCADE delete
- `score >= 0`
- `total_questions > 0`
- `score <= total_questions`

**Indexes:**
- `idx_quiz_results_wallet` on `wallet_address`
- `idx_quiz_results_topic` on `topic`
- `idx_quiz_results_completed_at` on `completed_at`

## How to Run the Migration

### Step 1: Open Supabase Dashboard
Navigate to: https://zaufpronmoljybsmbkps.supabase.co

### Step 2: Go to SQL Editor
1. Click on **SQL Editor** in the left sidebar
2. Click **New Query** button

### Step 3: Copy Migration SQL
1. Open the file: `server/migrations/001_user_progress_tracking.sql`
2. Copy the entire contents (Ctrl+A, Ctrl+C)

### Step 4: Execute Migration
1. Paste the SQL into the Supabase SQL Editor
2. Click **Run** button (or press Ctrl+Enter)
3. Wait for execution to complete

### Step 5: Verify Success
You should see a success message: "User Progress Tracking tables created successfully!"

### Step 6: Verify Tables (Optional)
Run the verification script:
```bash
cd server
node run-migration.js
```

Expected output:
```
✅ All tables verified successfully!

Tables available:
  ✓ users (wallet profiles)
  ✓ user_progress (learning progress tracking)
  ✓ quiz_results (quiz performance history)

🎉 Migration verification complete!
```

## Troubleshooting

### Error: "relation already exists"
The tables are already created. You can skip this migration or drop the tables first:
```sql
DROP TABLE IF EXISTS quiz_results CASCADE;
DROP TABLE IF EXISTS user_progress CASCADE;
DROP TABLE IF EXISTS users CASCADE;
```
Then run the migration again.

### Error: "permission denied"
Make sure you're using the correct Supabase credentials and have admin access to the database.

### Tables not showing in verification
1. Refresh your Supabase dashboard
2. Check the Table Editor to see if tables appear
3. Try running a simple query: `SELECT * FROM users LIMIT 1;`

## Next Steps

After running the migration:
1. ✅ Task 1 is complete
2. Continue with Task 2: Create services directory and implement UserService
3. The backend services will use these tables to store user data

## Security Note

The migration disables Row Level Security (RLS) for development. **In production, you should enable RLS and create appropriate policies.**

To enable RLS later:
```sql
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;
```
