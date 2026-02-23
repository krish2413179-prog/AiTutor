# LearnLedger Database Scripts

Quick reference for database setup and management scripts.

## 🚀 Quick Start

```bash
# 1. Populate database with learning content
npm run db:populate

# 2. Verify everything is working
npm run db:verify

# 3. Test with sample queries
npm run db:test
```

## 📋 Available Scripts

### `npm run db:populate`
**File:** `populate-database.js`

Populates the Supabase database with 15 comprehensive learning topics covering:
- Blockchain Fundamentals
- Smart Contracts
- Solana Blockchain
- Web3 Concepts
- DeFi Basics
- NFTs
- Consensus Mechanisms
- Cryptocurrency Wallets
- Ethereum & EVM
- Tokenomics
- DAOs
- Layer 2 Solutions
- Cryptography
- Interoperability
- Security Best Practices

**What it does:**
- Generates embeddings for each content piece using Gemini
- Inserts documents into Supabase with metadata
- Shows progress for each document
- Displays summary with success/error counts

**Expected runtime:** ~30-60 seconds (depending on API response times)

### `npm run db:verify`
**File:** `verify-database.js`

Comprehensive verification of your database setup:
- ✅ Counts total documents
- ✅ Shows sample documents
- ✅ Verifies embeddings are present
- ✅ Tests vector similarity search
- ✅ Analyzes topic distribution

**Use this to:**
- Confirm database is properly set up
- Test that RAG pipeline is working
- Check data quality and coverage

### `npm run test:embedding`
**File:** `test-embedding.js`

Tests the embedding generation functionality:
- Generates embedding for sample text
- Shows embedding dimension and sample values
- Verifies Gemini API connection

### `npm run test:gemini`
**File:** `test-gemini.js`

Tests the Gemini AI chat functionality:
- Sends a test prompt to Gemini
- Displays the response
- Verifies API key and connectivity

### `npm run db:test`
**File:** `test-query.js`

Tests the complete RAG pipeline with sample queries:
- Runs 6 different test queries
- Shows retrieved documents and similarity scores
- Displays context previews
- Helps evaluate retrieval quality

**Use this to:**
- Test end-to-end RAG functionality
- Evaluate document retrieval quality
- See similarity scores for different queries
- Verify the system is working correctly

## 📊 Sample Output

### Populate Database
```
🚀 Starting database population...

[1/15] Processing: "What is Blockchain?"
  → Generating embedding...
  → Inserting into database...
  ✅ Success!

[2/15] Processing: "Understanding Smart Contracts"
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

### Verify Database
```
🔍 Verifying LearnLedger Database Setup

═══════════════════════════════════════════════════

1️⃣  Checking document count...
   ✅ Found 15 documents in database

2️⃣  Fetching sample documents...
   ✅ Sample documents:
      • What is Blockchain? (Blockchain Fundamentals)
      • Understanding Smart Contracts (Smart Contracts)
      • Introduction to Solana Blockchain (Solana)

3️⃣  Checking embeddings...
   ✅ Embeddings present (dimension: 768)

4️⃣  Testing vector similarity search...
   Query: "What is blockchain?"
   ✅ Retrieved 3 relevant documents:
      1. What is Blockchain? (95.2% match)
      2. Blockchain Consensus Mechanisms (78.4% match)
      3. Cryptographic Fundamentals in Blockchain (76.1% match)

5️⃣  Analyzing topic distribution...
   ✅ Topics covered:
      • Blockchain Fundamentals: 1 document
      • Smart Contracts: 1 document
      • Solana: 1 document
      ...

═══════════════════════════════════════════════════
✅ DATABASE VERIFICATION COMPLETE
═══════════════════════════════════════════════════
```

## 🔧 Troubleshooting

### "Missing Supabase credentials"
- Check that `server/.env` has SUPABASE_URL and SUPABASE_KEY
- Verify credentials are correct in Supabase dashboard

### "Failed to generate embedding"
- Verify GEMINI_API_KEY in `.env`
- Check Google AI Studio quota
- Ensure internet connectivity

### "relation 'documents' does not exist"
- Run the SQL setup first (see DATABASE_SETUP.md)
- Verify you're connected to the correct Supabase project

### No documents retrieved in verification
- Lower the match_threshold in ragPipeline (try 0.3)
- Check that embeddings are not NULL
- Verify embedding dimension is 768

## 🔄 Re-populating Database

To clear and re-populate:

```sql
-- In Supabase SQL Editor
TRUNCATE TABLE documents RESTART IDENTITY;
```

Then run:
```bash
npm run db:populate
```

## 📝 Adding Custom Content

Edit `populate-database.js` and add to the `learningContent` array:

```javascript
{
  title: "Your Topic Title",
  topic: "Category Name",
  content: `Detailed explanation of the topic. 
  Include comprehensive information that will be useful 
  for the RAG system to retrieve and provide to users.`
}
```

**Tips for good content:**
- Make it 150-300 words for optimal embedding quality
- Include key terms and concepts
- Write in clear, educational language
- Cover one specific topic per entry
- Use consistent formatting

## 🎯 Best Practices

1. **Initial Setup:** Run populate once to seed the database
2. **Verification:** Always run verify after populating
3. **Testing:** Test with various queries to ensure good retrieval
4. **Monitoring:** Check similarity scores (aim for >0.7 for good matches)
5. **Updates:** When adding content, consider semantic overlap with existing docs

## 📚 Related Documentation

- [DATABASE_SETUP.md](./DATABASE_SETUP.md) - Complete setup guide
- [Supabase Vector Docs](https://supabase.com/docs/guides/ai/vector-columns)
- [Gemini Embeddings](https://ai.google.dev/tutorials/embeddings_quickstart)

## 🆘 Need Help?

1. Check DATABASE_SETUP.md for detailed instructions
2. Run `npm run db:verify` to diagnose issues
3. Review error messages carefully
4. Verify all environment variables are set
5. Check Supabase dashboard for table structure
