/**
 * Test script to verify new unified registration works
 */

const testData = {
  userId: 'test-user-' + Date.now(),
  email: 'test@example.com',
  phone: '+919876543210'
};

console.log('🧪 Testing unified user registration...\n');
console.log('Test data:', testData);
console.log('\n📤 Send POST request to: http://localhost:5000/api/users/register');
console.log('📦 Body:', JSON.stringify(testData, null, 2));

fetch('http://localhost:5000/api/users/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(testData),
})
  .then(res => res.json())
  .then(data => {
    console.log('\n✅ Response:', JSON.stringify(data, null, 2));
    if (data.success) {
      console.log('\n🎉 Registration successful!');
      console.log('User stored in unified collection with:');
      console.log('  - Email:', data.user.email);
      console.log('  - Phone:', data.user.phone);
      console.log('  - Email Verified:', data.user.emailVerified);
      console.log('  - Phone Verified:', data.user.phoneVerified);
    } else {
      console.log('\n❌ Registration failed:', data.error || data.message);
    }
  })
  .catch(error => {
    console.error('\n❌ Error:', error.message);
    console.log('\n⚠️  Make sure backend is running: npm run dev');
  });
