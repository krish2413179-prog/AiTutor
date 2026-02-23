# LearnLedger UI Pages Documentation

This document describes the new UI pages created for the LearnLedger learning platform that integrate with the RAG backend.

## Overview

Four main pages have been created to provide a complete learning experience:

1. **Dashboard** - Learning progress overview
2. **Ask AI** - Interactive AI assistant chat
3. **Quiz** - AI-generated quizzes with evaluation
4. **Module** - Learning content viewer

## File Structure

```
src/app/
├── pages/
│   ├── Dashboard.tsx      # Learning dashboard with stats and modules
│   ├── AskAI.tsx          # AI chat interface
│   ├── Quiz.tsx           # Quiz generation and evaluation
│   └── Module.tsx         # Learning module content viewer
├── services/
│   └── api.ts             # API service for backend integration
├── components/
│   ├── StatsCard.tsx      # Statistics display card
│   ├── ChatMessage.tsx    # Chat message bubble
│   ├── QuizCard.tsx       # Quiz question card
│   └── ModuleCard.tsx     # Module overview card
```

## Pages

### 1. Dashboard (`/dashboard`)

**Features:**
- Overview of learning progress
- Stats cards showing:
  - Modules completed
  - Quiz scores
  - Learning streak
  - Skills earned
- Quick access to learning modules
- Quick action buttons to Ask AI and Quiz pages

**Wallet Required:** Yes

**Design Elements:**
- Stats grid with animated cards
- Module cards with progress bars
- Quick action cards with gradient backgrounds
- Responsive layout (mobile + desktop)

### 2. Ask AI (`/ask-ai`)

**Features:**
- Chat-like interface for asking questions
- Real-time AI responses powered by RAG backend
- Message history
- Loading states
- Error handling

**API Integration:**
- Endpoint: `POST /api/ask`
- Request: `{ question: string }`
- Response: `{ answer: string, sources?: string[] }`

**Wallet Required:** Yes

**Design Elements:**
- Chat bubbles with user/AI distinction
- Scrollable message container
- Input field with send button
- Loading indicator during API calls

### 3. Quiz (`/quiz`)

**Features:**
- Three states: Setup, Taking, Results
- Topic selection
- Number of questions selection (3, 5, or 10)
- AI-generated quiz questions
- Multiple choice options
- Answer submission
- Score display with detailed results
- Restart functionality

**API Integration:**
- Generate Quiz: `POST /api/quiz`
  - Request: `{ topic: string, num_questions: number }`
  - Response: `{ quiz: QuizQuestion[] }`
- Evaluate Quiz: `POST /api/evaluate`
  - Request: `{ quiz: QuizQuestion[], user_answers: string[] }`
  - Response: `{ score: number, total: number, percentage: number, results: [] }`

**Wallet Required:** Yes

**Design Elements:**
- Setup form with topic input
- Quiz cards with numbered questions
- Color-coded answer feedback (green for correct, red for incorrect)
- Results screen with trophy icon and percentage
- Restart button

### 4. Module (`/module`)

**Features:**
- Display learning content in sections
- Navigation between sections (Previous/Next)
- Progress tracking
- Section indicators
- Q&A section with link to AI assistant
- Completion badge

**Wallet Required:** Yes

**Design Elements:**
- Section-based content display
- Progress bar
- Navigation buttons
- Section dots indicator
- Q&A call-to-action card

## Components

### StatsCard
Displays statistics with icon, value, and trend.

**Props:**
- `title`: string
- `value`: string | number
- `icon`: LucideIcon
- `trend?`: string
- `color?`: 'green' | 'purple' | 'blue'

### ModuleCard
Displays module overview with progress.

**Props:**
- `title`: string
- `description`: string
- `duration`: string
- `progress`: number
- `isCompleted?`: boolean
- `onClick?`: () => void

### ChatMessage
Displays a chat message bubble.

**Props:**
- `message`: string
- `isUser`: boolean
- `timestamp?`: string

### QuizCard
Displays a quiz question with options.

**Props:**
- `question`: string
- `options`: string[]
- `selectedAnswer?`: string
- `correctAnswer?`: string
- `onSelectAnswer?`: (answer: string) => void
- `showResult?`: boolean
- `questionNumber`: number

## API Service

The `api.ts` service provides typed functions for backend integration:

```typescript
// Ask a question
const response = await askQuestion("What is blockchain?");

// Generate a quiz
const quiz = await generateQuiz("Blockchain Fundamentals", 5);

// Evaluate quiz answers
const results = await evaluateQuiz(quiz, userAnswers);
```

## Routing

The application uses React Router for navigation:

- `/` - Landing page
- `/dashboard` - Learning dashboard
- `/ask-ai` - AI assistant
- `/quiz` - Quiz page
- `/module` - Learning module

## Navigation

The Navbar component has been updated to:
- Show different links based on wallet connection status
- Highlight active page
- Provide mobile-responsive menu
- Display Dashboard, Ask AI, Quiz, and Modules links when wallet is connected

## Design System

All pages follow the LearnLedger design system:

**Colors:**
- Primary Green: `#14F195`
- Primary Purple: `#9945FF`
- Dark Background: `#0f0f0f`
- White/Gray text with opacity variations

**Components:**
- Gradient backgrounds for cards
- Border with low opacity
- Smooth animations using Framer Motion
- Lucide React icons
- Responsive design (mobile-first)

## Wallet Integration

All pages check for wallet connection:
- If not connected, show a prompt to connect wallet
- Use the existing `WalletButton` component
- Access wallet state via `useWallet()` hook from `@solana/wallet-adapter-react`

## Backend Requirements

The pages expect the following backend endpoints to be available:

1. `POST /api/ask` - Answer questions using RAG
2. `POST /api/quiz` - Generate quiz questions
3. `POST /api/evaluate` - Evaluate quiz answers

Make sure the backend server is running on `http://localhost:3001` before using these features.

## Usage

1. **Start the backend server:**
   ```bash
   cd server
   npm start
   ```

2. **Start the frontend:**
   ```bash
   npm run dev
   ```

3. **Connect your wallet** using the "Connect Wallet" button

4. **Navigate to any page** using the navbar links

## Error Handling

All pages include error handling for:
- API failures
- Network errors
- Missing backend server
- Invalid responses

Error messages are displayed to the user with clear instructions.

## Future Enhancements

Potential improvements:
- Persist chat history
- Save quiz results to blockchain
- Add more module content
- Implement module completion tracking
- Add user profile page
- Integrate with Solana for skill badges
- Add social features (leaderboards, sharing)
