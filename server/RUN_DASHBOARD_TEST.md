# Quick Start: Dashboard API Test

## Run the Test in 2 Steps

### Step 1: Start the Server
```bash
cd server
npm start
```

Wait for the message: `Server running on http://localhost:3001`

### Step 2: Run the Test (in a new terminal)
```bash
node server/test-dashboard-api.js
```

## What You'll See

### ✅ If Everything Works:
```
=============================================================
Dashboard API Diagnostic Test
=============================================================

▶ Testing: POST /api/user/init - Initialize User
✓ User initialized successfully

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

### ❌ If Something Fails:
You'll see detailed error messages showing:
- Which endpoint failed
- The request that was sent
- The response received
- Recommendations for fixing the issue

## Common Issues

### "ECONNREFUSED"
**Problem**: Server is not running
**Solution**: Make sure you ran `npm start` in the server directory first

### "Database error"
**Problem**: Database connection issue
**Solution**: Check your `server/.env` file has correct Supabase credentials:
```
SUPABASE_URL=your-project-url
SUPABASE_KEY=your-anon-key
```

### "404 Not Found"
**Problem**: Routes not properly configured
**Solution**: Check that `server/index.js` includes:
```javascript
app.use('/api', routes);
```

## Next Steps

1. ✅ If all tests pass → Check browser console for frontend errors
2. ❌ If tests fail → Read the error messages and check the recommendations
3. 📖 For detailed info → See `DASHBOARD_API_TEST_README.md`

## Clean Up Test Data

After testing, remove test data:
```bash
node server/clear-database.js
```

Or manually in your database:
```sql
DELETE FROM user_progress WHERE wallet_address LIKE 'test-wallet-dashboard-%';
DELETE FROM users WHERE wallet_address LIKE 'test-wallet-dashboard-%';
```
