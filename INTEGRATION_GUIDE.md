# LearnLedger UI Integration Guide

## Quick Start

### Prerequisites

1. **Backend Server Running**
   - The RAG backend must be running on `http://localhost:3001`
   - Ensure the following endpoints are available:
     - `POST /api/ask`
     - `POST /api/quiz`
     - `POST /api/evaluate`

2. **Dependencies Installed**
   ```bash
   npm install
   ```

### Starting the Application

1. **Start Backend (Terminal 1):**
   ```bash
   cd server
   npm start
   ```

2. **Start Frontend (Terminal 2):**
   ```bash
   npm run dev
   ```

3. **Open Browser:**
   - Navigate to `http://localhost:5173` (or the port shown in terminal)

## User Flow

### First Time User

1. **Landing Page** (`/`)
   - User sees the hero section with "Connect Wallet" button
   - Click "Connect Wallet" to connect Solana wallet

2. **After Wallet Connection**
   - Hero button changes to "Go to Dashboard"
   - Navbar shows: Dashboard, Ask AI, Quiz, Modules links
   - Click "Go to Dashboard" or use navbar

3. **Dashboard** (`/dashboard`)
   - View learning statistics
   - See available modules
   - Quick access to Ask AI or Quiz

4. **Ask AI** (`/ask-ai`)
   - Type questions about learning materials
   - Get instant AI-powered answers
   - View conversation history

5. **Quiz** (`/quiz`)
   - Enter a topic (e.g., "Blockchain Fundamentals")
   - Select number of questions (3, 5, or 10)
   - Click "Generate Quiz"
   - Answer all questions
   - Submit and view results
   - Take another quiz or return to dashboard

6. **Module** (`/module`)
   - Read learning content section by section
   - Navigate with Previous/Next buttons
   - Track progress with progress bar
   - Ask AI assistant about module content

## API Integration Details

### Backend Endpoints

#### 1. Ask Question
```
POST /api/ask
Content-Type: application/json

Request:
{
  "question": "What is blockchain?"
}

Response:
{
  "answer": "Blockchain is a distributed ledger...",
  "sources": ["source1.pdf", "source2.pdf"]
}
```

#### 2. Generate Quiz
```
POST /api/quiz
Content-Type: application/json

Request:
{
  "topic": "Blockchain Fundamentals",
  "num_questions": 5
}

Response:
{
  "quiz": [
    {
      "question": "What is a blockchain?",
      "options": ["A", "B", "C", "D"],
      "correct_answer": "A"
    }
  ]
}
```

#### 3. Evaluate Quiz
```
POST /api/evaluate
Content-Type: application/json

Request:
{
  "quiz": [...],
  "user_answers": ["A", "B", "C", "D", "A"]
}

Response:
{
  "score": 4,
  "total": 5,
  "percentage": 80,
  "results": [
    {
      "question": "...",
      "user_answer": "A",
      "correct_answer": "A",
      "is_correct": true
    }
  ]
}
```

## Customization

### Changing API Base URL

Edit `src/app/services/api.ts`:

```typescript
const API_BASE_URL = 'http://localhost:3001'; // Change this
```

### Adding New Modules

Edit `src/app/pages/Dashboard.tsx`:

```typescript
const modules = [
  {
    title: 'Your Module Title',
    description: 'Module description',
    duration: '2 hours',
    progress: 0,
    isCompleted: false,
  },
  // Add more modules...
];
```

### Customizing Module Content

Edit `src/app/pages/Module.tsx`:

```typescript
const sections: ModuleSection[] = [
  {
    title: 'Section Title',
    content: 'Section content...',
  },
  // Add more sections...
];
```

## Troubleshooting

### Issue: "Failed to generate quiz"
**Solution:** Make sure the backend server is running on port 3001

### Issue: "Failed to evaluate quiz"
**Solution:** Check that the backend `/api/evaluate` endpoint is working

### Issue: Wallet not connecting
**Solution:** 
- Make sure you have a Solana wallet extension installed (Phantom, Solflare)
- Check browser console for errors
- Try refreshing the page

### Issue: Pages not loading
**Solution:**
- Check that react-router-dom is installed: `npm install react-router-dom`
- Clear browser cache
- Check browser console for errors

### Issue: API calls failing with CORS errors
**Solution:** Add CORS headers to your backend server:

```javascript
// In your backend server
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
```

## Testing

### Manual Testing Checklist

- [ ] Landing page loads correctly
- [ ] Wallet connection works
- [ ] Navigation between pages works
- [ ] Dashboard displays stats and modules
- [ ] Ask AI accepts questions and returns answers
- [ ] Quiz generation works
- [ ] Quiz evaluation works
- [ ] Module navigation works
- [ ] Mobile responsive design works
- [ ] All animations work smoothly

### Testing with Mock Data

If backend is not available, you can modify the API service to return mock data:

```typescript
// In src/app/services/api.ts
export const askQuestion = async (question: string): Promise<AskQuestionResponse> => {
  // Mock response for testing
  return {
    answer: "This is a mock answer for testing purposes.",
    sources: ["mock-source.pdf"]
  };
};
```

## Deployment

### Build for Production

```bash
npm run build
```

This creates a `dist` folder with optimized production files.

### Deploy to Vercel/Netlify

1. Connect your repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variable for API URL if needed

### Environment Variables

Create `.env` file:

```
VITE_API_BASE_URL=https://your-backend-url.com
```

Update `src/app/services/api.ts`:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
```

## Performance Optimization

### Code Splitting

The application uses React Router which automatically code-splits by route.

### Lazy Loading

To further optimize, you can lazy load pages:

```typescript
// In App.tsx
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const AskAI = lazy(() => import('./pages/AskAI'));
// ... etc

// Wrap routes in Suspense
<Suspense fallback={<div>Loading...</div>}>
  <Routes>
    <Route path="/dashboard" element={<Dashboard />} />
    // ... etc
  </Routes>
</Suspense>
```

## Security Considerations

1. **API Security:** Implement authentication tokens for API calls
2. **Wallet Security:** Never store private keys in the application
3. **Input Validation:** Validate all user inputs before sending to backend
4. **HTTPS:** Use HTTPS in production
5. **Rate Limiting:** Implement rate limiting on backend endpoints

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review the UI_PAGES_README.md for detailed documentation
3. Check browser console for errors
4. Verify backend server is running and accessible
