import { GoogleGenerativeAI } from '@google/generative-ai';
import { readFileSync } from 'fs';

const envContent = readFileSync('.env', 'utf-8');
const apiKeyMatch = envContent.match(/GEMINI_API_KEY=(.+)/);
const apiKey = apiKeyMatch ? apiKeyMatch[1].trim() : null;

console.log('Testing API Key:', apiKey?.substring(0, 10) + '...\n');

if (!apiKey) {
  console.log('❌ No API key found in .env file!');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function testAPI() {
  const models = [
    { name: 'gemini-1.5-flash', type: 'generative' },
    { name: 'gemini-1.5-pro', type: 'generative' },
    { name: 'gemini-pro', type: 'generative' },
    { name: 'text-embedding-004', type: 'embedding' },
    { name: 'models/text-embedding-004', type: 'embedding' }
  ];
  
  let workingGen = null;
  let workingEmbed = null;
  
  for (const { name, type } of models) {
    if (type === 'generative' && workingGen) continue;
    if (type === 'embedding' && workingEmbed) continue;
    
    try {
      process.stdout.write(`Testing ${name}... `);
      const model = genAI.getGenerativeModel({ model: name });
      
      if (type === 'generative') {
        const result = await model.generateContent('Hi');
        const text = result.response.text();
        console.log(`✅ WORKS! "${text.substring(0, 30)}..."`);
        workingGen = name;
      } else {
        const result = await model.embedContent('test');
        console.log(`✅ WORKS! (${result.embedding.values.length}D)`);
        workingEmbed = name;
      }
    } catch (error) {
      console.log(`❌ ${error.status || 'error'}`);
    }
  }
  
  console.log('\n' + '='.repeat(60));
  if (workingGen && workingEmbed) {
    console.log('🎉 API KEY IS WORKING!\n');
    console.log(`Generative: ${workingGen}`);
    console.log(`Embedding:  ${workingEmbed}`);
    console.log('\n✅ You can now start the server with: npm start');
  } else {
    console.log('❌ API KEY NOT WORKING\n');
    console.log('Get a new key from: https://aistudio.google.com/apikey');
  }
  console.log('='.repeat(60));
}

testAPI();
