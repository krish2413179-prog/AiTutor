# LearnLedger UI - Quick Reference

## 🚀 Quick Start

```bash
# Terminal 1 - Backend
cd server
npm start

# Terminal 2 - Frontend
npm run dev
```

## 📁 File Locations

```
src/app/
├── pages/
│   ├── Dashboard.tsx    → /dashboard
│   ├── AskAI.tsx        → /ask-ai
│   ├── Quiz.tsx         → /quiz
│   └── Module.tsx       → /module
├── services/
│   └── api.ts           → API calls
└── components/
    ├── StatsCard.tsx    → Stats display
    ├── ModuleCard.tsx   → Module cards
    ├── ChatMessage.tsx  → Chat bubbles
    └── QuizCard.tsx     → Quiz questions
```

## 🎨 Design Tokens

```css
/* Colors */
--green: #14F195
--purple: #9945FF
--dark: #0f0f0f

/* Spacing */
gap-4, gap-6, gap-8
p-4, p-6, p-8

/* Borders */
border border-white/10
rounded-lg, rounded-xl
```

## 🔌 API Endpoints

```typescript
// Ask Question
POST /api/ask
{ question: string }
→ { answer: string, sources?: string[] }

// Generate Quiz
POST /api/quiz
{ topic: string, num_questions: number }
→ { quiz: QuizQuestion[] }

// Evaluate Quiz
POST /api/evaluate
{ quiz: QuizQuestion[], user_answers: string[] }
→ { score, total, percentage, results }
```

## 🧩 Component Usage

### StatsCard
```tsx
<StatsCard
  title="Modules Completed"
  value="12"
  icon={BookOpen}
  trend="+3 this week"
  color="green"
/>
```

### ModuleCard
```tsx
<ModuleCard
  title="Blockchain 101"
  description="Learn the basics"
  duration="2 hours"
  progress={75}
  isCompleted={false}
  onClick={() => navigate('/module')}
/>
```

### ChatMessage
```tsx
<ChatMessage
  message="Hello!"
  isUser={true}
  timestamp="10:30 AM"
/>
```

### QuizCard
```tsx
<QuizCard
  question="What is blockchain?"
  options={["A", "B", "C", "D"]}
  selectedAnswer={userAnswer}
  onSelectAnswer={setAnswer}
  questionNumber={1}
/>
```

## 🔐 Wallet Integration

```tsx
import { useWallet } from '@solana/wallet-adapter-react';

const { connected, publicKey } = useWallet();

if (!connected) {
  return <WalletButton />;
}
```

## 🛣️ Navigation

```tsx
import { Link, useNavigate } from 'react-router-dom';

// Link
<Link to="/dashboard">Dashboard</Link>

// Programmatic
const navigate = useNavigate();
navigate('/quiz');
```

## 📡 API Service

```typescript
import { askQuestion, generateQuiz, evaluateQuiz } from '../services/api';

// Ask
const response = await askQuestion("What is blockchain?");

// Quiz
const quiz = await generateQuiz("Blockchain", 5);

// Evaluate
const results = await evaluateQuiz(quiz, answers);
```

## 🎭 Animations

```tsx
import { motion } from 'motion/react';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  Content
</motion.div>
```

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| API fails | Check backend is running on :3001 |
| Wallet won't connect | Install Phantom/Solflare extension |
| Build errors | Run `npm install` |
| CORS errors | Add CORS headers to backend |
| Routes not working | Check react-router-dom installed |

## 📱 Responsive Classes

```css
/* Mobile First */
grid-cols-1           /* Mobile */
md:grid-cols-2        /* Tablet */
lg:grid-cols-3        /* Desktop */
xl:grid-cols-4        /* Large Desktop */

/* Hide/Show */
hidden md:flex        /* Hide on mobile, show on tablet+ */
flex md:hidden        /* Show on mobile, hide on tablet+ */
```

## 🎯 Page States

### Dashboard
- Connected: Show stats and modules
- Not Connected: Show wallet prompt

### Ask AI
- Idle: Show input
- Loading: Show spinner
- Error: Show error message

### Quiz
- Setup: Topic selection
- Taking: Answer questions
- Results: Show score

### Module
- Section view with navigation
- Progress tracking
- Q&A section

## 🔧 Customization

### Change API URL
```typescript
// src/app/services/api.ts
const API_BASE_URL = 'https://your-api.com';
```

### Add Module
```typescript
// src/app/pages/Dashboard.tsx
const modules = [
  {
    title: 'New Module',
    description: 'Description',
    duration: '2 hours',
    progress: 0,
  }
];
```

### Add Section
```typescript
// src/app/pages/Module.tsx
const sections = [
  {
    title: 'New Section',
    content: 'Content here...'
  }
];
```

## 📊 Build Commands

```bash
# Development
npm run dev

# Production Build
npm run build

# Preview Build
npm run preview
```

## 🎨 Icon Usage

```tsx
import { BookOpen, Trophy, Brain } from 'lucide-react';

<BookOpen className="w-6 h-6 text-[#14F195]" />
```

## 🔍 Debugging

```typescript
// Check wallet connection
console.log('Connected:', connected);
console.log('Public Key:', publicKey?.toBase58());

// Check API response
console.log('Response:', response);

// Check route
import { useLocation } from 'react-router-dom';
const location = useLocation();
console.log('Current path:', location.pathname);
```

## 📚 Resources

- [React Router Docs](https://reactrouter.com)
- [Framer Motion Docs](https://www.framer.com/motion/)
- [Solana Wallet Adapter](https://github.com/solana-labs/wallet-adapter)
- [Lucide Icons](https://lucide.dev)
- [Tailwind CSS](https://tailwindcss.com)

## ✅ Testing Checklist

- [ ] Backend running
- [ ] Frontend running
- [ ] Wallet connects
- [ ] Dashboard loads
- [ ] Ask AI works
- [ ] Quiz generates
- [ ] Quiz evaluates
- [ ] Module navigates
- [ ] Mobile responsive
- [ ] Animations smooth

## 🚢 Deployment

```bash
# Build
npm run build

# Output
dist/

# Deploy to Vercel
vercel deploy

# Deploy to Netlify
netlify deploy --prod
```

## 💡 Pro Tips

1. Use `connected` check on all protected pages
2. Always handle API errors gracefully
3. Show loading states for better UX
4. Test on mobile devices
5. Use TypeScript for type safety
6. Keep components small and reusable
7. Follow the existing design system
8. Add error boundaries for production
9. Optimize images and assets
10. Use lazy loading for better performance
