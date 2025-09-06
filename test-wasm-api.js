#!/usr/bin/env node

// Test script for WASM API endpoints
// Note: This is for reference only. The actual testing requires the Vercel Edge Runtime.

const testGenerateEndpoint = async () => {
  const url = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}/api/generate`
    : 'http://localhost:5173/api/generate';

  const payload = {
    prompt: 'Write a simple hello world function in JavaScript',
    model: 'claude-3-haiku-20240307',
    max_tokens: 100
  };

  try {
    console.log('Testing /api/generate endpoint...');
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Generate endpoint response:', result);
  } catch (error) {
    console.error('❌ Generate endpoint error:', error.message);
  }
};

const testTodoEndpoint = async () => {
  const url = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}/api/generate-todo`
    : 'http://localhost:5173/api/generate-todo';

  const payload = {
    prompt: 'Create a simple todo list component with add and remove functionality'
  };

  try {
    console.log('Testing /api/generate-todo endpoint...');
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Todo endpoint response:', result);
  } catch (error) {
    console.error('❌ Todo endpoint error:', error.message);
  }
};

async function runTests() {
  console.log('🧪 Testing WASM API Endpoints\n');
  
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn('⚠️  ANTHROPIC_API_KEY not found. Set it in your environment or Vercel dashboard.');
    console.warn('   Local: export ANTHROPIC_API_KEY=your_key_here');
    console.warn('   Vercel: Add via dashboard Environment Variables\n');
  }

  await testGenerateEndpoint();
  console.log();
  await testTodoEndpoint();
  
  console.log('\n📋 Next Steps:');
  console.log('1. Deploy to Vercel: vercel deploy');
  console.log('2. Set ANTHROPIC_API_KEY in Vercel dashboard');
  console.log('3. Test the deployed endpoints');
  console.log('4. Update your frontend to use the new API endpoints');
}

// Only run tests if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests();
}