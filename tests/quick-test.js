// Quick test to check if deployment is updated
const API_BASE = 'https://valentine-backend-nu.vercel.app';

async function quickTest() {
  console.log('Testing if deployment is updated...\n');
  
  try {
    // Test GET proposals (should work with lowercase column fix)
    const response = await fetch(`${API_BASE}/api/proposals`);
    const text = await response.text();
    
    console.log('Status:', response.status);
    console.log('Content-Type:', response.headers.get('content-type'));
    
    if (response.headers.get('content-type')?.includes('application/json')) {
      const data = JSON.parse(text);
      console.log('✅ JSON response received');
      console.log('Data:', data);
    } else {
      console.log('❌ Not JSON response');
      console.log('First 500 chars:', text.substring(0, 500));
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

quickTest();
