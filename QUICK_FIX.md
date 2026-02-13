# Quick Fix - Use Your Existing Supabase Schema

## ✅ Good News!
You already have a `chats` table! I've updated the code to use your existing schema.

## What I Changed:
- ✅ Updated code to use `chats` table (instead of `messages`)
- ✅ Updated code to use `profiles` table (instead of `users`)
- ✅ Matched your schema with `tokens` field

## Your Existing Schema:
```sql
public.chats (
  id bigint,
  created_at timestamp,
  wallet_address text → references profiles,
  role text → 'user', 'assistant', 'system',
  content text,
  tokens int
)
```

## Quick Check: Do You Have a `profiles` Table?

### Option 1: Check in Supabase
1. Go to https://supabase.com/dashboard
2. Click **Table Editor**
3. Look for a table called `profiles`

### Option 2: Run This SQL to Create It (if missing)

If you DON'T see `profiles` table, run this in SQL Editor:

```sql
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address TEXT UNIQUE NOT NULL,
  system_prompt TEXT DEFAULT 'You are Sovereign, a personalized AI tutor.',
  level TEXT DEFAULT 'Beginner',
  topics_mastered TEXT[] DEFAULT '{}',
  last_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX profiles_wallet_address_idx ON public.profiles (wallet_address);
```

## Test It Now!

1. **Refresh your browser** at http://localhost:5173/
2. Your wallet should reconnect automatically
3. **Click "MINT YOUR AI SOUL"** 
4. Check Supabase Table Editor - you should see:
   - New row in `profiles` table with your wallet address
5. **Type a message in chat**
6. Check Supabase - you should see:
   - New row in `chats` table with your message

## Current Status:

✅ App is running  
✅ Wallet connected (27sh...nqA3)  
✅ UI working perfectly  
✅ `chats` table exists  
⏳ `profiles` table (check/create above)  
⏳ Make.com webhook (for AI responses)

## What Happens Without Make.com Webhook?

- ✅ You can connect wallet
- ✅ You can create profile
- ✅ You can send messages (saved to database)
- ❌ AI won't respond (needs webhook)

The app will show: "Error: Unable to process your request"

## To Enable AI Responses:

Add to your `.env` file:
```env
VITE_MAKE_WEBHOOK_URL=your_make_webhook_url
```

Then restart: `npm run dev`

---

Your existing database structure is perfect! Just need to ensure `profiles` table exists. 🚀
