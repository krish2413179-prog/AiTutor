# QuizService Implementation - Task 4.1 Complete

## Overview

Task 4.1 has been successfully completed. The QuizService has been implemented with all required functionality for quiz result storage, XP awards, level calculations, and topic completion logic.

## Implementation Details

### File Created
- **Location**: `server/services/quizService.js`
- **Module Type**: ES6 module with named exports
- **Function**: `saveQuizResult(walletAddress, topic, score, totalQuestions)`

### Requirements Implemented

#### ✅ Requirement 5.1, 5.2, 5.3, 5.4 - Quiz Results Storage
- Creates quiz_results record with wallet_address, topic, score, total_questions, and completed_at timestamp
- Validates that score is less than or equal to total_questions
- Validates that score is non-negative
- Validates that total_questions is positive
- Stores completed_at timestamp as current time

#### ✅ Requirement 6.1, 6.2, 6.3 - Topic Completion Based on Quiz Performance
- Calculates percentage as (score / total_questions) * 100
- Updates user_progress record to set completed to true when score is 70% or higher
- Sets progress_percentage to 100 when quiz is passed
- Uses upsert to handle both new and existing progress records

#### ✅ Requirement 7.1, 7.2, 7.3 - XP Award System
- Awards 10 XP for each correct answer
- Adds awarded XP to user's total_xp in the users table
- Returns updated total_xp value in the response

#### ✅ Requirement 8.1, 8.2, 8.3 - Level Calculation
- Recalculates current_level as Math.floor(total_xp / 100) + 1
- Updates current_level field in the users table
- Returns updated current_level value in the response

#### ✅ Requirement 12.1, 12.2, 12.3, 12.4 - Error Handling and Validation
- Uses async/await with try-catch blocks for all database operations
- Returns descriptive error messages for validation failures
- Logs errors to console for debugging
- Throws errors for database operation failures

#### ✅ Requirement 14.1 - Supabase Integration
- Uses Supabase client for all database operations
- Uses Supabase's built-in UUID generation for primary keys
- Uses Supabase's timestamp functions for completed_at and last_accessed fields

## Code Structure

### Function Signature
```javascript
export async function saveQuizResult(walletAddress, topic, score, totalQuestions)
```

### Validation Logic
1. Score cannot exceed total questions
2. Score cannot be negative
3. Total questions must be positive

### XP Calculation
```javascript
const xpAwarded = score * 10;
```

### Level Calculation
```javascript
const newLevel = Math.floor(newTotalXp / 100) + 1;
```

### Topic Completion Logic
```javascript
const percentage = (score / totalQuestions) * 100;
const passed = percentage >= 70;
```

### Return Value
```javascript
{
  quiz_result: {
    id: "uuid",
    wallet_address: "string",
    topic: "string",
    score: number,
    total_questions: number,
    completed_at: "timestamp"
  },
  xp_awarded: number,
  new_total_xp: number,
  new_level: number,
  passed: boolean
}
```

## Testing

### Test Script Created
- **Location**: `server/test-quiz-service.js`
- **Purpose**: Comprehensive testing of all QuizService functionality

### Test Cases Covered
1. ✅ Quiz result with passing score (80%)
2. ✅ Quiz result with failing score (60%)
3. ✅ Level progression across multiple quizzes
4. ✅ Validation error when score exceeds total
5. ✅ Validation error for negative score
6. ✅ Edge case: exactly 70% (passing threshold)

### Test Verification
The test script verifies:
- XP calculation: 10 XP per correct answer
- Level calculation: floor(total_xp / 100) + 1
- Topic completion: 70% threshold
- Validation: score and total questions
- Error handling: try-catch blocks

### Running Tests
```bash
cd server
node test-quiz-service.js
```

**Note**: Tests require the database migration to be run first. See MIGRATION_INSTRUCTIONS.md for details.

## Integration with Other Services

### Dependencies
- `supabaseClient.js` - Database connection
- `users` table - For XP and level updates
- `quiz_results` table - For storing quiz results
- `user_progress` table - For marking topic completion

### Used By
- Will be used by route handlers in `routes.js` (Task 6.6)
- POST /api/quiz/save endpoint

## Examples

### Example 1: Passing Quiz (80%)
```javascript
const result = await saveQuizResult(
  '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
  'Blockchain Basics',
  8,
  10
);

// Result:
// {
//   quiz_result: { score: 8, total_questions: 10, ... },
//   xp_awarded: 80,
//   new_total_xp: 80,
//   new_level: 1,
//   passed: true
// }
```

### Example 2: Failing Quiz (60%)
```javascript
const result = await saveQuizResult(
  '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
  'Smart Contracts',
  6,
  10
);

// Result:
// {
//   quiz_result: { score: 6, total_questions: 10, ... },
//   xp_awarded: 60,
//   new_total_xp: 140,
//   new_level: 2,
//   passed: false
// }
```

### Example 3: Level Progression
Starting with 0 XP (Level 1):
- Quiz 1: 8/10 = 80 XP → Total: 80 XP → Level 1
- Quiz 2: 6/10 = 60 XP → Total: 140 XP → Level 2
- Quiz 3: 10/10 = 100 XP → Total: 240 XP → Level 3

## Next Steps

1. ✅ Task 4.1 is complete
2. Continue with Task 4.2: Write unit tests for QuizService (optional)
3. Continue with Task 6.6: Implement POST /api/quiz/save endpoint in routes.js

## Prerequisites

Before using this service, ensure:
1. Database migration has been run (Task 1)
2. Users table exists and is populated
3. User has been initialized via UserService

## Notes

- The service uses ES6 module syntax (import/export)
- All database operations are wrapped in try-catch blocks
- Error messages are descriptive and logged to console
- The service follows the same pattern as UserService and ProgressService
- Topic completion is automatic when passing threshold is met
- The service handles both new and existing progress records via upsert

