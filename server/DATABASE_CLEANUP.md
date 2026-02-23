# Database Cleanup Guide

## Overview
This guide explains how to clear all data from the LearnLedger database using the cleanup script.

## Cleanup Script

The `clear-database.js` script removes all data from the following tables in the correct order to respect foreign key constraints:

1. **quiz_results** - User quiz performance history
2. **user_progress** - Learning progress tracking
3. **users** - User profiles
4. **documents** - RAG knowledge base documents

## Usage

### Run the cleanup script:

```bash
cd server
npm run db:clear
```

### What happens:
- The script connects to your Supabase database
- Clears all records from each table in the correct order
- Displays confirmation messages for each table
- Shows the total number of records deleted

### Example output:

```
🧹 Starting database cleanup...

Clearing quiz_results table...
✅ Cleared 15 records from quiz_results

Clearing user_progress table...
✅ Cleared 8 records from user_progress

Clearing users table...
✅ Cleared 3 records from users

Clearing documents table...
✅ Cleared 42 records from documents

═══════════════════════════════════════
🎉 Database cleanup complete!
📊 Total records deleted: 68
═══════════════════════════════════════

✨ All done! Database is now clean.
```

## When to use

- **Development**: Clear test data between development cycles
- **Testing**: Reset database to a clean state before testing
- **Production**: Remove all data before deploying to a new environment (use with caution!)

## Safety Notes

⚠️ **WARNING**: This operation is irreversible! All data will be permanently deleted.

- Always backup your database before running cleanup in production
- The script respects foreign key constraints by deleting in the correct order
- Row Level Security (RLS) is disabled in development mode for easier testing

## Repopulating Data

After cleanup, you can repopulate the documents table with:

```bash
npm run db:populate
```

This will reload the RAG knowledge base from the source documents.

## Troubleshooting

### Error: "Missing Supabase credentials"
- Check that your `.env` file contains valid `SUPABASE_URL` and `SUPABASE_KEY`

### Error: "Permission denied"
- Verify that your Supabase key has the necessary permissions
- Check that RLS policies allow deletion (should be disabled in development)

### Script hangs or times out
- Check your internet connection
- Verify Supabase service is accessible
- Check for any database locks or long-running queries

## Related Scripts

- `npm run db:populate` - Populate documents table with knowledge base
- `npm run db:verify` - Verify database setup and connection
- `npm run db:test` - Test database queries
