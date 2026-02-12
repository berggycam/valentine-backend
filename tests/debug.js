// Debug script to check server deployment
const API_BASE = 'https://valentine-kohl-seven.vercel.app';

async function checkDeployment() {
  console.log('Checking deployment status...');
  
  try {
    // Check root endpoint
    const rootResponse = await fetch(`${API_BASE}/`);
    const rootText = await rootResponse.text();
    console.log('\nRoot endpoint response:');
    console.log('Status:', rootResponse.status);
    console.log('Content-Type:', rootResponse.headers.get('content-type'));
    console.log('First 500 chars:', rootText.substring(0, 500));
    
    // Check API endpoint
    const apiResponse = await fetch(`${API_BASE}/api`);
    const apiText = await apiResponse.text();
    console.log('\nAPI endpoint response:');
    console.log('Status:', apiResponse.status);
    console.log('Content-Type:', apiResponse.headers.get('content-type'));
    console.log('First 500 chars:', apiText.substring(0, 500));
    
  } catch (error) {
    console.error('Error checking deployment:', error.message);
  }
}

checkDeployment();
