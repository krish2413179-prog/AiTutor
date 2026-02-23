/**
 * Test script for personalized learning flow in /api/ask endpoint
 * 
 * This demonstrates:
 * 1. NEW users (no wallet) get unrestricted answers
 * 2. NEW users (with wallet but no progress) get unrestricted answers
 * 3. EXISTING users (with completed modules) only get answers about completed topics
 * 4. EXISTING users asking about uncompleted topics get restriction messages
 */

import fetch from 'node-fetch';

const API_BASE = 'http://localhost:3001/api';

// Test wallet addresses
const NEW_WALLET = '0xNewUser123456789';
const EXISTING_WALLET = '0xExistingUser123456789';

async function testNewUserNoWallet() {
  console.log('\n=== TEST 1: New User (No Wallet) ===');
  console.log('Expected: Unrestricted answer about any topic\n');
  
  const response = await fetch(`${API_BASE}/ask`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      question: 'What is a blockchain?'
    })
  });
  
  const data = await response.json();
  console.log('Question: What is a blockchain?');
  console.log('Answer:', data.answer);
}

async function testNewUserWithWallet() {
  console.log('\n=== TEST 2: New User (With Wallet, No Progress) ===');
  console.log('Expected: Unrestricted answer about any topic\n');
  
  // First initialize the user
  await fetch(`${API_BASE}/user/init`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      walletAddress: NEW_WALLET
    })
  });
  
  const response = await fetch(`${API_BASE}/ask`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      walletAddress: NEW_WALLET,
      question: 'What is a smart contract?'
    })
  });
  
  const data = await response.json();
  console.log('Question: What is a smart contract?');
  console.log('Answer:', data.answer);
}

async function testExistingUserCompletedTopic() {
  console.log('\n=== TEST 3: Existing User (Asking About Completed Topic) ===');
  console.log('Expected: Answer based on completed module content\n');
  
  // Initialize user
  await fetch(`${API_BASE}/user/init`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      walletAddress: EXISTING_WALLET
    })
  });
  
  // Mark "Blockchain Basics" as completed
  await fetch(`${API_BASE}/progress/update`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      walletAddress: EXISTING_WALLET,
      topic: 'Blockchain Basics',
      progressPercentage: 100
    })
  });
  
  const response = await fetch(`${API_BASE}/ask`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      walletAddress: EXISTING_WALLET,
      question: 'What is a blockchain?'
    })
  });
  
  const data = await response.json();
  console.log('Completed Topics: Blockchain Basics');
  console.log('Question: What is a blockchain?');
  console.log('Answer:', data.answer);
}

async function testExistingUserUncompletedTopic() {
  console.log('\n=== TEST 4: Existing User (Asking About Uncompleted Topic) ===');
  console.log('Expected: Restriction message telling them to complete the module first\n');
  
  const response = await fetch(`${API_BASE}/ask`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      walletAddress: EXISTING_WALLET,
      question: 'How do I write a Solana smart contract?'
    })
  });
  
  const data = await response.json();
  console.log('Completed Topics: Blockchain Basics (only)');
  console.log('Question: How do I write a Solana smart contract?');
  console.log('Answer:', data.answer);
}

async function runTests() {
  console.log('🧪 Testing Personalized Learning Flow');
  console.log('=====================================');
  
  try {
    await testNewUserNoWallet();
    await testNewUserWithWallet();
    await testExistingUserCompletedTopic();
    await testExistingUserUncompletedTopic();
    
    console.log('\n✅ All tests completed!');
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
  }
}

runTests();
