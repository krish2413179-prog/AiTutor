import { readFileSync } from 'fs';
import https from 'https';

const envContent = readFileSync('.env', 'utf-8');
const apiKeyMatch = envContent.match(/GEMINI_API_KEY=(.+)/);
const apiKey = apiKeyMatch ? apiKeyMatch[1].trim() : null;

console.log('Testing API Key:', apiKey?.substring(0, 10) + '...\n');

if (!apiKey) {
  console.log('❌ No API key found!');
  process.exit(1);
}

function testModel(modelName, isEmbedding = false) {
  return new Promise((resolve) => {
    const endpoint = isEmbedding ? 'embedContent' : 'generateContent';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:${endpoint}`;
    
    const payload = isEmbedding 
      ? JSON.stringify({ content: { parts: [{ text: 'test' }] } })
      : JSON.stringify({ contents: [{ parts: [{ text: 'Hi' }] }] });
    
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey
      }
    };
    
    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve({ success: true, status: 200 });
        } else {
          resolve({ success: false, status: res.statusCode, error: data });
        }
      });
    });
    
    req.on('error', (error) => {
      resolve({ success: false, error: error.message });
    });
    
    req.write(payload);
    req.end();
  });
}

async function testAPI() {
  const models = [
    { name: 'gemini-3-flash-preview', type: 'gen' },
    { name: 'gemini-2.5-flash', type: 'gen' },
    { name: 'gemini-1.5-flash', type: 'gen' },
    { name: 'text-embedding-004', type: 'embed' },
    { name: 'models/text-embedding-004', type: 'embed' },
    { name: 'embedding-001', type: 'embed' },
    { name: 'models/embedding-001', type: 'embed' },
    { name: 'gemini-embedding-001', type: 'embed' },
    { name: 'models/gemini-embedding-001', type: 'embed' }
  ];
  
  let workingGen = null;
  let workingEmbed = null;
  
  for (const { name, type } of models) {
    if (type === 'gen' && workingGen) continue;
    if (type === 'embed' && workingEmbed) continue;
    
    process.stdout.write(`Testing ${name.padEnd(25)} ... `);
    const result = await testModel(name, type === 'embed');
    
    if (result.success) {
      console.log('✅ WORKS!');
      if (type === 'gen') workingGen = name;
      if (type === 'embed') workingEmbed = name;
    } else {
      console.log(`❌ ${result.status || 'error'}`);
    }
  }
  
  console.log('\n' + '='.repeat(60));
  if (workingGen && workingEmbed) {
    console.log('🎉 API KEY IS WORKING!\n');
    console.log(`Generative: ${workingGen}`);
    console.log(`Embedding:  ${workingEmbed}`);
    console.log('\n✅ Update geminiClient.js with these model names');
  } else {
    console.log('❌ API KEY NOT WORKING');
  }
  console.log('='.repeat(60));
}

testAPI();
