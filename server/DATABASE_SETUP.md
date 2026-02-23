# LearnLedger Database Setup Guide

This guide will help you set up and populate the Supabase database for LearnLedger's RAG (Retrieval-Augmented Generation) system.

## Prerequisites

- Supabase account and project created
- Node.js installed (v16 or higher)
- Environment variables configured in `server/.env`

## Step 1: Run SQL Setup

1. Log in to your [Supabase Dashboard](https://app.supabase.com/)
2. Navigate to your project
3. Go to the **SQL Editor** (left sidebar)
4. Create a new query
5. Copy and paste the following SQL:

```sql
-- Enable the pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create the documents table
CREATE TABLE IF NOT EXISTS documents (
  id BIGSERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  metadata JSONB,
  embedding VECTOR(768),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index for faster vector similarity search
CREATE INDEX IF NOT EXISTS documents_embedding_idx 
ON documents 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Create a function for vector similarity search
CREATE OR REPLACE FUNCTION match_documents(
  query_embedding VECTOR(768),
  match_threshold FLOAT DEFAULT 0.5,
  match_count INT DEFAULT 3
)
RETURNS TABLE (
  id BIGINT,
  content TEXT,
  metadata JSONB,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    documents.id,
    documents.content,
    documents.metadata,
    1 - (documents.embedding <=> query_embedding) AS similarity
  FROM documents
  WHERE 1 - (documents.embedding <=> query_embedding) > match_threshold
  ORDER BY documents.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
```

6. Click **Run** to execute the SQL
7. Verify success - you should see "Success. No rows returned"

## Step 2: Verify Environment Variables

Make sure your `server/.env` file contains:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
```

To find your Supabase credentials:
1. Go to **Project Settings** → **API**
2. Copy the **Project URL** (SUPABASE_URL)
3. Copy the **anon/public** key (SUPABASE_KEY)

## Step 3: Run the Population Script

From the `server` directory, run:

```bash
node populate-database.js
```

The script will:
- Process 15 comprehensive learning topics
- Generate embeddings for each piece of content
- Insert documents into the Supabase database
- Show progress for each document
- Display a summary at the end

Expected output:
```
🚀 Starting database population...

[1/15] Processing: "What is Blockchain?"
  → Generating embedding...
  → Inserting into database...
  ✅ Success!

...

═══════════════════════════════════════════════════
📊 POPULATION SUMMARY
═══════════════════════════════════════════════════
✅ Successfully inserted: 15 documents
❌ Failed: 0 documents
📚 Total processed: 15 documents

🎉 Database population completed!
```

## Step 4: Verify Data Insertion

### Option 1: Using Supabase Dashboard

1. Go to **Table Editor** in Supabase Dashboard
2. Select the `documents` table
3. You should see 15 rows with content, metadata, and embeddings

### Option 2: Using SQL Query

Run this query in the SQL Editor:

```sql
-- Count total documents
SELECT COUNT(*) as total_documents FROM documents;

-- View all documents with metadata
SELECT 
  id,
  metadata->>'title' as title,
  metadata->>'topic' as topic,
  LEFT(content, 100) as content_preview,
  created_at
FROM documents
ORDER BY id;

-- Check embedding dimensions
SELECT 
  id,
  metadata->>'title' as title,
  array_length(embedding::float[], 1) as embedding_dimension
FROM documents
LIMIT 5;
```

### Option 3: Using Node.js Test Script

Create a test file `server/verify-database.js`:

```javascript
import { supabase } from './supabaseClient.js';

async function verifyDatabase() {
  const { data, error, count } = await supabase
    .from('documents')
    .select('*', { count: 'exact' });

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log(`Total documents: ${count}`);
  console.log('\nSample documents:');
  data.slice(0, 3).forEach(doc => {
    console.log(`- ${doc.metadata.title} (${doc.metadata.topic})`);
  });
}

verifyDatabase();
```

Run: `node verify-database.js`

## Step 5: Test the RAG System

Test that the vector search is working:

```javascript
import { ragPipeline } from './rag.js';

async function testRAG() {
  const query = "What is a smart contract?";
  const { context, documents } = await ragPipeline(query, 0.5, 3);
  
  console.log('Query:', query);
  console.log('\nRetrieved documents:');
  documents.forEach((doc, i) => {
    console.log(`${i + 1}. ${doc.metadata.title} (similarity: ${doc.similarity})`);
  });
}

testRAG();
```

## Querying Documents

### Basic Queries

```sql
-- Search by topic
SELECT metadata->>'title' as title, metadata->>'topic' as topic
FROM documents
WHERE metadata->>'topic' = 'Smart Contracts';

-- Full-text search in content
SELECT metadata->>'title' as title
FROM documents
WHERE content ILIKE '%ethereum%';
```

### Vector Similarity Search

```javascript
import { generateEmbedding } from './rag.js';
import { supabase } from './supabaseClient.js';

async function searchSimilar(query) {
  const embedding = await generateEmbedding(query);
  
  const { data, error } = await supabase.rpc('match_documents', {
    query_embedding: embedding,
    match_threshold: 0.5,
    match_count: 5
  });
  
  return data;
}

// Usage
const results = await searchSimilar("How does blockchain consensus work?");
```

## Troubleshooting

### Error: "relation 'documents' does not exist"
- Make sure you ran the SQL setup in Step 1
- Check that you're connected to the correct Supabase project

### Error: "Failed to generate embedding"
- Verify your GEMINI_API_KEY is correct
- Check your Google AI Studio quota
- Ensure you have internet connectivity

### Error: "permission denied for table documents"
- Check your Supabase RLS (Row Level Security) policies
- For development, you can disable RLS on the documents table:
  ```sql
  ALTER TABLE documents DISABLE ROW LEVEL SECURITY;
  ```

### No documents returned from search
- Check that embeddings were generated (not NULL)
- Try lowering the match_threshold (e.g., 0.3 instead of 0.5)
- Verify the embedding dimension is 768

## Adding More Content

To add more learning content:

1. Edit `populate-database.js`
2. Add new objects to the `learningContent` array:
   ```javascript
   {
     title: "Your Topic Title",
     topic: "Category",
     content: "Detailed content here..."
   }
   ```
3. Run the script again: `node populate-database.js`

## Maintenance

### Clear all documents
```sql
TRUNCATE TABLE documents RESTART IDENTITY;
```

### Update a document
```sql
UPDATE documents
SET content = 'New content',
    metadata = jsonb_set(metadata, '{updated_at}', to_jsonb(NOW()))
WHERE id = 1;
```

### Backup documents
```sql
COPY documents TO '/path/to/backup.csv' CSV HEADER;
```

## Next Steps

- Test the `/api/ask` endpoint with various questions
- Monitor query performance and adjust match_threshold
- Add more specialized content for your use case
- Implement content versioning if needed
- Set up automated backups

## Resources

- [Supabase Vector Documentation](https://supabase.com/docs/guides/ai/vector-columns)
- [pgvector GitHub](https://github.com/pgvector/pgvector)
- [Google Gemini Embeddings](https://ai.google.dev/tutorials/embeddings_quickstart)
