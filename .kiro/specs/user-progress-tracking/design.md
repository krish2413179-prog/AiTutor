# Design Document: User Progress Tracking

## Overview

This design implements a comprehensive user state management system for LearnLedger that tracks learning progress, quiz results, and gamification metrics tied to Solana wallet addresses. The system extends the existing Express.js backend with new database tables, service layers, and API endpoints while preserving all existing RAG functionality.

The architecture follows a modular service-oriented design that separates concerns between RAG operations (existing) and user state management (new). All user data persists in Supabase with wallet addresses serving as the primary identifier, enabling seamless cross-session continuity when users reconnect their wallets.

Key capabilities:
- Automatic user profile initialization on wallet connection
- Per-topic progress tracking with completion status
- Quiz result storage with automatic XP awards
- Level progression system (100 XP per level)
- Topic completion based on quiz performance (70% passing threshold)

## Architecture

### System Components

The system extends the existing backend with three new service modules:

```
server/
├── index.js                 # Express app (unchanged)
├── routes.js                # Route definitions (extended)
├── rag.js                   # RAG pipeline (unchanged)
├── geminiClient.js          # Gemini AI client (unchanged)
├── supabaseClient.js        # Supabase client (unchanged)
└── services/
    ├── userService.js       # User profile management (NEW)
    ├── progressService.js   # Learning progress tracking (NEW)
    └── quizService.js       # Quiz results and XP calculation (NEW)
```

### Separation of Concerns

**Existing RAG Layer** (unchanged):
- `/api/ask` - Question answering with context retrieval
- `/api/quiz` - Quiz generation from topics
- `/api/evaluate` - Answer evaluation with scoring

**New User State Layer**:
- `/api/user/init` - User profile initialization
- `/api/user/:walletAddress` - User profile retrieval
- `/api/progress/update` - Progress tracking updates
- `/api/progress/:walletAddress` - Progress retrieval
- `/api/quiz/save` - Quiz result storage with XP awards

### Data Flow

1. **User Initialization Flow**:
   ```
   Frontend (Wallet Connect) → POST /api/user/init → UserService
   → Check if user exists → Create/Update user → Return profile
   ```

2. **Progress Tracking Flow**:
   ```
   Frontend (Module Progress) → POST /api/progress/update → ProgressService
   → Upsert progress record → Update completion status → Return updated progress
   ```

3. **Quiz Completion Flow**:
   ```
   Frontend (Quiz Submit) → POST /api/quiz/save → QuizService
   → Save quiz result → Calculate XP (10 per correct) → Update user XP/level
   → Check passing threshold (70%) → Update progress completion → Return results
   ```

## Components and Interfaces

### Service Layer

#### UserService

Manages user profile lifecycle and retrieval.

```javascript
// userService.js

import { supabase } from '../supabaseClient.js';

/**
 * Initialize or update user profile on wallet connection
 * @param {string} walletAddress - Solana wallet public key
 * @returns {Promise<Object>} User profile data
 */
export async function initializeUser(walletAddress) {
  // Check if user exists
  const { data: existingUser } = await supabase
    .from('users')
    .select('*')
    .eq('wallet_address', walletAddress)
    .single();

  if (existingUser) {
    // Update last_login
    const { data, error } = await supabase
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('wallet_address', walletAddress)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } else {
    // Create new user
    const { data, error } = await supabase
      .from('users')
      .insert({
        wallet_address: walletAddress,
        total_xp: 0,
        current_level: 1
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
}

/**
 * Retrieve user profile with aggregated statistics
 * @param {string} walletAddress - Solana wallet public key
 * @returns {Promise<Object>} User profile with stats
 */
export async function getUserProfile(walletAddress) {
  // Get user data
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('wallet_address', walletAddress)
    .single();
  
  if (userError) throw userError;

  // Get completed topics count
  const { count: completedCount } = await supabase
    .from('user_progress')
    .select('*', { count: 'exact', head: true })
    .eq('wallet_address', walletAddress)
    .eq('completed', true);

  // Get recent quiz results (last 5)
  const { data: recentQuizzes } = await supabase
    .from('quiz_results')
    .select('*')
    .eq('wallet_address', walletAddress)
    .order('completed_at', { ascending: false })
    .limit(5);

  return {
    ...user,
    completed_topics: completedCount || 0,
    recent_quizzes: recentQuizzes || []
  };
}
```

#### ProgressService

Handles learning progress tracking per topic.

```javascript
// progressService.js

import { supabase } from '../supabaseClient.js';

/**
 * Update or create progress record for a topic
 * @param {string} walletAddress - Solana wallet public key
 * @param {string} topic - Learning topic name
 * @param {number} progressPercentage - Completion percentage (0-100)
 * @returns {Promise<Object>} Updated progress record
 */
export async function updateProgress(walletAddress, topic, progressPercentage) {
  // Validate progress percentage
  if (progressPercentage < 0 || progressPercentage > 100) {
    throw new Error('Progress percentage must be between 0 and 100');
  }

  const completed = progressPercentage === 100;

  // Upsert progress record
  const { data, error } = await supabase
    .from('user_progress')
    .upsert({
      wallet_address: walletAddress,
      topic: topic,
      progress_percentage: progressPercentage,
      completed: completed,
      last_accessed: new Date().toISOString()
    }, {
      onConflict: 'wallet_address,topic'
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Retrieve all progress records for a user
 * @param {string} walletAddress - Solana wallet public key
 * @returns {Promise<Array>} List of progress records
 */
export async function getUserProgress(walletAddress) {
  const { data, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('wallet_address', walletAddress)
    .order('last_accessed', { ascending: false });

  if (error) throw error;
  return data || [];
}
```

#### QuizService

Manages quiz results, XP awards, and level calculations.

```javascript
// quizService.js

import { supabase } from '../supabaseClient.js';

/**
 * Save quiz result, award XP, update level, and mark topic completion
 * @param {string} walletAddress - Solana wallet public key
 * @param {string} topic - Quiz topic name
 * @param {number} score - Number of correct answers
 * @param {number} totalQuestions - Total number of questions
 * @returns {Promise<Object>} Quiz result with XP and level updates
 */
export async function saveQuizResult(walletAddress, topic, score, totalQuestions) {
  // Validate inputs
  if (score > totalQuestions) {
    throw new Error('Score cannot exceed total questions');
  }

  // Save quiz result
  const { data: quizResult, error: quizError } = await supabase
    .from('quiz_results')
    .insert({
      wallet_address: walletAddress,
      topic: topic,
      score: score,
      total_questions: totalQuestions,
      completed_at: new Date().toISOString()
    })
    .select()
    .single();

  if (quizError) throw quizError;

  // Calculate XP (10 per correct answer)
  const xpAwarded = score * 10;

  // Get current user data
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('total_xp')
    .eq('wallet_address', walletAddress)
    .single();

  if (userError) throw userError;

  // Calculate new XP and level
  const newTotalXp = user.total_xp + xpAwarded;
  const newLevel = Math.floor(newTotalXp / 100) + 1;

  // Update user XP and level
  const { error: updateError } = await supabase
    .from('users')
    .update({
      total_xp: newTotalXp,
      current_level: newLevel
    })
    .eq('wallet_address', walletAddress);

  if (updateError) throw updateError;

  // Check if quiz passed (70% threshold)
  const percentage = (score / totalQuestions) * 100;
  const passed = percentage >= 70;

  if (passed) {
    // Mark topic as completed
    await supabase
      .from('user_progress')
      .upsert({
        wallet_address: walletAddress,
        topic: topic,
        progress_percentage: 100,
        completed: true,
        last_accessed: new Date().toISOString()
      }, {
        onConflict: 'wallet_address,topic'
      });
  }

  return {
    quiz_result: quizResult,
    xp_awarded: xpAwarded,
    new_total_xp: newTotalXp,
    new_level: newLevel,
    passed: passed
  };
}
```

### Route Handlers

New routes added to `routes.js`:

```javascript
// Add to existing routes.js

import { initializeUser, getUserProfile } from './services/userService.js';
import { updateProgress, getUserProgress } from './services/progressService.js';
import { saveQuizResult } from './services/quizService.js';

/**
 * POST /api/user/init
 * Initialize or update user profile on wallet connection
 */
router.post('/user/init', async (req, res) => {
  try {
    const { walletAddress } = req.body;

    if (!walletAddress || typeof walletAddress !== 'string' || walletAddress.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Wallet address is required and must be a non-empty string'
      });
    }

    const user = await initializeUser(walletAddress);

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error in /api/user/init:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to initialize user'
    });
  }
});

/**
 * GET /api/user/:walletAddress
 * Retrieve user profile with statistics
 */
router.get('/user/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params;

    const profile = await getUserProfile(walletAddress);

    res.json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error('Error in /api/user/:walletAddress:', error);
    
    if (error.code === 'PGRST116') {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to retrieve user profile'
    });
  }
});

/**
 * POST /api/progress/update
 * Update learning progress for a topic
 */
router.post('/progress/update', async (req, res) => {
  try {
    const { walletAddress, topic, progressPercentage } = req.body;

    if (!walletAddress || typeof walletAddress !== 'string' || walletAddress.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Wallet address is required and must be a non-empty string'
      });
    }

    if (!topic || typeof topic !== 'string' || topic.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Topic is required and must be a non-empty string'
      });
    }

    if (typeof progressPercentage !== 'number') {
      return res.status(400).json({
        success: false,
        error: 'Progress percentage is required and must be a number'
      });
    }

    const progress = await updateProgress(walletAddress, topic, progressPercentage);

    res.json({
      success: true,
      data: progress
    });
  } catch (error) {
    console.error('Error in /api/progress/update:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to update progress'
    });
  }
});

/**
 * GET /api/progress/:walletAddress
 * Retrieve all progress records for a user
 */
router.get('/progress/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params;

    const progress = await getUserProgress(walletAddress);

    res.json({
      success: true,
      data: progress
    });
  } catch (error) {
    console.error('Error in /api/progress/:walletAddress:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve progress'
    });
  }
});

/**
 * POST /api/quiz/save
 * Save quiz result, award XP, and update level
 */
router.post('/quiz/save', async (req, res) => {
  try {
    const { walletAddress, topic, score, totalQuestions } = req.body;

    if (!walletAddress || typeof walletAddress !== 'string' || walletAddress.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Wallet address is required and must be a non-empty string'
      });
    }

    if (!topic || typeof topic !== 'string' || topic.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Topic is required and must be a non-empty string'
      });
    }

    if (typeof score !== 'number' || typeof totalQuestions !== 'number') {
      return res.status(400).json({
        success: false,
        error: 'Score and total questions must be numbers'
      });
    }

    const result = await saveQuizResult(walletAddress, topic, score, totalQuestions);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error in /api/quiz/save:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to save quiz result'
    });
  }
});
```

### API Request/Response Formats

#### POST /api/user/init

**Request:**
```json
{
  "walletAddress": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU"
}
```

**Response (New User):**
```json
{
  "success": true,
  "data": {
    "wallet_address": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    "created_at": "2024-01-15T10:30:00.000Z",
    "last_login": "2024-01-15T10:30:00.000Z",
    "total_xp": 0,
    "current_level": 1
  }
}
```

**Response (Existing User):**
```json
{
  "success": true,
  "data": {
    "wallet_address": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    "created_at": "2024-01-10T08:00:00.000Z",
    "last_login": "2024-01-15T10:30:00.000Z",
    "total_xp": 450,
    "current_level": 5
  }
}
```

#### GET /api/user/:walletAddress

**Response:**
```json
{
  "success": true,
  "data": {
    "wallet_address": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    "created_at": "2024-01-10T08:00:00.000Z",
    "last_login": "2024-01-15T10:30:00.000Z",
    "total_xp": 450,
    "current_level": 5,
    "completed_topics": 3,
    "recent_quizzes": [
      {
        "id": "uuid-1",
        "wallet_address": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
        "topic": "Blockchain Basics",
        "score": 8,
        "total_questions": 10,
        "completed_at": "2024-01-15T09:00:00.000Z"
      }
    ]
  }
}
```

#### POST /api/progress/update

**Request:**
```json
{
  "walletAddress": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
  "topic": "Blockchain Basics",
  "progressPercentage": 75
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-1",
    "wallet_address": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    "topic": "Blockchain Basics",
    "progress_percentage": 75,
    "completed": false,
    "last_accessed": "2024-01-15T10:30:00.000Z"
  }
}
```

#### GET /api/progress/:walletAddress

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-1",
      "wallet_address": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
      "topic": "Blockchain Basics",
      "progress_percentage": 100,
      "completed": true,
      "last_accessed": "2024-01-15T09:00:00.000Z"
    },
    {
      "id": "uuid-2",
      "wallet_address": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
      "topic": "Smart Contracts",
      "progress_percentage": 45,
      "completed": false,
      "last_accessed": "2024-01-14T15:30:00.000Z"
    }
  ]
}
```

#### POST /api/quiz/save

**Request:**
```json
{
  "walletAddress": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
  "topic": "Blockchain Basics",
  "score": 8,
  "totalQuestions": 10
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "quiz_result": {
      "id": "uuid-1",
      "wallet_address": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
      "topic": "Blockchain Basics",
      "score": 8,
      "total_questions": 10,
      "completed_at": "2024-01-15T10:30:00.000Z"
    },
    "xp_awarded": 80,
    "new_total_xp": 530,
    "new_level": 6,
    "passed": true
  }
}
```

## Data Models

### Database Schema

#### users Table

Stores user profiles tied to Solana wallet addresses.

```sql
CREATE TABLE users (
  wallet_address TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_login TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  total_xp INTEGER NOT NULL DEFAULT 0,
  current_level INTEGER NOT NULL DEFAULT 1
);

-- Index for performance
CREATE INDEX idx_users_level ON users(current_level);
CREATE INDEX idx_users_xp ON users(total_xp);
```

**Fields:**
- `wallet_address` (TEXT, PRIMARY KEY): Solana wallet public key
- `created_at` (TIMESTAMPTZ): Account creation timestamp
- `last_login` (TIMESTAMPTZ): Last wallet connection timestamp
- `total_xp` (INTEGER): Cumulative experience points
- `current_level` (INTEGER): User level (calculated as floor(total_xp / 100) + 1)

**Constraints:**
- `wallet_address` must be unique and not null
- `total_xp` defaults to 0
- `current_level` defaults to 1

#### user_progress Table

Tracks learning progress per topic for each user.

```sql
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT NOT NULL REFERENCES users(wallet_address) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  progress_percentage INTEGER NOT NULL DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  last_accessed TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(wallet_address, topic)
);

-- Indexes for performance
CREATE INDEX idx_user_progress_wallet ON user_progress(wallet_address);
CREATE INDEX idx_user_progress_completed ON user_progress(completed);
CREATE INDEX idx_user_progress_last_accessed ON user_progress(last_accessed);
```

**Fields:**
- `id` (UUID, PRIMARY KEY): Unique record identifier
- `wallet_address` (TEXT, FOREIGN KEY): References users table
- `topic` (TEXT): Learning topic name
- `progress_percentage` (INTEGER): Completion percentage (0-100)
- `completed` (BOOLEAN): Whether topic is completed
- `last_accessed` (TIMESTAMPTZ): Last interaction timestamp

**Constraints:**
- Foreign key to `users(wallet_address)` with CASCADE delete
- Unique constraint on `(wallet_address, topic)` combination
- `progress_percentage` must be between 0 and 100
- `completed` defaults to false

#### quiz_results Table

Stores quiz performance history for each user.

```sql
CREATE TABLE quiz_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT NOT NULL REFERENCES users(wallet_address) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  score INTEGER NOT NULL CHECK (score >= 0),
  total_questions INTEGER NOT NULL CHECK (total_questions > 0),
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (score <= total_questions)
);

-- Indexes for performance
CREATE INDEX idx_quiz_results_wallet ON quiz_results(wallet_address);
CREATE INDEX idx_quiz_results_topic ON quiz_results(topic);
CREATE INDEX idx_quiz_results_completed_at ON quiz_results(completed_at);
```

**Fields:**
- `id` (UUID, PRIMARY KEY): Unique record identifier
- `wallet_address` (TEXT, FOREIGN KEY): References users table
- `topic` (TEXT): Quiz topic name
- `score` (INTEGER): Number of correct answers
- `total_questions` (INTEGER): Total number of questions
- `completed_at` (TIMESTAMPTZ): Quiz completion timestamp

**Constraints:**
- Foreign key to `users(wallet_address)` with CASCADE delete
- `score` must be non-negative
- `total_questions` must be positive
- `score` must not exceed `total_questions`

### XP and Level Calculation Algorithms

#### XP Award Formula

```
XP Awarded = Correct Answers × 10
```

Example: 8 correct answers out of 10 questions = 80 XP

#### Level Calculation Formula

```
Level = floor(Total XP / 100) + 1
```

Examples:
- 0 XP → Level 1
- 99 XP → Level 1
- 100 XP → Level 2
- 450 XP → Level 5
- 999 XP → Level 10
- 1000 XP → Level 11

#### Topic Completion Logic

```
Passing Threshold = 70%
Percentage = (Score / Total Questions) × 100

If Percentage >= 70:
  - Set progress_percentage = 100
  - Set completed = true
```

Example: 7 correct out of 10 questions = 70% → Topic completed

