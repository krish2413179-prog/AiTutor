# End-to-End Validation Checklist
## User Progress Tracking System

This checklist validates the complete user progress tracking implementation.

## Prerequisites
✅ Database migration completed (tables created)
✅ Server dependencies installed (`npm install`)
✅ Environment variables configured (`.env` file)
✅ Supabase connection working

---

## 1. Database Schema Validation

### Tables Created
- [ ] `users` table exists
- [ ] `user_progress` table exists
- [ ] `quiz_results` table exists

### Indexes Created
- [ ] `idx_users_level` on users(current_level)
- [ ] `idx_users_xp` on users(total_xp)
- [ ] `idx_user_progress_wallet` on user_progress(wallet_address)
- [ ] `idx_user_progress_completed` on user_progress(completed)
- [ ] `idx_user_progress_last_accessed` on user_progress(last_accessed)
- [ ] `idx_quiz_results_wallet` on quiz_results(wallet_address)
- [ ] `idx_quiz_results_topic` on quiz_results(topic)
- [ ] `idx_quiz_results_completed_at` on quiz_results(completed_at)

### Constraints
- [ ] Foreign key: user_progress.wallet_address → users.wallet_address
- [ ] Foreign key: quiz_results.wallet_address → users.wallet_address
- [ ] Unique constraint: (wallet_address, topic) in user_progress
- [ ] Check constraint: progress_percentage between 0 and 100
- [ ] Check constraint: score <= total_questions

**Verification Command:**
```bash
node run-migration.js
```

---

## 2. Service Layer Validation

### UserService (`server/services/userService.js`)
- [ ] `initializeUser()` function exists
- [ ] Creates new user with default values (XP=0, Level=1)
- [ ] Updates last_login for existing users
- [ ] `getUserProfile()` function exists
- [ ] Returns user with aggregated statistics
- [ ] Includes completed_topics count
- [ ] Includes recent_quizzes (last 5)

### ProgressService (`server/services/progressService.js`)
- [ ] `updateProgress()` function exists
- [ ] Validates progress percentage (0-100)
- [ ] Upserts progress records
- [ ] Sets completed=true when progress=100
- [ ] `getUserProgress()` function exists
- [ ] Returns all progress records for user
- [ ] Returns empty array if no records

### QuizService (`server/services/quizService.js`)
- [ ] `saveQuizResult()` function exists
- [ ] Validates score <= total_questions
- [ ] Calculates XP (10 per correct answer)
- [ ] Updates user total_xp and level
- [ ] Calculates level: floor(total_xp / 100) + 1
- [ ] Checks passing threshold (70%)
- [ ] Marks topic as completed if passed

**Verification:** Review code files or run unit tests

---

## 3. API Endpoints Validation

### POST /api/user/init
- [ ] Endpoint exists in routes.js
- [ ] Accepts walletAddress in request body
- [ ] Validates walletAddress is non-empty string
- [ ] Creates new user on first connection
- [ ] Updates last_login on subsequent connections
- [ ] Returns user profile data
- [ ] Returns error for invalid input

**Test Command:**
```bash
node test-user-init.js
```

### GET /api/user/:walletAddress
- [ ] Endpoint exists in routes.js
- [ ] Retrieves user profile by wallet address
- [ ] Returns aggregated statistics
- [ ] Returns 404 for non-existent user
- [ ] Returns error for database failures

**Test Command:**
```bash
node test-user-profile.js
```

### POST /api/progress/update
- [ ] Endpoint exists in routes.js
- [ ] Accepts walletAddress, topic, progressPercentage
- [ ] Validates all required fields
- [ ] Validates progressPercentage is number
- [ ] Creates or updates progress record
- [ ] Returns updated progress data
- [ ] Returns error for invalid input

**Test Command:**
```bash
node test-progress-update.js
```

### GET /api/progress/:walletAddress
- [ ] Endpoint exists in routes.js
- [ ] Retrieves all progress records for user
- [ ] Returns empty array if no records
- [ ] Orders by last_accessed (descending)
- [ ] Returns error for database failures

**Test Command:**
```bash
node test-progress-get.js
```

### POST /api/quiz/save
- [ ] Endpoint exists in routes.js
- [ ] Accepts walletAddress, topic, score, totalQuestions
- [ ] Validates all required fields
- [ ] Validates score and totalQuestions are numbers
- [ ] Saves quiz result to database
- [ ] Awards XP (10 per correct answer)
- [ ] Updates user level
- [ ] Marks topic completed if score >= 70%
- [ ] Returns quiz result with XP/level updates
- [ ] Returns error for invalid input

**Test Command:**
```bash
node test-quiz-save-endpoint.js
```

---

## 4. Existing RAG Endpoints (Unchanged)

### POST /api/ask
- [ ] Endpoint still works
- [ ] Returns answers based on context
- [ ] No changes to functionality

### POST /api/quiz
- [ ] Endpoint still works
- [ ] Generates quiz questions
- [ ] No changes to functionality

### POST /api/evaluate
- [ ] Endpoint still works
- [ ] Evaluates student answers
- [ ] No changes to functionality

**Test Command:**
```bash
node verify-rag-endpoints-unchanged.js
```

---

## 5. End-to-End User Flow

### Complete User Journey
- [ ] User connects wallet → Profile initialized
- [ ] User starts learning → Progress tracked
- [ ] User completes quiz → Results saved
- [ ] XP awarded correctly (10 per correct answer)
- [ ] Level calculated correctly (floor(XP/100) + 1)
- [ ] Topic marked completed if score >= 70%
- [ ] User profile shows updated statistics
- [ ] Database tables populated correctly

**Test Command:**
```bash
node test-e2e-user-flow.js
```

### Expected Flow Results
- [ ] New user starts at Level 1, 0 XP
- [ ] Quiz with 8/10 correct → 80 XP awarded
- [ ] Quiz with 10/10 correct → 100 XP awarded, total 180 XP, Level 2
- [ ] Passing quiz (≥70%) marks topic completed
- [ ] Failing quiz (<70%) does NOT mark topic completed
- [ ] Multiple quizzes increase level progressively
- [ ] User profile aggregates all data correctly

---

## 6. Error Handling Validation

### Input Validation
- [ ] Empty wallet address rejected
- [ ] Invalid progress percentage (>100) rejected
- [ ] Invalid progress percentage (<0) rejected
- [ ] Score > total_questions rejected
- [ ] Negative score rejected
- [ ] Zero total_questions rejected
- [ ] Missing required fields rejected

### Database Error Handling
- [ ] Non-existent user returns 404
- [ ] Database connection errors handled
- [ ] Foreign key violations handled
- [ ] Constraint violations handled
- [ ] All errors return proper JSON format

### Error Response Format
- [ ] All errors return: `{ success: false, error: "message" }`
- [ ] Appropriate HTTP status codes used
- [ ] Errors logged to console

---

## 7. Data Integrity Validation

### Foreign Key Constraints
- [ ] Cannot create progress without user
- [ ] Cannot create quiz result without user
- [ ] Deleting user cascades to progress records
- [ ] Deleting user cascades to quiz results

### Data Consistency
- [ ] XP calculation matches: correct_answers × 10
- [ ] Level calculation matches: floor(total_xp / 100) + 1
- [ ] Completion threshold: score/total × 100 >= 70
- [ ] Progress percentage stays within 0-100
- [ ] Timestamps auto-populate correctly

### Unique Constraints
- [ ] One progress record per (wallet, topic) pair
- [ ] Multiple quiz attempts allowed per topic
- [ ] Wallet address is unique in users table

---

## 8. Performance Validation

### Query Performance
- [ ] User profile retrieval is fast (<100ms)
- [ ] Progress retrieval is fast (<100ms)
- [ ] Quiz save operation is fast (<200ms)
- [ ] Indexes improve query performance

### Concurrent Operations
- [ ] Multiple users can be created simultaneously
- [ ] Progress updates don't conflict
- [ ] Quiz saves are atomic

---

## 9. Integration with Frontend

### API Response Format
- [ ] All responses follow: `{ success: boolean, data?: object, error?: string }`
- [ ] Success responses include data object
- [ ] Error responses include error message
- [ ] JSON format is consistent

### Frontend Integration Points
- [ ] Wallet connect triggers /api/user/init
- [ ] Module progress updates call /api/progress/update
- [ ] Quiz completion calls /api/quiz/save
- [ ] Dashboard fetches /api/user/:walletAddress
- [ ] Progress page fetches /api/progress/:walletAddress

---

## 10. Documentation Validation

### Code Documentation
- [ ] All service functions have JSDoc comments
- [ ] All route handlers have descriptive comments
- [ ] Complex logic is explained
- [ ] Error handling is documented

### API Documentation
- [ ] Request/response formats documented
- [ ] Error codes documented
- [ ] Example requests provided
- [ ] Example responses provided

### Migration Documentation
- [ ] Migration SQL is well-commented
- [ ] Migration guide exists
- [ ] Rollback instructions provided (if needed)

---

## Summary

### Quick Validation Commands

Run all tests in sequence:
```bash
cd server

# 1. Verify migration
node run-migration.js

# 2. Test individual endpoints
node test-user-init.js
node test-user-profile.js
node test-progress-update.js
node test-progress-get.js
node test-quiz-save-endpoint.js

# 3. Verify RAG endpoints unchanged
node verify-rag-endpoints-unchanged.js

# 4. Run end-to-end test
node test-e2e-user-flow.js
```

### Success Criteria

✅ All database tables created with proper schema
✅ All service functions implemented and working
✅ All API endpoints responding correctly
✅ Existing RAG endpoints unchanged
✅ End-to-end user flow works completely
✅ Error handling works as expected
✅ Data integrity maintained
✅ Performance is acceptable

---

## Sign-Off

- [ ] Database schema validated
- [ ] Service layer validated
- [ ] API endpoints validated
- [ ] RAG endpoints unchanged
- [ ] End-to-end flow validated
- [ ] Error handling validated
- [ ] Data integrity validated
- [ ] Documentation complete

**Validated by:** _________________
**Date:** _________________
**Notes:** _________________
