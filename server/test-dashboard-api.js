/**
 * Dashboard API Test Script
 * 
 * Tests all dashboard-related API endpoints to diagnose issues
 * Run with: node server/test-dashboard-api.js
 */

import http from 'http';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: './server/.env' });

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001/api';
const TEST_WALLET = 'test-wallet-dashboard-' + Date.now();

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

// Helper function to print colored output
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  console.log('\n' + '='.repeat(60));
  log(title, 'bright');
  console.log('='.repeat(60));
}

function logTest(testName) {
  log(`\n▶ Testing: ${testName}`, 'cyan');
}

function logSuccess(message) {
  log(`✓ ${message}`, 'green');
}

function logError(message) {
  log(`✗ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠ ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ ${message}`, 'blue');
}

// Helper function to make API requests using native http module
async function apiRequest(method, endpoint, body = null) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  logInfo(`Request: ${method} ${url}`);
  if (body) {
    logInfo(`Body: ${JSON.stringify(body, null, 2)}`);
  }

  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const payload = body ? JSON.stringify(body) : null;

    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || 3001,
      path: urlObj.pathname,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (payload) {
      options.headers['Content-Length'] = Buffer.byteLength(payload);
    }

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          logInfo(`Status: ${res.statusCode} ${res.statusMessage}`);
          logInfo(`Response: ${JSON.stringify(jsonData, null, 2)}`);

          resolve({
            status: res.statusCode,
            ok: res.statusCode >= 200 && res.statusCode < 300,
            data: jsonData
          });
        } catch (error) {
          logError(`Failed to parse response: ${error.message}`);
          logError(`Raw response: ${data}`);
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      logError(`Request failed: ${error.message}`);
      reject(error);
    });

    if (payload) {
      req.write(payload);
    }

    req.end();
  });
}

// Test results tracker
const testResults = {
  passed: 0,
  failed: 0,
  tests: []
};

function recordTest(name, passed, message) {
  testResults.tests.push({ name, passed, message });
  if (passed) {
    testResults.passed++;
    logSuccess(message);
  } else {
    testResults.failed++;
    logError(message);
  }
}

// Test 1: Initialize User
async function testInitializeUser() {
  logTest('POST /api/user/init - Initialize User');
  
  try {
    const response = await apiRequest('POST', '/user/init', {
      walletAddress: TEST_WALLET
    });

    if (response.ok && response.data.success) {
      const user = response.data.data;
      
      // Verify user data structure
      if (user.wallet_address === TEST_WALLET &&
          typeof user.total_xp === 'number' &&
          typeof user.current_level === 'number') {
        recordTest(
          'Initialize User',
          true,
          `User initialized successfully: ${user.wallet_address}, Level ${user.current_level}, XP ${user.total_xp}`
        );
        return user;
      } else {
        recordTest('Initialize User', false, 'User data structure is invalid');
        return null;
      }
    } else {
      recordTest('Initialize User', false, `API returned error: ${response.data.error || 'Unknown error'}`);
      return null;
    }
  } catch (error) {
    recordTest('Initialize User', false, `Exception: ${error.message}`);
    return null;
  }
}

// Test 2: Get User Profile
async function testGetUserProfile() {
  logTest('GET /api/user/:walletAddress - Get User Profile');
  
  try {
    const response = await apiRequest('GET', `/user/${TEST_WALLET}`);

    if (response.ok && response.data.success) {
      const profile = response.data.data;
      
      // Verify profile data structure
      if (profile.wallet_address === TEST_WALLET &&
          typeof profile.total_xp === 'number' &&
          typeof profile.current_level === 'number' &&
          profile.created_at &&
          profile.last_login) {
        recordTest(
          'Get User Profile',
          true,
          `Profile retrieved: Level ${profile.current_level}, XP ${profile.total_xp}`
        );
        return profile;
      } else {
        recordTest('Get User Profile', false, 'Profile data structure is invalid');
        return null;
      }
    } else {
      recordTest('Get User Profile', false, `API returned error: ${response.data.error || 'Unknown error'}`);
      return null;
    }
  } catch (error) {
    recordTest('Get User Profile', false, `Exception: ${error.message}`);
    return null;
  }
}

// Test 3: Get User Progress (Empty for New User)
async function testGetUserProgress() {
  logTest('GET /api/progress/:walletAddress - Get User Progress');
  
  try {
    const response = await apiRequest('GET', `/progress/${TEST_WALLET}`);

    if (response.ok && response.data.success) {
      const progress = response.data.data;
      
      // For a new user, progress should be an empty array
      if (Array.isArray(progress)) {
        recordTest(
          'Get User Progress',
          true,
          `Progress retrieved: ${progress.length} modules (expected 0 for new user)`
        );
        return progress;
      } else {
        recordTest('Get User Progress', false, 'Progress data is not an array');
        return null;
      }
    } else {
      recordTest('Get User Progress', false, `API returned error: ${response.data.error || 'Unknown error'}`);
      return null;
    }
  } catch (error) {
    recordTest('Get User Progress', false, `Exception: ${error.message}`);
    return null;
  }
}

// Test 4: Update Progress
async function testUpdateProgress() {
  logTest('POST /api/progress/update - Update Progress');
  
  try {
    const response = await apiRequest('POST', '/progress/update', {
      walletAddress: TEST_WALLET,
      topic: 'Blockchain Basics',
      progressPercentage: 50
    });

    if (response.ok && response.data.success) {
      const progress = response.data.data;
      
      // Verify progress data structure
      if (progress.wallet_address === TEST_WALLET &&
          progress.topic === 'Blockchain Basics' &&
          progress.progress_percentage === 50) {
        recordTest(
          'Update Progress',
          true,
          `Progress updated: ${progress.topic} - ${progress.progress_percentage}%`
        );
        return progress;
      } else {
        recordTest('Update Progress', false, 'Progress data structure is invalid');
        return null;
      }
    } else {
      recordTest('Update Progress', false, `API returned error: ${response.data.error || 'Unknown error'}`);
      return null;
    }
  } catch (error) {
    recordTest('Update Progress', false, `Exception: ${error.message}`);
    return null;
  }
}

// Test 5: Get Updated Progress
async function testGetUpdatedProgress() {
  logTest('GET /api/progress/:walletAddress - Verify Updated Progress');
  
  try {
    const response = await apiRequest('GET', `/progress/${TEST_WALLET}`);

    if (response.ok && response.data.success) {
      const progress = response.data.data;
      
      // Should now have 1 progress record
      if (Array.isArray(progress) && progress.length === 1) {
        const record = progress[0];
        if (record.topic === 'Blockchain Basics' && record.progress_percentage === 50) {
          recordTest(
            'Verify Updated Progress',
            true,
            `Progress verified: ${record.topic} - ${record.progress_percentage}%`
          );
          return progress;
        } else {
          recordTest('Verify Updated Progress', false, 'Progress data does not match expected values');
          return null;
        }
      } else {
        recordTest('Verify Updated Progress', false, `Expected 1 progress record, got ${progress.length}`);
        return null;
      }
    } else {
      recordTest('Verify Updated Progress', false, `API returned error: ${response.data.error || 'Unknown error'}`);
      return null;
    }
  } catch (error) {
    recordTest('Verify Updated Progress', false, `Exception: ${error.message}`);
    return null;
  }
}

// Test 6: Complete a Module (100% progress)
async function testCompleteModule() {
  logTest('POST /api/progress/update - Complete Module (100%)');
  
  try {
    const response = await apiRequest('POST', '/progress/update', {
      walletAddress: TEST_WALLET,
      topic: 'Blockchain Basics',
      progressPercentage: 100
    });

    if (response.ok && response.data.success) {
      const progress = response.data.data;
      
      if (progress.progress_percentage === 100 && progress.completed === true) {
        recordTest(
          'Complete Module',
          true,
          `Module completed: ${progress.topic} - ${progress.progress_percentage}%`
        );
        return progress;
      } else {
        recordTest('Complete Module', false, 'Module not marked as completed');
        return null;
      }
    } else {
      recordTest('Complete Module', false, `API returned error: ${response.data.error || 'Unknown error'}`);
      return null;
    }
  } catch (error) {
    recordTest('Complete Module', false, `Exception: ${error.message}`);
    return null;
  }
}

// Test 7: Test with Invalid Data
async function testInvalidRequests() {
  logTest('Testing Invalid Requests');
  
  let allPassed = true;

  // Test 7a: Initialize user without wallet address
  try {
    const response = await apiRequest('POST', '/user/init', {});
    if (response.status === 400) {
      logSuccess('Correctly rejected empty wallet address');
    } else {
      logError('Should reject empty wallet address');
      allPassed = false;
    }
  } catch (error) {
    logError(`Unexpected error: ${error.message}`);
    allPassed = false;
  }

  // Test 7b: Update progress without required fields
  try {
    const response = await apiRequest('POST', '/progress/update', {
      walletAddress: TEST_WALLET
    });
    if (response.status === 400) {
      logSuccess('Correctly rejected incomplete progress update');
    } else {
      logError('Should reject incomplete progress update');
      allPassed = false;
    }
  } catch (error) {
    logError(`Unexpected error: ${error.message}`);
    allPassed = false;
  }

  // Test 7c: Get profile for non-existent user
  try {
    const response = await apiRequest('GET', '/user/non-existent-wallet-12345');
    if (response.status === 404 || !response.data.success) {
      logSuccess('Correctly handled non-existent user');
    } else {
      logError('Should return error for non-existent user');
      allPassed = false;
    }
  } catch (error) {
    logError(`Unexpected error: ${error.message}`);
    allPassed = false;
  }

  recordTest('Invalid Requests', allPassed, allPassed ? 'All validation tests passed' : 'Some validation tests failed');
}

// Test 8: Test Dashboard Data Flow
async function testDashboardDataFlow() {
  logTest('Testing Complete Dashboard Data Flow');
  
  try {
    // Simulate what the Dashboard component does
    logInfo('Simulating Dashboard component behavior...');
    
    // Step 1: Initialize user
    const initResponse = await apiRequest('POST', '/user/init', {
      walletAddress: TEST_WALLET
    });
    
    if (!initResponse.ok) {
      recordTest('Dashboard Data Flow', false, 'Failed to initialize user');
      return;
    }

    // Step 2: Fetch progress and profile in parallel (like Dashboard does)
    const [progressResponse, profileResponse] = await Promise.all([
      apiRequest('GET', `/progress/${TEST_WALLET}`),
      apiRequest('GET', `/user/${TEST_WALLET}`)
    ]);

    if (!progressResponse.ok || !profileResponse.ok) {
      recordTest('Dashboard Data Flow', false, 'Failed to fetch user data in parallel');
      return;
    }

    const progress = progressResponse.data.data;
    const profile = profileResponse.data.data;

    // Verify data structure matches Dashboard expectations
    if (Array.isArray(progress) &&
        profile.wallet_address &&
        typeof profile.total_xp === 'number' &&
        typeof profile.current_level === 'number') {
      recordTest(
        'Dashboard Data Flow',
        true,
        `Dashboard data flow successful: ${progress.length} modules, Level ${profile.current_level}`
      );
    } else {
      recordTest('Dashboard Data Flow', false, 'Data structure does not match Dashboard expectations');
    }
  } catch (error) {
    recordTest('Dashboard Data Flow', false, `Exception: ${error.message}`);
  }
}

// Main test runner
async function runTests() {
  logSection('Dashboard API Diagnostic Test');
  logInfo(`API Base URL: ${API_BASE_URL}`);
  logInfo(`Test Wallet: ${TEST_WALLET}`);
  logInfo(`Timestamp: ${new Date().toISOString()}`);

  try {
    // Run all tests in sequence
    await testInitializeUser();
    await testGetUserProfile();
    await testGetUserProgress();
    await testUpdateProgress();
    await testGetUpdatedProgress();
    await testCompleteModule();
    await testInvalidRequests();
    await testDashboardDataFlow();

    // Print summary
    logSection('Test Summary');
    log(`Total Tests: ${testResults.passed + testResults.failed}`, 'bright');
    log(`Passed: ${testResults.passed}`, 'green');
    log(`Failed: ${testResults.failed}`, testResults.failed > 0 ? 'red' : 'green');

    if (testResults.failed > 0) {
      log('\nFailed Tests:', 'red');
      testResults.tests
        .filter(t => !t.passed)
        .forEach(t => {
          log(`  - ${t.name}: ${t.message}`, 'red');
        });
    }

    logSection('Diagnostic Recommendations');
    
    if (testResults.failed === 0) {
      logSuccess('All API endpoints are working correctly! ✓');
      logInfo('If the dashboard is still not working, check:');
      logInfo('  1. Frontend API service configuration (src/app/services/api.ts)');
      logInfo('  2. CORS settings in server');
      logInfo('  3. Browser console for frontend errors');
      logInfo('  4. Network tab in browser DevTools');
    } else {
      logWarning('Some API endpoints are failing. Check:');
      logInfo('  1. Database connection (Supabase credentials in .env)');
      logInfo('  2. Server is running on correct port');
      logInfo('  3. Database tables exist (users, user_progress)');
      logInfo('  4. Service files (userService.js, progressService.js)');
    }

    logSection('Next Steps');
    logInfo('1. Review the test output above to identify failing endpoints');
    logInfo('2. Check server logs for detailed error messages');
    logInfo('3. Verify database connection and table structure');
    logInfo('4. Test the dashboard in browser with DevTools open');
    logInfo(`5. Clean up test data: DELETE FROM users WHERE wallet_address = '${TEST_WALLET}'`);

  } catch (error) {
    logError(`\nTest suite failed with error: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
}

// Run the tests
runTests().catch(error => {
  logError(`Fatal error: ${error.message}`);
  console.error(error);
  process.exit(1);
});
