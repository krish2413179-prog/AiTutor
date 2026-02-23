# Implementation Plan: User Progress Tracking

## Overview

This implementation plan adds user state management and progress tracking to the LearnLedger backend. The system will persist user learning progress, quiz results, and gamification data tied to Solana wallet addresses. The implementation creates three new database tables, three service modules, and five new API endpoints while preserving all existing RAG functionality.

## Tasks

- [x] 1. Create database schema with three new tables
  - Create SQL migration file with users, user_progress, and quiz_results tables
  - Add foreign key constraints and indexes for performance
  - Include CHECK constraints for data validation
  - Run migration against Supabase database
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 10.1, 10.2, 10.3, 10.4, 11.1, 11.2, 11.3, 11.4, 14.1, 14.2, 14.3_

- [ ] 2. Create services directory and implement UserService
  - [x] 2.1 Create server/services directory structure
    - Create services folder in server directory
    - _Requirements: 13.4_
  
  - [x] 2.2 Implement UserService with profile initialization and retrieval
    - Create server/services/userService.js with ES6 module exports
    - Implement initializeUser function to create or update user on wallet connection
    - Implement getUserProfile function to retrieve user data with aggregated statistics
    - Add error handling with try-catch blocks
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 2.2, 2.3, 2.4, 12.1, 12.2, 12.3, 12.4, 14.1_
  
  - [ ]* 2.3 Write unit tests for UserService
    - Test user creation with new wallet address
    - Test user update with existing wallet address
    - Test profile retrieval with aggregated statistics
    - Test error handling for invalid inputs
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 2.2, 2.3, 2.4_

- [ ] 3. Implement ProgressService for learning progress tracking
  - [x] 3.1 Create ProgressService with update and retrieval functions
    - Create server/services/progressService.js with ES6 module exports
    - Implement updateProgress function with upsert logic
    - Implement getUserProgress function to retrieve all progress records
    - Add validation for progress percentage (0-100 range)
    - Add error handling with try-catch blocks
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 4.1, 4.2, 4.3, 12.1, 12.2, 12.3, 12.4, 14.1_
  
  - [ ]* 3.2 Write unit tests for ProgressService
    - Test progress creation for new topic
    - Test progress update for existing topic
    - Test completion status when progress reaches 100%
    - Test validation errors for invalid progress percentages
    - Test retrieval of all progress records
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 4.1, 4.2, 4.3_

- [ ] 4. Implement QuizService with XP calculation and level progression
  - [x] 4.1 Create QuizService with quiz result storage and XP awards
    - Create server/services/quizService.js with ES6 module exports
    - Implement saveQuizResult function to store quiz results
    - Implement XP calculation (10 XP per correct answer)
    - Implement level calculation (floor(total_xp / 100) + 1)
    - Implement topic completion logic (70% passing threshold)
    - Add validation for score and total questions
    - Add error handling with try-catch blocks
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 6.1, 6.2, 6.3, 7.1, 7.2, 7.3, 8.1, 8.2, 8.3, 12.1, 12.2, 12.3, 12.4, 14.1_
  
  - [ ]* 4.2 Write unit tests for QuizService
    - Test quiz result storage
    - Test XP calculation for various scores
    - Test level progression across multiple quizzes
    - Test topic completion when passing threshold is met
    - Test validation errors for invalid inputs
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 6.1, 6.2, 6.3, 7.1, 7.2, 7.3, 8.1, 8.2, 8.3_

- [x] 5. Checkpoint - Verify service implementations
  - Ensure all service modules are created and export functions correctly
  - Ensure all tests pass (if implemented)
  - Ask the user if questions arise

- [ ] 6. Add new API endpoints to routes.js
  - [x] 6.1 Import service modules at top of routes.js
    - Add ES6 imports for userService, progressService, and quizService
    - _Requirements: 13.4_
  
  - [x] 6.2 Implement POST /api/user/init endpoint
    - Add route handler with wallet address validation
    - Call initializeUser service function
    - Return standardized JSON response with success flag
    - Add error handling with appropriate status codes
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 12.1, 12.2, 12.3, 12.4_
  
  - [x] 6.3 Implement GET /api/user/:walletAddress endpoint
    - Add route handler with wallet address parameter
    - Call getUserProfile service function
    - Return user profile with aggregated statistics
    - Handle 404 error for non-existent users
    - Add error handling with appropriate status codes
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 12.1, 12.2, 12.3, 12.4_
  
  - [x] 6.4 Implement POST /api/progress/update endpoint
    - Add route handler with validation for walletAddress, topic, and progressPercentage
    - Call updateProgress service function
    - Return updated progress record
    - Add error handling with appropriate status codes
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 12.1, 12.2, 12.3, 12.4_
  
  - [x] 6.5 Implement GET /api/progress/:walletAddress endpoint
    - Add route handler with wallet address parameter
    - Call getUserProgress service function
    - Return list of progress records (empty array if none exist)
    - Add error handling with appropriate status codes
    - _Requirements: 4.1, 4.2, 4.3, 12.1, 12.2, 12.3, 12.4_
  
  - [x] 6.6 Implement POST /api/quiz/save endpoint
    - Add route handler with validation for walletAddress, topic, score, and totalQuestions
    - Call saveQuizResult service function
    - Return quiz result with XP awards and level updates
    - Add error handling with appropriate status codes
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 6.1, 6.2, 6.3, 7.1, 7.2, 7.3, 8.1, 8.2, 8.3, 12.1, 12.2, 12.3, 12.4_
  
  - [ ]* 6.7 Write integration tests for API endpoints
    - Test all five new endpoints with valid and invalid inputs
    - Test error responses and status codes
    - Test end-to-end flows (user init → progress update → quiz save)
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 2.2, 2.3, 2.4, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 4.1, 4.2, 4.3, 5.1, 5.2, 5.3, 5.4, 6.1, 6.2, 6.3, 7.1, 7.2, 7.3, 8.1, 8.2, 8.3_

- [x] 7. Verify existing RAG endpoints remain unchanged
  - Confirm /api/ask endpoint still works
  - Confirm /api/quiz endpoint still works
  - Confirm /api/evaluate endpoint still works
  - _Requirements: 13.1, 13.2, 13.3_

- [x] 8. Final checkpoint - End-to-end validation
  - Test complete user flow: wallet connect → progress tracking → quiz completion → XP/level updates
  - Verify database tables are populated correctly
  - Verify all error handling works as expected
  - Ensure all tests pass (if implemented)
  - Ask the user if questions arise

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- The implementation uses JavaScript (Node.js/Express) with ES6 modules
- All database operations use Supabase client
- Existing RAG endpoints (/api/ask, /api/quiz, /api/evaluate) must remain unchanged
- All API responses follow the format: { success: boolean, data?: object, error?: string }
- XP calculation: 10 XP per correct answer
- Level calculation: floor(total_xp / 100) + 1
- Topic completion threshold: 70% or higher quiz score
