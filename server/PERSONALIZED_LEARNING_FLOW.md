# Personalized Learning Flow - Implementation Guide

## Overview

The `/api/ask` endpoint now implements a personalized learning flow that adapts based on user progress:

- **NEW users**: Get unrestricted AI answers about any topic
- **EXISTING users**: Only get answers about topics they've completed

## How It Works

### 1. New User Flow (Unrestricted)

A user is considered "new" if:
- No `walletAddress` is provided in the request
- `walletAddress` is provided but user doesn't exist in database
- User exists but has no completed modules (`completed = false` for all progress records)

**Behavior**: Answer ANY question freely using Gemini AI without RAG restrictions.

**Example**:
```javascript
// Request
POST /api/ask
{
  "question": "What is a blockchain?"
  // No walletAddress provided
}

// Response
{
  "answer": "A blockchain is a distributed ledger technology..."
}
```

### 2. Existing User Flow (Restricted)

A user is considered "existing" if:
- `walletAddress` is provided
- User has at least one completed module (`completed = true`)

**Behavior**: 
- Query `user_progress` table for completed topics
- Use RAG to retrieve context ONLY from completed topics
- If question relates to uncompleted topic, return restriction message

**Example - Completed Topic**:
```javascript
// Request
POST /api/ask
{
  "walletAddress": "0xABC123...",
  "question": "What is a blockchain?"
}

// User has completed "Blockchain Basics" module
// Response uses RAG context from that module
{
  "answer": "Based on what you've learned in Blockchain Basics..."
}
```

**Example - Uncompleted Topic**:
```javascript
// Request
POST /api/ask
{
  "walletAddress": "0xABC123...",
  "question": "How do I write a Solana smart contract?"
}

// User has NOT completed "Solana Development" module
// Response
{
  "answer": "I'd love to help you with that! However, you'll need to complete the \"Solana Development\" module first to unlock this topic. Keep learning, you're doing great! 🚀"
}
```

## API Endpoint

### POST `/api/ask`

**Request Body**:
```typescript
{
  question: string;        // Required: The user's question
  walletAddress?: string;  // Optional: User's wallet address
}
```

**Response**:
```typescript
{
  answer: string;  // The AI-generated answer
}
```

**Error Response**:
```typescript
{
  success: false;
  error: string;
}
```

## Implementation Details

### Database Schema

The implementation relies on the `user_progress` table:

```sql
CREATE TABLE user_progress (
  id UUID PRIMARY KEY,
  wallet_address TEXT NOT NULL,
  topic TEXT NOT NULL,
  progress_percentage INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  last_accessed TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(wallet_address, topic)
);
```

### RAG Pipeline Integration

The `ragPipeline` function in `server/rag.js` supports topic filtering:

```javascript
ragPipeline(query, matchThreshold, matchCount, allowedTopics)
```

- `allowedTopics`: Array of topic names to filter documents by
- If `null`, retrieves from all topics
- If provided, only returns documents matching those topics

### Topic Filtering Logic

```javascript
// In rag.js - retrieveDocuments function
if (allowedTopics && allowedTopics.length > 0) {
  documents = documents.filter(doc => {
    const docTopic = doc.metadata?.topic;
    return docTopic && allowedTopics.includes(docTopic);
  });
}
```

## Testing

Run the test script to verify the implementation:

```bash
# Start the server
npm run dev

# In another terminal, run the test
node server/test-personalized-flow.js
```

The test script covers:
1. New user without wallet address
2. New user with wallet but no progress
3. Existing user asking about completed topic
4. Existing user asking about uncompleted topic

## User Experience

### Conversational Tone

The responses are designed to be:
- Friendly and encouraging
- Educational and clear
- Natural, not robotic

**Before** (robotic):
```
"This topic is not covered in your completed modules. Please complete the relevant module first."
```

**After** (conversational):
```
"I'd love to help you with that! However, you'll need to complete the \"Solana Development\" module first to unlock this topic. Keep learning, you're doing great! 🚀"
```

### Progressive Learning

The system encourages users to:
1. Complete modules in sequence
2. Build knowledge progressively
3. Unlock new topics as they learn

## Edge Cases Handled

1. **User doesn't exist**: Treated as new user
2. **Database error**: Gracefully falls back to new user flow
3. **No matching documents**: Checks if question relates to uncompleted topic
4. **Empty completed topics**: Treated as new user
5. **Invalid wallet address**: Treated as new user

## Future Enhancements

Potential improvements:
- Add prerequisite chains (Topic B requires Topic A)
- Implement partial unlocking (answer basic questions about upcoming topics)
- Add "sneak peek" mode for motivation
- Track question history for personalized recommendations
- Add difficulty levels within completed topics

## Security Considerations

- Wallet addresses are validated before database queries
- SQL injection prevented by using parameterized queries (Supabase client)
- No sensitive data exposed in error messages
- Rate limiting should be added for production use

## Performance

- Database queries are indexed on `wallet_address` and `completed`
- RAG pipeline caches embeddings (if implemented)
- Topic filtering happens after vector search for efficiency
- Consider adding Redis cache for frequently accessed user progress

## Monitoring

Key metrics to track:
- New vs existing user ratio
- Questions blocked by topic restrictions
- Most frequently asked questions per topic
- User progression through modules
- Average time between module completions
