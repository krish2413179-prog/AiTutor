/**
 * Test script for personalized /api/ask endpoint
 * 
 * This demonstrates the three different flows:
 * 1. New user (no wallet) - gets general AI answers
 * 2. Existing user with completed modules - gets RAG answers from completed topics
 * 3. Existing user asking about uncompleted modules - gets "complete module first" message
 */

import fetch from 'node-fetch';

const API_URL = 'http://localhost:3001/api/ask';

async function testAsk(question, walletAddress = null) {
  const body = { question };
  if (walletAddress) {
    body.walletAddress = walletAddress;
  }

  console.log('\n' + '='.repeat(60));
  console.log('Question:', question);
  console.log('Wallet:', walletAddress || 'None (New User)');
  console.log('-'.repeat(60));

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    console.log('Answer:', data.answer);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

async function runTests() {
  console.log('\n🧪 Testing Personalized Learning Flow\n');

  // Test 1: New user (no wallet address)
  console.log('\n📝 TEST 1: New User Flow (No Wallet)');
  await testAsk('What is linear regression?');

  // Test 2: New user asking about blockchain
  console.log('\n📝 TEST 2: New User Flow - Blockchain Question');
  await testAsk('What is blockchain?');

  // Test 3: Existing user with completed modules
  // Note: Replace with actual wallet address from your database
  console.log('\n📝 TEST 3: Existing User with Completed Modules');
  await testAsk('What is blockchain?', 'EXAMPLE_WALLET_ADDRESS_123');

  // Test 4: Existing user asking about uncompleted module
  console.log('\n📝 TEST 4: Existing User - Uncompleted Module');
  await testAsk('What is machine learning?', 'EXAMPLE_WALLET_ADDRESS_123');

  console.log('\n' + '='.repeat(60));
  console.log('✅ Tests completed!\n');
}

// Run tests
runTests().catch(console.error);
