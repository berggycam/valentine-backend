// Check deployment timestamp
async function checkTimestamp() {
  try {
    const response = await fetch('https://valentine-backend-nu.vercel.app/');
    const data = await response.json();
    console.log('Deployment timestamp:', data.timestamp);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkTimestamp();
