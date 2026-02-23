/**
 * Test the simplified quiz endpoint
 * This tests that quizzes are ALWAYS generated on the exact topic requested
 * WITHOUT using the RAG pipeline or blockchain database
 */

import fetch from 'node-fetch';

const API_BASE = 'http://localhost:3001/api';

async function testSimplifiedQuiz() {
  console.log('🧪 Testing Simplified Quiz Generation\n');
  console.log('=' .repeat(60));

  const testTopics = [
    { topic: 'machine learning', description: 'Non-blockchain topic' },
    { topic: 'python programming', description: 'Programming language' },
    { topic: 'quantum physics', description: 'Science topic' },
    { topic: 'blockchain', description: 'Blockchain topic (should still work)' }
  ];

  for (const { topic, description } of testTopics) {
    console.log(`\n📝 Testing: ${topic} (${description})`);
    console.log('-'.repeat(60));

    try {
      const response = await fetch(`${API_BASE}/quiz`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topic,
          num_questions: 3
        })
      });

      const data = await response.json();

      if (data.success && data.data.questions.length > 0) {
        console.log(`✅ SUCCESS: Generated ${data.data.questions.length} questions`);
        console.log(`\nSample question:`);
        console.log(`Q: ${data.data.questions[0].question}`);
        console.log(`Options: ${data.data.questions[0].options.join(', ')}`);
        console.log(`Correct: ${data.data.questions[0].correctAnswer}`);
      } else {
        console.log(`❌ FAILED: No questions generated`);
        console.log(`Response:`, JSON.stringify(data, null, 2));
      }
    } catch (error) {
      console.log(`❌ ERROR: ${error.message}`);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('✅ Test Complete!\n');
  console.log('Expected behavior:');
  console.log('- ALL topics should generate questions');
  console.log('- Questions should be about the EXACT topic requested');
  console.log('- NO blockchain questions for non-blockchain topics');
}

// Run the test
testSimplifiedQuiz().catch(console.error);
