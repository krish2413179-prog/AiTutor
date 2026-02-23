# Requirements Document

## Introduction

This document specifies requirements for adding user state management and progress tracking to the LearnLedger backend. The system will persist user learning progress, quiz results, and gamification data tied to Solana wallet addresses, replacing the current hardcoded frontend statistics with real database-backed user profiles.

## Glossary

- **User_Profile_Service**: The backend service responsible for managing user account data
- **Progress_Tracker**: The backend service responsible for tracking learning progress per topic
- **Quiz_Results_Service**: The backend service responsible for storing and retrieving quiz performance data
- **XP_Calculator**: The component responsible for calculating experience points and user levels
- **Database_Layer**: The Supabase database tables and schema for user data persistence
- **Wallet_Address**: The Solana wallet public key used as the primary user identifier
- **Topic**: A learning module or subject area within the LearnLedger platform
- **Progress_Percentage**: An integer value from 0 to 100 representing completion status
- **XP**: Experience points awarded for completing learning activities
- **Level**: A user rank calculated from total XP (every 100 XP equals 1 level)
- **Passing_Score**: A quiz score of 70% or higher that marks a topic as completed

## Requirements

### Requirement 1: User Profile Initialization

**User Story:** As a user, I want my profile to be automatically created when I connect my wallet, so that my learning progress is tracked from my first session.

#### Acceptance Criteria

1. WHEN a wallet connection request is received at POST /api/user/init, THE User_Profile_Service SHALL create a new user record if the Wallet_Address does not exist in the users table
2. WHEN a wallet connection request is received at POST /api/user/init, THE User_Profile_Service SHALL update the last_login timestamp if the Wallet_Address already exists
3. WHEN creating a new user record, THE User_Profile_Service SHALL set total_xp to 0 and current_level to 1
4. WHEN a user profile is initialized or updated, THE User_Profile_Service SHALL return a JSON response containing the user profile data with success status
5. IF the Wallet_Address is missing or invalid, THEN THE User_Profile_Service SHALL return an error response with success set to false

### Requirement 2: User Profile Retrieval

**User Story:** As a user, I want to view my complete learning profile, so that I can see my progress, level, and achievements.

#### Acceptance Criteria

1. WHEN a GET request is received at /api/user/:walletAddress, THE User_Profile_Service SHALL retrieve the user record matching the Wallet_Address
2. THE User_Profile_Service SHALL return total_xp, current_level, count of completed topics, and recent quiz results in the response
3. IF the Wallet_Address does not exist in the database, THEN THE User_Profile_Service SHALL return an error response indicating the user was not found
4. THE User_Profile_Service SHALL return responses in the format { success: boolean, data: object, error?: string }

### Requirement 3: Learning Progress Tracking

**User Story:** As a user, I want my progress on each learning topic to be saved, so that I can resume where I left off when I reconnect my wallet.

#### Acceptance Criteria

1. WHEN a POST request is received at /api/progress/update, THE Progress_Tracker SHALL create or update a user_progress record for the specified Wallet_Address and Topic
2. THE Progress_Tracker SHALL store Progress_Percentage as an integer between 0 and 100
3. THE Progress_Tracker SHALL update the last_accessed timestamp to the current time
4. WHEN Progress_Percentage reaches 100, THE Progress_Tracker SHALL set the completed field to true
5. IF the Wallet_Address or Topic is missing, THEN THE Progress_Tracker SHALL return an error response
6. IF the Progress_Percentage is outside the range 0 to 100, THEN THE Progress_Tracker SHALL return a validation error

### Requirement 4: Progress Retrieval

**User Story:** As a user, I want to see all my learning topics and their completion status, so that I know what I've finished and what remains.

#### Acceptance Criteria

1. WHEN a GET request is received at /api/progress/:walletAddress, THE Progress_Tracker SHALL retrieve all user_progress records for the specified Wallet_Address
2. THE Progress_Tracker SHALL return a list containing topic name, Progress_Percentage, completed status, and last_accessed timestamp for each record
3. IF no progress records exist for the Wallet_Address, THEN THE Progress_Tracker SHALL return an empty list with success set to true

### Requirement 5: Quiz Results Storage

**User Story:** As a user, I want my quiz scores to be saved, so that I can track my performance over time.

#### Acceptance Criteria

1. WHEN a POST request is received at /api/quiz/save, THE Quiz_Results_Service SHALL create a quiz_results record with Wallet_Address, Topic, score, total_questions, and completed_at timestamp
2. THE Quiz_Results_Service SHALL validate that score is less than or equal to total_questions
3. IF the score or total_questions is missing or invalid, THEN THE Quiz_Results_Service SHALL return a validation error
4. THE Quiz_Results_Service SHALL store the completed_at timestamp as the current time

### Requirement 6: Topic Completion Based on Quiz Performance

**User Story:** As a user, I want topics to be automatically marked as completed when I pass a quiz, so that my progress reflects my achievements.

#### Acceptance Criteria

1. WHEN a quiz result is saved with a score that is 70% or higher of total_questions, THE Quiz_Results_Service SHALL update the user_progress record to set completed to true
2. WHEN a quiz result is saved with a score that is 70% or higher of total_questions, THE Quiz_Results_Service SHALL set Progress_Percentage to 100
3. THE Quiz_Results_Service SHALL calculate the percentage as (score / total_questions) * 100

### Requirement 7: XP Award System

**User Story:** As a user, I want to earn experience points for correct quiz answers, so that I feel rewarded for my learning efforts.

#### Acceptance Criteria

1. WHEN a quiz result is saved, THE XP_Calculator SHALL award 10 XP for each correct answer
2. THE XP_Calculator SHALL add the awarded XP to the user's total_xp in the users table
3. THE XP_Calculator SHALL return the updated total_xp value in the response

### Requirement 8: Level Calculation

**User Story:** As a user, I want my level to increase as I earn XP, so that I can see my progression through the learning platform.

#### Acceptance Criteria

1. WHEN XP is awarded, THE XP_Calculator SHALL recalculate current_level as (total_xp / 100) + 1
2. THE XP_Calculator SHALL update the current_level field in the users table
3. THE XP_Calculator SHALL return the updated current_level value in the response

### Requirement 9: Database Schema for Users

**User Story:** As a developer, I want a users table to store wallet-based profiles, so that user data persists across sessions.

#### Acceptance Criteria

1. THE Database_Layer SHALL provide a users table with wallet_address as the primary key
2. THE Database_Layer SHALL store created_at timestamp, last_login timestamp, total_xp integer, and current_level integer
3. THE Database_Layer SHALL set default values of 0 for total_xp and 1 for current_level
4. THE Database_Layer SHALL enforce that wallet_address is unique and not null

### Requirement 10: Database Schema for User Progress

**User Story:** As a developer, I want a user_progress table to track learning progress per topic, so that users can resume their learning journey.

#### Acceptance Criteria

1. THE Database_Layer SHALL provide a user_progress table with id as a UUID primary key
2. THE Database_Layer SHALL store wallet_address as a foreign key referencing users table, topic as text, Progress_Percentage as integer, completed as boolean, and last_accessed as timestamp
3. THE Database_Layer SHALL set default values of 0 for Progress_Percentage and false for completed
4. THE Database_Layer SHALL enforce foreign key constraint between wallet_address and the users table

### Requirement 11: Database Schema for Quiz Results

**User Story:** As a developer, I want a quiz_results table to store quiz performance, so that users can review their historical quiz scores.

#### Acceptance Criteria

1. THE Database_Layer SHALL provide a quiz_results table with id as a UUID primary key
2. THE Database_Layer SHALL store wallet_address as a foreign key referencing users table, topic as text, score as integer, total_questions as integer, and completed_at as timestamp
3. THE Database_Layer SHALL enforce foreign key constraint between wallet_address and the users table
4. THE Database_Layer SHALL create an index on wallet_address for query performance

### Requirement 12: Error Handling and Validation

**User Story:** As a developer, I want consistent error handling across all endpoints, so that the frontend can reliably handle failures.

#### Acceptance Criteria

1. WHEN any database operation fails, THE User_Profile_Service SHALL return a JSON response with success set to false and an error message
2. WHEN input validation fails, THE User_Profile_Service SHALL return a JSON response with success set to false and a descriptive validation error
3. THE User_Profile_Service SHALL use async/await with try-catch blocks for all database operations
4. THE User_Profile_Service SHALL log errors to the console for debugging purposes

### Requirement 13: Existing Endpoints Preservation

**User Story:** As a developer, I want existing RAG endpoints to remain unchanged, so that current functionality continues to work without disruption.

#### Acceptance Criteria

1. THE User_Profile_Service SHALL NOT modify the /api/ask endpoint
2. THE User_Profile_Service SHALL NOT modify the /api/quiz endpoint
3. THE User_Profile_Service SHALL NOT modify the /api/evaluate endpoint
4. THE User_Profile_Service SHALL add new endpoints without affecting existing route handlers

### Requirement 14: Supabase Integration

**User Story:** As a developer, I want all database operations to use Supabase client, so that the system integrates with the existing infrastructure.

#### Acceptance Criteria

1. THE Database_Layer SHALL use the Supabase client for all insert, update, select, and delete operations
2. THE Database_Layer SHALL use Supabase's built-in UUID generation for primary keys
3. THE Database_Layer SHALL use Supabase's timestamp functions for created_at, last_login, last_accessed, and completed_at fields
