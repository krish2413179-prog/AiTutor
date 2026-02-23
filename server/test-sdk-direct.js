import { GoogleGenerativeAI } from '@google/generative-ai';
import { readFileSync } from 'fs';

const envContent = readFileSync('.env', 'utf-8');
const apiKeyMatch = envContent.match(/GEMINI_API_KEY=(.+)/);
const apiKey = apiKeyMatch ? apiKeyMatch[1].trim() : null;

console.log('Testing API Key:', apiKey?.substring(0, 10) + '...\n');
console.log('Full API Key:', apiKey);
console.log('API Key Length:', apiKey?.length);
console.log('\n');

const genAI = new GoogleGenerativeAI(apiKey);

async function testSDK() {
  console.log('Testing with SDK...\n');
  
  // Test generative model
  try {
    console.log('Testing gemini-3-flash-preview...');
    const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });
    const result = await model.generateContent('Hi');
    const text = result.response.text();
    console.log('✅ Generative model works!', text.substring(0, 30));
  } catch (error) {
    console.log('❌ Generative model failed:', error.message);
  }
  
  // Test embedding model
  try {
    console.log('\nTesting gemini-embedding-001...');
    const embedModel = genAI.getGenerativeModel({ model: 'gemini-embedding-001' });
    const embedResult = await embedModel.embedContent('test');
    console.log('✅ Embedding model works! Dimension:', embedResult.embedding.values.length);
  } catch (error) {
    console.log('❌ Embedding model failed:', error.message);
    console.log('Error status:', error.status);
    console.log('Error details:', JSON.stringify(error.errorDetails, null, 2));
  }
}

testSDK();
