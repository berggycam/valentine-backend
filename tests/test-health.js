// Test health endpoint
async function testHealth() {
  try {
    const response = await fetch('https://valentine-backend-nu.vercel.app/api');
    const text = await response.text();
    
    console.log('Status:', response.status);
    console.log('Content-Type:', response.headers.get('content-type'));
    console.log('First 500 chars:', text.substring(0, 500));
    
    if (response.headers.get('content-type')?.includes('application/json')) {
      const data = JSON.parse(text);
      console.log('✅ JSON response:', data);
    } else {
      console.log('❌ Not JSON response');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testHealth();
