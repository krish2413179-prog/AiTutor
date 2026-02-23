# Feature Branch: Personalized Learning Flow

## Overview

This branch implements a comprehensive personalized learning system for LearnLedger, including adaptive AI responses, quiz improvements, and dashboard enhancements.

## Features Added

### 1. Personalized Learning Flow

**Dynamic AI Response System** (`/api/ask` endpoint)

- **New Users**: Get unrestricted access to ask any questions
  - No wallet address required
  - Conversational, encouraging AI responses
  - Helps onboard users without barriers

- **Existing Users**: Progress-based learning path
  - AI answers adapt based on completed modules
  - RAG (Retrieval-Augmented Generation) filters content by completed topics
  - Friendly restriction messages encourage module completion
  - Prevents jumping ahead without foundational knowledge

**Key Benefits**:
- Progressive learning ensures solid foundation
- Personalized responses based on individual progress
- Motivational messaging keeps users engaged
- Seamless experience for both new and returning users

### 2. Quiz System Improvements

**Enhanced Quiz Generation**:
- Topic-specific quiz generation using Gemini AI
- Support for any blockchain topic
- Structured question format with multiple choice answers
- Difficulty levels and explanations

**Files Modified/Created**:
- `server/routes.js` - Quiz generation endpoints
- `server/test-quiz-any-topic.js` - Comprehensive testing
- `src/app/pages/Quiz.tsx` - Frontend quiz interface

### 3. Dashboard Updates

**User Progress Tracking**:
- Visual progress indicators
- Module completion status
- Learning path visualization
- Personalized recommendations

**Files Modified**:
- `src/app/pages/Dashboard.tsx` - Enhanced UI components
- Integration with user progress API

### 4. RAG Pipeline Enhancement

**Intelligent Content Filtering**:
- Topic-based document retrieval
- Filters by user's completed modules
- Efficient vector search with metadata filtering
- Fallback handling for edge cases

**Files Modified**:
- `server/rag.js` - Enhanced RAG pipeline with topic filtering

### 5. Database Integration

**User Progress Tracking**:
- `user_progress` table for tracking completed modules
- Efficient queries with proper indexing
- Wallet address-based user identification

**Database Schema**:
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

## Technical Implementation

### Architecture

```
Frontend (React + TypeScript)
    ↓
API Layer (Express.js)
    ↓
Services Layer
    ├── Gemini AI (Question Answering)
    ├── RAG Pipeline (Context Retrieval)
    └── Supabase (User Progress)
```

### Key Files Modified

**Backend**:
- `server/routes.js` - Main API endpoints with personalized logic
- `server/rag.js` - Enhanced RAG pipeline
- `server/geminiClient.js` - Gemini AI integration

**Frontend**:
- `src/app/pages/Dashboard.tsx` - User dashboard
- `src/app/pages/Quiz.tsx` - Quiz interface

**Documentation**:
- `PERSONALIZED_LEARNING_IMPLEMENTATION.md` - Complete implementation guide
- `server/PERSONALIZED_LEARNING_FLOW.md` - Technical flow documentation
- `server/API_USAGE_EXAMPLES.md` - Developer reference

**Testing**:
- `server/test-personalized-flow.js` - End-to-end flow testing
- `server/test-quiz-any-topic.js` - Quiz generation testing
- `server/test-personalized-ask.js` - API endpoint testing

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Supabase account
- Gemini API key

### Installation

1. **Clone the repository and checkout this branch**:
   ```bash
   git checkout feature/personalized-learning
   ```

2. **Install dependencies**:
   ```bash
   # Root dependencies
   npm install
   
   # Server dependencies
   cd server
   npm install
   cd ..
   ```

3. **Configure environment variables**:
   
   Create `server/.env` file:
   ```env
   # Server Configuration
   PORT=3001
   NODE_ENV=development
   
   # Supabase Configuration
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_anon_key
   
   # Gemini API Configuration
   GEMINI_API_KEY=your_gemini_api_key
   
   # Rate Limiting
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   
   # CORS Configuration
   ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
   ```

4. **Set up the database**:
   ```bash
   # Run database setup script
   cd server
   node setup-database.sql
   ```

5. **Start the development servers**:
   
   Terminal 1 (Backend):
   ```bash
   cd server
   npm run dev
   ```
   
   Terminal 2 (Frontend):
   ```bash
   npm run dev
   ```

6. **Access the application**:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

## Testing

### Run All Tests

```bash
cd server

# Test personalized learning flow
node test-personalized-flow.js

# Test quiz generation
node test-quiz-any-topic.js

# Test API endpoints
node test-personalized-ask.js

# Test Gemini connection
node test-gemini-connection.js
```

### Manual Testing

1. **New User Flow**:
   - Open app without wallet connection
   - Ask any question in the chat
   - Verify unrestricted responses

2. **Existing User Flow**:
   - Connect wallet
   - Complete a module
   - Ask questions about completed topics (should work)
   - Ask questions about uncompleted topics (should show restriction)

3. **Quiz System**:
   - Navigate to Quiz page
   - Select a topic
   - Generate quiz
   - Verify questions are relevant and well-formatted

## API Endpoints

### `/api/ask` - Personalized Q&A
```javascript
POST /api/ask
{
  "question": "What is blockchain?",
  "walletAddress": "0xABC..." // Optional
}
```

### `/api/quiz/generate` - Generate Quiz
```javascript
POST /api/quiz/generate
{
  "topic": "Blockchain Basics",
  "difficulty": "beginner",
  "questionCount": 5
}
```

### `/api/progress` - Get User Progress
```javascript
GET /api/progress/:walletAddress
```

## Security Notes

⚠️ **IMPORTANT**: Never commit the `.env` file to Git!

The `.env` file contains sensitive API keys:
- `GEMINI_API_KEY` - Google Gemini API key
- `SUPABASE_KEY` - Supabase database credentials
- `SUPABASE_URL` - Supabase project URL

These are now properly excluded via `.gitignore`.

## Known Issues & Future Enhancements

### Known Issues
- None currently identified

### Future Enhancements
- [ ] Add prerequisite chains (Topic B requires Topic A)
- [ ] Implement "sneak peek" mode for upcoming topics
- [ ] Track question history for personalized recommendations
- [ ] Add difficulty levels within topics
- [ ] Implement Redis cache for user progress
- [ ] Add analytics dashboard for learning patterns
- [ ] Mobile responsive improvements
- [ ] Offline mode support

## Contributing

When working on this branch:

1. Keep the personalized learning logic in `server/routes.js`
2. Update tests when adding new features
3. Document API changes in `server/API_USAGE_EXAMPLES.md`
4. Follow the existing code style and patterns

## Documentation

- `PERSONALIZED_LEARNING_IMPLEMENTATION.md` - Implementation summary
- `server/PERSONALIZED_LEARNING_FLOW.md` - Technical flow details
- `server/API_USAGE_EXAMPLES.md` - API usage examples
- `server/README.md` - Server setup guide
- `README.md` - Main project README

## Contact & Support

For questions or issues with this branch, please refer to the documentation files or create an issue in the repository.

---

**Branch Status**: ✅ Ready for Review  
**Last Updated**: 2024  
**Tested**: ✅ All tests passing
