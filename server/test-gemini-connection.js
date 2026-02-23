#!/usr/bin/env node

/**
 * Gemini API Connection Diagnostic Script
 * 
 * This script tests connectivity to Google's Gemini API and diagnoses common issues.
 * Run with: node server/test-gemini-connection.js
 */

import dotenv from 'dotenv';
import https from 'https';
import http from 'http';

dotenv.config();

// ANSI color codes for better output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function section(title) {
  console.log('\n' + '='.repeat(60));
  log(title, 'bright');
  console.log('='.repeat(60));
}

// Test 1: Check environment variables
function testEnvironment() {
  section('1. Environment Check');
  
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    log('❌ GEMINI_API_KEY not found in environment', 'red');
    log('   Make sure .env file exists with GEMINI_API_KEY=your_key', 'yellow');
    return false;
  }
  
  log('✓ GEMINI_API_KEY found', 'green');
  log(`   Length: ${apiKey.length} characters`, 'cyan');
  log(`   Preview: ${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}`, 'cyan');
  
  return apiKey;
}

// Test 2: Check network connectivity
function testNetworkConnectivity() {
  section('2. Network Connectivity Check');
  
  return new Promise((resolve) => {
    const options = {
      hostname: 'generativelanguage.googleapis.com',
      port: 443,
      path: '/',
      method: 'HEAD',
      timeout: 5000
    };
    
    log('Testing connection to generativelanguage.googleapis.com...', 'cyan');
    
    const req = https.request(options, (res) => {
      log(`✓ Successfully connected to Gemini API endpoint`, 'green');
      log(`   Status: ${res.statusCode}`, 'cyan');
      log(`   Headers: ${JSON.stringify(res.headers, null, 2)}`, 'cyan');
      resolve(true);
    });
    
    req.on('error', (error) => {
      log('❌ Network connection failed', 'red');
      log(`   Error: ${error.message}`, 'yellow');
      log(`   Code: ${error.code}`, 'yellow');
      
      if (error.code === 'ENOTFOUND') {
        log('   → DNS resolution failed. Check your internet connection.', 'yellow');
      } else if (error.code === 'ETIMEDOUT') {
        log('   → Connection timed out. Check firewall/proxy settings.', 'yellow');
      } else if (error.code === 'ECONNREFUSED') {
        log('   → Connection refused. Check if you need a proxy.', 'yellow');
      }
      
      resolve(false);
    });
    
    req.on('timeout', () => {
      log('❌ Connection timed out', 'red');
      req.destroy();
      resolve(false);
    });
    
    req.end();
  });
}

// Test 3: Test Gemini Generative Model
async function testGenerativeModel(apiKey) {
  section('3. Gemini Generative Model Test');
  
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  
  log('Testing gemini-1.5-flash model...', 'cyan');
  log(`Endpoint: ${url.replace(apiKey, 'API_KEY_HIDDEN')}`, 'cyan');
  
  const payload = {
    contents: [{
      parts: [{
        text: 'Say "Hello, API test successful!" if you can read this.'
      }]
    }]
  };
  
  return new Promise((resolve) => {
    const urlObj = new URL(url);
    const postData = JSON.stringify(payload);
    
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      },
      timeout: 10000
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const response = JSON.parse(data);
            log('✓ Generative model test PASSED', 'green');
            
            if (response.candidates && response.candidates[0]) {
              const text = response.candidates[0].content.parts[0].text;
              log(`   Response: ${text}`, 'cyan');
            }
            
            resolve(true);
          } catch (parseError) {
            log('❌ Failed to parse response', 'red');
            log(`   Error: ${parseError.message}`, 'yellow');
            log(`   Raw response: ${data.substring(0, 200)}`, 'yellow');
            resolve(false);
          }
        } else {
          log(`❌ Generative model test FAILED`, 'red');
          log(`   Status: ${res.statusCode}`, 'yellow');
          log(`   Response: ${data}`, 'yellow');
          
          try {
            const errorData = JSON.parse(data);
            if (errorData.error) {
              log(`   Error message: ${errorData.error.message}`, 'yellow');
              log(`   Error status: ${errorData.error.status}`, 'yellow');
              
              if (errorData.error.status === 'INVALID_ARGUMENT') {
                log('   → Check if your API key is correct', 'yellow');
              } else if (errorData.error.status === 'PERMISSION_DENIED') {
                log('   → API key may not have permission for this model', 'yellow');
              }
            }
          } catch (e) {
            // Response is not JSON
          }
          
          resolve(false);
        }
      });
    });
    
    req.on('error', (error) => {
      log('❌ Request failed', 'red');
      log(`   Error: ${error.message}`, 'yellow');
      log(`   Code: ${error.code}`, 'yellow');
      
      if (error.code === 'ECONNRESET') {
        log('   → Connection was reset. This might be a firewall issue.', 'yellow');
      }
      
      resolve(false);
    });
    
    req.on('timeout', () => {
      log('❌ Request timed out', 'red');
      req.destroy();
      resolve(false);
    });
    
    req.write(postData);
    req.end();
  });
}

// Test 4: Test Gemini Embedding Model
async function testEmbeddingModel(apiKey) {
  section('4. Gemini Embedding Model Test');
  
  const url = `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${apiKey}`;
  
  log('Testing text-embedding-004 model...', 'cyan');
  
  const payload = {
    model: 'models/text-embedding-004',
    content: {
      parts: [{
        text: 'Test embedding generation'
      }]
    }
  };
  
  return new Promise((resolve) => {
    const urlObj = new URL(url);
    const postData = JSON.stringify(payload);
    
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      },
      timeout: 10000
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const response = JSON.parse(data);
            log('✓ Embedding model test PASSED', 'green');
            
            if (response.embedding && response.embedding.values) {
              log(`   Embedding dimension: ${response.embedding.values.length}`, 'cyan');
              log(`   First 5 values: [${response.embedding.values.slice(0, 5).join(', ')}...]`, 'cyan');
            }
            
            resolve(true);
          } catch (parseError) {
            log('❌ Failed to parse response', 'red');
            log(`   Error: ${parseError.message}`, 'yellow');
            resolve(false);
          }
        } else {
          log(`❌ Embedding model test FAILED`, 'red');
          log(`   Status: ${res.statusCode}`, 'yellow');
          log(`   Response: ${data}`, 'yellow');
          resolve(false);
        }
      });
    });
    
    req.on('error', (error) => {
      log('❌ Request failed', 'red');
      log(`   Error: ${error.message}`, 'yellow');
      resolve(false);
    });
    
    req.on('timeout', () => {
      log('❌ Request timed out', 'red');
      req.destroy();
      resolve(false);
    });
    
    req.write(postData);
    req.end();
  });
}

// Test 5: Check proxy settings
function testProxySettings() {
  section('5. Proxy Configuration Check');
  
  const httpProxy = process.env.HTTP_PROXY || process.env.http_proxy;
  const httpsProxy = process.env.HTTPS_PROXY || process.env.https_proxy;
  const noProxy = process.env.NO_PROXY || process.env.no_proxy;
  
  if (httpProxy || httpsProxy) {
    log('Proxy settings detected:', 'yellow');
    if (httpProxy) log(`   HTTP_PROXY: ${httpProxy}`, 'cyan');
    if (httpsProxy) log(`   HTTPS_PROXY: ${httpsProxy}`, 'cyan');
    if (noProxy) log(`   NO_PROXY: ${noProxy}`, 'cyan');
    log('   → If you\'re behind a corporate proxy, this might affect connectivity', 'yellow');
  } else {
    log('✓ No proxy settings detected', 'green');
  }
}

// Main execution
async function main() {
  log('\n🔍 Gemini API Connection Diagnostic Tool', 'bright');
  log('This script will test your connection to Google\'s Gemini API\n', 'cyan');
  
  // Test 1: Environment
  const apiKey = testEnvironment();
  if (!apiKey) {
    log('\n❌ Cannot proceed without API key. Please check your .env file.', 'red');
    process.exit(1);
  }
  
  // Test 2: Network
  const networkOk = await testNetworkConnectivity();
  
  // Test 3: Generative Model
  const generativeOk = await testGenerativeModel(apiKey);
  
  // Test 4: Embedding Model
  const embeddingOk = await testEmbeddingModel(apiKey);
  
  // Test 5: Proxy
  testProxySettings();
  
  // Summary
  section('Summary');
  
  const allPassed = networkOk && generativeOk && embeddingOk;
  
  if (allPassed) {
    log('✓ All tests PASSED! Your Gemini API connection is working correctly.', 'green');
  } else {
    log('❌ Some tests FAILED. Review the errors above.', 'red');
    log('\nCommon solutions:', 'yellow');
    log('  1. Verify your API key is correct in .env file', 'cyan');
    log('  2. Check if you have internet connectivity', 'cyan');
    log('  3. Verify firewall/proxy settings aren\'t blocking the connection', 'cyan');
    log('  4. Ensure your API key has the necessary permissions', 'cyan');
    log('  5. Check if there are any regional restrictions', 'cyan');
  }
  
  console.log('\n');
  process.exit(allPassed ? 0 : 1);
}

// Run the diagnostic
main().catch((error) => {
  log('\n❌ Unexpected error occurred:', 'red');
  log(error.stack, 'yellow');
  process.exit(1);
});
