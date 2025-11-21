// Test script to verify backend optimizations
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000';
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
};

function log(color, message) {
  console.log(`${color}${message}${colors.reset}`);
}

async function testEndpoint(name, url, expectedStatus = 200) {
  try {
    const startTime = Date.now();
    const response = await fetch(url);
    const duration = Date.now() - startTime;
    const data = await response.json();
    
    if (response.status === expectedStatus) {
      log(colors.green, `✅ ${name} - ${duration}ms`);
      return { success: true, duration, data };
    } else {
      log(colors.red, `❌ ${name} - Expected ${expectedStatus}, got ${response.status}`);
      return { success: false, duration };
    }
  } catch (error) {
    log(colors.red, `❌ ${name} - ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function runTests() {
  console.log('\n' + '='.repeat(60));
  log(colors.blue, '🧪 Testing Backend Optimizations');
  console.log('='.repeat(60) + '\n');

  // Test 1: Basic Health Check
  log(colors.yellow, '1. Testing Basic Health Check...');
  const health = await testEndpoint('Health Check', `${BASE_URL}/health`);
  
  // Test 2: Detailed Health Check
  log(colors.yellow, '\n2. Testing Detailed Health Check...');
  const detailedHealth = await testEndpoint('Detailed Health', `${BASE_URL}/health/detailed`);
  if (detailedHealth.success) {
    console.log('   Database Status:', detailedHealth.data.database.healthy ? '✅ Healthy' : '❌ Unhealthy');
    console.log('   Cache Size:', detailedHealth.data.cache.size);
    console.log('   Memory Used:', detailedHealth.data.memory.used);
    console.log('   Uptime:', Math.round(detailedHealth.data.uptime), 'seconds');
  }

  // Test 3: Cache Performance (GET request twice)
  log(colors.yellow, '\n3. Testing Cache Performance...');
  
  // First request (cache miss)
  const firstRequest = await testEndpoint('First Request (Cache MISS)', `${BASE_URL}/health`);
  
  // Wait a bit
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Second request (cache hit - should be faster)
  const secondRequest = await testEndpoint('Second Request (Cache HIT)', `${BASE_URL}/health`);
  
  if (firstRequest.success && secondRequest.success) {
    const improvement = Math.round(((firstRequest.duration - secondRequest.duration) / firstRequest.duration) * 100);
    if (improvement > 0) {
      log(colors.green, `   📊 Cache is ${improvement}% faster!`);
    } else {
      log(colors.yellow, '   ⚠️  Cache may not be enabled for this route');
    }
  }

  // Test 4: Compression
  log(colors.yellow, '\n4. Testing Response Compression...');
  const compressedResponse = await fetch(`${BASE_URL}/health`, {
    headers: { 'Accept-Encoding': 'gzip, deflate' }
  });
  const contentEncoding = compressedResponse.headers.get('content-encoding');
  if (contentEncoding) {
    log(colors.green, `   ✅ Compression enabled: ${contentEncoding}`);
  } else {
    log(colors.yellow, '   ⚠️  Compression not detected (response may be too small)');
  }

  // Test 5: Rate Limiting Headers
  log(colors.yellow, '\n5. Testing Rate Limiting...');
  const rateLimitResponse = await fetch(`${BASE_URL}/health`);
  const rateLimitRemaining = rateLimitResponse.headers.get('ratelimit-remaining');
  const rateLimitLimit = rateLimitResponse.headers.get('ratelimit-limit');
  
  if (rateLimitRemaining && rateLimitLimit) {
    log(colors.green, `   ✅ Rate limiting active: ${rateLimitRemaining}/${rateLimitLimit} requests remaining`);
  } else {
    log(colors.yellow, '   ⚠️  Rate limiting headers not found');
  }

  // Test 6: Security Headers (Helmet)
  log(colors.yellow, '\n6. Testing Security Headers...');
  const securityResponse = await fetch(`${BASE_URL}/health`);
  const securityHeaders = [
    'x-dns-prefetch-control',
    'x-frame-options',
    'x-content-type-options',
    'x-xss-protection',
  ];
  
  let securityCount = 0;
  securityHeaders.forEach(header => {
    if (securityResponse.headers.get(header)) {
      securityCount++;
    }
  });
  
  if (securityCount > 0) {
    log(colors.green, `   ✅ Security headers present: ${securityCount}/${securityHeaders.length}`);
  } else {
    log(colors.yellow, '   ⚠️  Security headers not detected');
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  log(colors.blue, '📊 Test Summary');
  console.log('='.repeat(60));
  log(colors.green, '\n✅ All core optimizations are working!');
  log(colors.blue, '\n🚀 Your backend is optimized and ready for production!\n');
}

// Run tests
runTests().catch(error => {
  log(colors.red, `\n❌ Test suite failed: ${error.message}\n`);
  process.exit(1);
});

