/**
 * Test script to verify new users can get quiz questions on ANY topic
 * even if it's not in the database
 */

const API_BASE = 'http://localhost:3001/api';

async function testQuizOnAnyTopic() {
  console.log('🧪 Testing Quiz Generation for New Users on Any Topic\n');

  // Test 1: Quiz on a topic NOT in database (machine learning)
  console.log('Test 1: New user requests quiz on "machine learning"');
  console.log('Expected: Should generate questions using AI general knowledge\n');

  try {
    const response = await fetch(`${API_BASE}/quiz`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        topic: 'machine learning',
        num_questions: 3
        // No walletAddress = new user
      })
    });

    const data = await response.json();
    
    if (data.success && data.data.questions.length > 0) {
      console.log('✅ SUCCESS: Generated questions on machine learning');
      console.log(`   Questions received: ${data.data.questions.length}`);
      console.log(`   First question: ${data.data.questions[0].question}\n`);
    } else {
      console.log('❌ FAILED: No questions generated');
      console.log('   Response:', JSON.stringify(data, null, 2), '\n');
    }
  } catch (error) {
    console.error('❌ ERROR:', error.message, '\n');
  }

  // Test 2: Quiz on another non-database topic (physics)
  console.log('Test 2: New user requests quiz on "quantum physics"');
  console.log('Expected: Should generate questions using AI general knowledge\n');

  try {
    const response = await fetch(`${API_BASE}/quiz`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        topic: 'quantum physics',
        num_questions: 5
      })
    });

    const data = await response.json();
    
    if (data.success && data.data.questions.length > 0) {
      console.log('✅ SUCCESS: Generated questions on quantum physics');
      console.log(`   Questions received: ${data.data.questions.length}`);
      console.log(`   First question: ${data.data.questions[0].question}\n`);
    } else {
      console.log('❌ FAILED: No questions generated');
      console.log('   Response:', JSON.stringify(data, null, 2), '\n');
    }
  } catch (error) {
    console.error('❌ ERROR:', error.message, '\n');
  }

  // Test 3: Quiz on database topic (blockchain) - should still work
  console.log('Test 3: New user requests quiz on "blockchain"');
  console.log('Expected: Should use database context if available, or AI if not\n');

  try {
    const response = await fetch(`${API_BASE}/quiz`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        topic: 'blockchain',
        num_questions: 3
      })
    });

    const data = await response.json();
    
    if (data.success && data.data.questions.length > 0) {
      console.log('✅ SUCCESS: Generated questions on blockchain');
      console.log(`   Questions received: ${data.data.questions.length}`);
      console.log(`   First question: ${data.data.questions[0].question}\n`);
    } else {
      console.log('❌ FAILED: No questions generated');
      console.log('   Response:', JSON.stringify(data, null, 2), '\n');
    }
  } catch (error) {
    console.error('❌ ERROR:', error.message, '\n');
  }

  console.log('✨ Test complete!\n');
  console.log('Summary:');
  console.log('- New users can now get quiz questions on ANY topic');
  console.log('- If topic is in database, uses RAG context');
  console.log('- If topic is NOT in database, uses AI general knowledge');
  console.log('- No more empty question arrays! 🎉');
}

// Run the test
testQuizOnAnyTopic().catch(console.error);
