# API Usage Examples - Personalized Learning Flow

## Quick Reference

### Scenario 1: Anonymous User (No Wallet)

**Use Case**: User exploring the platform without connecting wallet

```javascript
// Request
POST /api/ask
Content-Type: application/json

{
  "question": "What is a blockchain?"
}

// Response
{
  "answer": "A blockchain is a distributed ledger technology that records transactions across multiple computers..."
}
```

**Behavior**: ✅ Answers ANY question freely

---

### Scenario 2: New User (Wallet Connected, No Progress)

**Use Case**: User just connected wallet but hasn't completed any modules

```javascript
// Step 1: Initialize user
POST /api/user/init
{
  "walletAddress": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU"
}

// Step 2: Ask question
POST /api/ask
{
  "walletAddress": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
  "question": "What is a smart contract?"
}

// Response
{
  "answer": "A smart contract is a self-executing program stored on a blockchain..."
}
```

**Behavior**: ✅ Answers ANY question freely

---

### Scenario 3: Existing User (Has Completed Modules)

**Use Case**: User has completed "Blockchain Basics" module

```javascript
// Step 1: User completes module
POST /api/progress/update
{
  "walletAddress": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
  "topic": "Blockchain Basics",
  "progressPercentage": 100
}

// Step 2: Ask about completed topic
POST /api/ask
{
  "walletAddress": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
  "question": "How does blockchain consensus work?"
}

// Response (uses RAG from completed module)
{
  "answer": "Based on what you've learned in Blockchain Basics, consensus mechanisms..."
}
```

**Behavior**: ✅ Answers questions about completed topics using RAG

---

### Scenario 4: Existing User (Asking About Uncompleted Topic)

**Use Case**: User tries to ask about a topic they haven't completed

```javascript
// User has only completed "Blockchain Basics"
// Asking about "Solana Development"

POST /api/ask
{
  "walletAddress": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
  "question": "How do I deploy a Solana program?"
}

// Response
{
  "answer": "I'd love to help you with that! However, you'll need to complete the \"Solana Development\" module first to unlock this topic. Keep learning, you're doing great! 🚀"
}
```

**Behavior**: ❌ Restricts access, encourages module completion

---

## Frontend Integration

### React Example

```typescript
import { useWallet } from '@solana/wallet-adapter-react';

function AskQuestion() {
  const { publicKey } = useWallet();
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const handleAsk = async () => {
    const response = await fetch('/api/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question,
        walletAddress: publicKey?.toString() // Optional
      })
    });

    const data = await response.json();
    setAnswer(data.answer);
  };

  return (
    <div>
      <input 
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask a question..."
      />
      <button onClick={handleAsk}>Ask</button>
      {answer && <p>{answer}</p>}
    </div>
  );
}
```

### Key Points

1. **Always include `walletAddress` if available** - This enables personalized learning
2. **Handle restriction messages gracefully** - Show them as motivation to complete modules
3. **Don't cache responses** - User progress changes over time
4. **Show loading states** - AI responses can take 2-5 seconds

---

## Testing Checklist

- [ ] Anonymous user can ask any question
- [ ] New user with wallet can ask any question
- [ ] User with completed modules gets RAG-based answers
- [ ] User asking about uncompleted topic gets restriction message
- [ ] Invalid wallet address handled gracefully
- [ ] Empty question returns 400 error
- [ ] Database errors don't crash the endpoint

---

## Common Issues

### Issue: User gets restriction message but should have access

**Solution**: Check if module is marked as completed in database

```sql
SELECT * FROM user_progress 
WHERE wallet_address = 'USER_WALLET' 
AND completed = true;
```

### Issue: User gets unrestricted answers but should be restricted

**Solution**: Verify wallet address is being sent in request

```javascript
// Check request payload
console.log('Request:', { question, walletAddress });
```

### Issue: RAG returns no context for completed topic

**Solution**: Verify documents exist for that topic

```sql
SELECT * FROM documents 
WHERE metadata->>'topic' = 'TOPIC_NAME';
```

---

## Performance Tips

1. **Cache user progress** - Fetch once per session, update on module completion
2. **Debounce questions** - Prevent rapid-fire API calls
3. **Show typing indicators** - AI responses take time
4. **Preload common questions** - Cache FAQ responses

---

## Security Notes

- Wallet addresses are validated before database queries
- No sensitive data in error messages
- Rate limiting recommended for production
- Consider adding CORS restrictions
- Implement request signing for wallet verification
