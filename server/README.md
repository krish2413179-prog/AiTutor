# LearnLedger RAG Backend

Production-ready RAG (Retrieval-Augmented Generation) backend for LearnLedger using Supabase and Gemini AI.

## Features

- **Vector Search**: Semantic document retrieval using pgvector
- **Gemini AI**: Embedding generation and text generation
- **RESTful API**: Three endpoints for Q&A, quiz generation, and answer evaluation
- **Production-Ready**: Comprehensive error handling and validation

## Setup

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Required variables:
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_KEY`: Your Supabase anon/service key
- `GEMINI_API_KEY`: Your Google Gemini API key
- `PORT`: Server port (default: 3001)

### 3. Setup Supabase Database

Run the SQL commands in `supabase-setup.sql` in your Supabase SQL Editor to:
- Enable pgvector extension
- Create documents table with vector column
- Create match_documents RPC function

### 4. Start Server

```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## API Endpoints

### POST /api/ask
Answer questions based on retrieved context.

**Request:**
```json
{
  "question": "What is machine learning?"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "answer": "Machine learning is..."
  }
}
```

### POST /api/quiz
Generate quiz questions for a topic.

**Request:**
```json
{
  "topic": "Neural Networks"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "questions": [
      {
        "question": "What is a neural network?",
        "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
        "correctAnswer": "A"
      }
    ]
  }
}
```

### POST /api/evaluate
Evaluate student answers.

**Request:**
```json
{
  "question": "Explain backpropagation",
  "studentAnswer": "Backpropagation is..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "score": 85,
    "passed": true,
    "feedback": "Good explanation..."
  }
}
```

## Architecture

- **index.js**: Express server setup with middleware
- **routes.js**: API route handlers
- **rag.js**: RAG pipeline logic (embedding, retrieval, context building)
- **geminiClient.js**: Gemini API client configuration
- **supabaseClient.js**: Supabase client configuration

## Error Handling

All endpoints include comprehensive error handling:
- Input validation
- Database error handling
- AI model error handling
- Graceful fallbacks

## Notes

- All responses are restricted to retrieved context only
- If context is not found, returns "This is not covered in this module."
- Vector similarity threshold: 0.5 (configurable)
- Retrieves top 3 documents per query (configurable)
