# Dashboard API Test Script

## Overview
This test script diagnoses issues with the dashboard by testing all dashboard-related API endpoints.

## File Location
`server/test-dashboard-api.js`

## How to Run

### Prerequisites
1. Ensure the server is running:
   ```bash
   cd server
   npm start
   ```

2. In a separate terminal, run the test script:
   ```bash
   node server/test-dashboard-api.js
   ```

## What It Tests

### 1. POST /api/user/init
- **Purpose**: Initialize user profile when wallet connects
- **Test Data**: Creates a test wallet with timestamp
- **Expected**: Returns user object with wallet_address, total_xp, current_level
- **Dashboard Usage**: Called when wallet connects to ensure user exists

### 2. GET /api/user/:walletAddress
- **Purpose**: Retrieve user profile with statistics
- **Expected**: Returns profile with XP, level, created_at, last_login
- **Dashboard Usage**: Fetched in parallel with progress to display user stats

### 3. GET /api/progress/:walletAddress
- **Purpose**: Get all learning progress records for a user
- **Expected**: Returns array of progress records (empty for new users)
- **Dashboard Usage**: Used to display module cards and calculate stats

### 4. POST /api/progress/update
- **Purpose**: Update or create progress for a specific topic
- **Test Data**: 
  - Topic: "Blockchain Basics"
  - Progress: 50% then 100%
- **Expected**: Returns updated progress record
- **Dashboard Usage**: Called when user completes quizzes or modules

### 5. Validation Tests
- Tests invalid requests (missing fields, non-existent users)
- Ensures proper error handling

### 6. Dashboard Data Flow Simulation
- Simulates exactly what the Dashboard component does:
  1. Initialize user
  2. Fetch progress and profile in parallel
  3. Verify data structure matches expectations

## Test Output

### Success Output
```
=============================================================
Dashboard API Diagnostic Test
=============================================================
ℹ API Base URL: http://localhost:3001/api
ℹ Test Wallet: test-wallet-dashboard-1234567890

▶ Testing: POST /api/user/init - Initialize User
✓ User initialized successfully: test-wallet-dashboard-1234567890, Level 1, XP 0

▶ Testing: GET /api/user/:walletAddress - Get User Profile
✓ Profile retrieved: Level 1, XP 0

... (more tests)

=============================================================
Test Summary
=============================================================
Total Tests: 8
Passed: 8
Failed: 0

✓ All API endpoints are working correctly! ✓
```

### Failure Output
If tests fail, you'll see:
- Detailed error messages for each failed test
- Request/response data for debugging
- Diagnostic recommendations

## Common Issues and Solutions

### Issue 1: Connection Refused
**Symptom**: `ECONNREFUSED` error
**Solution**: 
- Ensure server is running on port 3001
- Check `server/.env` for correct port configuration
- Verify no firewall blocking localhost:3001

### Issue 2: Database Errors
**Symptom**: Tests fail with database-related errors
**Solution**:
- Check Supabase credentials in `server/.env`
- Verify database tables exist:
  - `users` table
  - `user_progress` table
- Check database connection in Supabase dashboard

### Issue 3: 404 Not Found
**Symptom**: API endpoints return 404
**Solution**:
- Verify routes are properly registered in `server/index.js`
- Check that `server/routes.js` exports the router correctly
- Ensure API prefix is `/api`

### Issue 4: Invalid Data Structure
**Symptom**: Tests pass but dashboard shows errors
**Solution**:
- Check that service files return correct data format:
  - `server/services/userService.js`
  - `server/services/progressService.js`
- Verify TypeScript interfaces in `src/app/pages/Dashboard.tsx` match API responses

## Dashboard Component Flow

The Dashboard component follows this flow:

```typescript
useEffect(() => {
  if (connected && publicKey) {
    const walletAddress = publicKey.toBase58();
    
    // 1. Initialize user
    await api.post('/user/init', { walletAddress });
    
    // 2. Fetch data in parallel
    const [progressResponse, profileResponse] = await Promise.all([
      api.get(`/progress/${walletAddress}`),
      api.get(`/user/${walletAddress}`)
    ]);
    
    // 3. Update state
    setUserProgress(progressResponse.data.data || []);
    setUserProfile(profileResponse.data.data || null);
  }
}, [connected, publicKey]);
```

## Expected API Response Formats

### User Init/Profile Response
```json
{
  "success": true,
  "data": {
    "wallet_address": "test-wallet-123",
    "total_xp": 0,
    "current_level": 1,
    "created_at": "2024-01-01T00:00:00Z",
    "last_login": "2024-01-01T00:00:00Z"
  }
}
```

### Progress Response
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "wallet_address": "test-wallet-123",
      "topic": "Blockchain Basics",
      "progress_percentage": 50,
      "completed": false,
      "last_accessed": "2024-01-01T00:00:00Z",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

## Cleanup

After testing, clean up test data from your database:

```sql
DELETE FROM user_progress WHERE wallet_address LIKE 'test-wallet-dashboard-%';
DELETE FROM users WHERE wallet_address LIKE 'test-wallet-dashboard-%';
```

Or use the provided cleanup script:
```bash
node server/clear-database.js
```

## Troubleshooting Dashboard Issues

If the test script passes but dashboard still doesn't work:

### 1. Check Browser Console
- Open DevTools (F12)
- Look for JavaScript errors
- Check Network tab for failed API calls

### 2. Verify CORS Settings
The server must allow requests from the frontend:
```javascript
// In server/index.js
app.use(cors({
  origin: 'http://localhost:5173', // Vite default port
  credentials: true
}));
```

### 3. Check API Base URL
In `src/app/services/api.ts`:
```typescript
const API_BASE_URL = 'http://localhost:3001/api';
```

### 4. Verify Wallet Connection
- Ensure wallet adapter is properly configured
- Check that `publicKey` is available
- Verify wallet is actually connected

### 5. Check State Updates
Add console logs in Dashboard component:
```typescript
console.log('User Progress:', userProgress);
console.log('User Profile:', userProfile);
console.log('Loading:', loading);
console.log('Error:', error);
```

## Additional Test Scripts

Related test scripts in the `server/` directory:
- `test-api.js` - General API testing
- `test-personalized-flow.js` - Tests personalized learning flow
- `test-quiz-any-topic.js` - Tests quiz generation
- `test-gemini-connection.js` - Tests AI connection

## Support

If issues persist after running this test:
1. Check all test output carefully
2. Review server logs for errors
3. Verify database schema matches expectations
4. Test individual endpoints with Postman/curl
5. Check that all dependencies are installed (`npm install`)
