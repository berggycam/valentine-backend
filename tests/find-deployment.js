// Script to find the correct deployment URL
const https = require('https');

// Common Vercel URL patterns for the backend
const possibleUrls = [
  'https://valentine-backend.vercel.app',
  'https://valentine-backend-berggycam.vercel.app',
  'https://valentine-backend-git-main-berggycam.vercel.app',
  'https://valentine-backend-nu.vercel.app', // From your error log
  'https://valentine-kohl-seven.vercel.app/api' // Testing if API is routed
];

async function checkUrl(url) {
  return new Promise((resolve) => {
    const request = https.get(url, (response) => {
      let data = '';
      response.on('data', (chunk) => data += chunk);
      response.on('end', () => {
        resolve({
          url,
          status: response.statusCode,
          contentType: response.headers['content-type'],
          isJson: response.headers['content-type']?.includes('application/json'),
          preview: data.substring(0, 200)
        });
      });
    });
    
    request.on('error', () => {
      resolve({
        url,
        status: 'ERROR',
        contentType: null,
        isJson: false,
        preview: 'Connection failed'
      });
    });
    
    request.setTimeout(5000, () => {
      request.destroy();
      resolve({
        url,
        status: 'TIMEOUT',
        contentType: null,
        isJson: false,
        preview: 'Request timed out'
      });
    });
  });
}

async function findDeployment() {
  console.log('Checking possible backend URLs...\n');
  
  for (const url of possibleUrls) {
    const result = await checkUrl(url);
    console.log(`URL: ${url}`);
    console.log(`  Status: ${result.status}`);
    console.log(`  Content-Type: ${result.contentType || 'N/A'}`);
    console.log(`  Is JSON: ${result.isJson}`);
    console.log(`  Preview: ${result.preview}\n`);
    
    if (result.status === 200 && result.isJson) {
      console.log('✅ Found working backend API at:', url);
      break;
    }
  }
}

findDeployment();
