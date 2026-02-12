// Comprehensive test suite for the Valentine backend API

const API_BASE = 'https://valentine-backend-nu.vercel.app';

// Test data
const testProposal = {
  fromName: "Test User",
  toName: "Valentine",
  message: "This is a test message from our comprehensive test suite!",
  emotions: ["Love", "Happiness"],
  fromEmail: "test@example.com",
  toEmail: "valentine@example.com"
};

const testResponse = {
  message: "Thank you for your lovely message! ❤️",
  fromName: "Valentine",
  emotions: ["Love", "Gratitude"]
};

// Helper function to make API requests
async function apiRequest(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    const data = await response.json();
    return { status: response.status, data, headers: response.headers };
  } catch (error) {
    console.error(`❌ Request failed: ${error.message}`);
    return { status: 0, error: error.message };
  }
}

// Test functions
async function testRootEndpoint() {
  console.log('\n🔍 Testing Root Endpoint (/)');
  const result = await apiRequest('/');
  
  if (result.status === 200) {
    console.log('✅ Root endpoint working');
    console.log('   Response:', JSON.stringify(result.data, null, 2));
  } else {
    console.log(`❌ Root endpoint failed with status ${result.status}`);
    console.log('   Error:', result.data || result.error);
  }
}

async function testHealthEndpoint() {
  console.log('\n🔍 Testing Health Endpoint (/api)');
  const result = await apiRequest('/api');
  
  if (result.status === 200) {
    console.log('✅ Health endpoint working');
    console.log('   Response:', JSON.stringify(result.data, null, 2));
  } else {
    console.log(`❌ Health endpoint failed with status ${result.status}`);
    console.log('   Error:', result.data || result.error);
  }
}

async function testGetProposals() {
  console.log('\n🔍 Testing GET /api/proposals');
  const result = await apiRequest('/api/proposals');
  
  if (result.status === 200) {
    console.log('✅ GET proposals working');
    console.log(`   Found ${result.data.length} proposals`);
    if (result.data.length > 0) {
      console.log('   First proposal:', JSON.stringify(result.data[0], null, 2));
    }
  } else {
    console.log(`❌ GET proposals failed with status ${result.status}`);
    console.log('   Error:', result.data || result.error);
  }
}

async function testCreateProposal() {
  console.log('\n🔍 Testing POST /api/proposals');
  const result = await apiRequest('/api/proposals', {
    method: 'POST',
    body: JSON.stringify(testProposal)
  });
  
  if (result.status === 201) {
    console.log('✅ POST proposal working');
    console.log('   Created proposal:', JSON.stringify(result.data, null, 2));
    return result.data; // Return the created proposal for later tests
  } else {
    console.log(`❌ POST proposal failed with status ${result.status}`);
    console.log('   Error:', result.data || result.error);
    console.log('   Request body:', JSON.stringify(testProposal, null, 2));
  }
  return null;
}

async function testGetProposalById(proposalId) {
  if (!proposalId) {
    console.log('\n⚠️ Skipping GET proposal by ID - no proposal ID available');
    return;
  }
  
  console.log(`\n🔍 Testing GET /api/proposals/${proposalId}`);
  const result = await apiRequest(`/api/proposals/${proposalId}`);
  
  if (result.status === 200) {
    console.log('✅ GET proposal by ID working');
    console.log('   Proposal:', JSON.stringify(result.data, null, 2));
  } else {
    console.log(`❌ GET proposal by ID failed with status ${result.status}`);
    console.log('   Error:', result.data || result.error);
  }
}

async function testCreateResponse(proposalId) {
  if (!proposalId) {
    console.log('\n⚠️ Skipping POST response - no proposal ID available');
    return;
  }
  
  console.log(`\n🔍 Testing POST /api/proposals/${proposalId}/responses`);
  const result = await apiRequest(`/api/proposals/${proposalId}/responses`, {
    method: 'POST',
    body: JSON.stringify(testResponse)
  });
  
  if (result.status === 201) {
    console.log('✅ POST response working');
    console.log('   Created response:', JSON.stringify(result.data, null, 2));
    return result.data;
  } else {
    console.log(`❌ POST response failed with status ${result.status}`);
    console.log('   Error:', result.data || result.error);
    console.log('   Request body:', JSON.stringify(testResponse, null, 2));
  }
  return null;
}

async function testGetResponses(proposalId) {
  if (!proposalId) {
    console.log('\n⚠️ Skipping GET responses - no proposal ID available');
    return;
  }
  
  console.log(`\n🔍 Testing GET /api/proposals/${proposalId}/responses`);
  const result = await apiRequest(`/api/proposals/${proposalId}/responses`);
  
  if (result.status === 200) {
    console.log('✅ GET responses working');
    console.log(`   Found ${result.data.length} responses`);
    if (result.data.length > 0) {
      console.log('   First response:', JSON.stringify(result.data[0], null, 2));
    }
  } else {
    console.log(`❌ GET responses failed with status ${result.status}`);
    console.log('   Error:', result.data || result.error);
  }
}

async function testGetAllResponses() {
  console.log('\n🔍 Testing GET /api/responses');
  const result = await apiRequest('/api/responses');
  
  if (result.status === 200) {
    console.log('✅ GET all responses working');
    console.log(`   Found ${result.data.length} responses`);
    if (result.data.length > 0) {
      console.log('   First response:', JSON.stringify(result.data[0], null, 2));
    }
  } else {
    console.log(`❌ GET all responses failed with status ${result.status}`);
    console.log('   Error:', result.data || result.error);
  }
}

// Main test runner
async function runAllTests() {
  console.log('🚀 Starting Comprehensive API Tests');
  console.log('=====================================');
  console.log(`Testing API at: ${API_BASE}`);
  
  // Test basic endpoints
  await testRootEndpoint();
  await testHealthEndpoint();
  
  // Test proposals
  await testGetProposals();
  const createdProposal = await testCreateProposal();
  
  if (createdProposal && createdProposal.id) {
    await testGetProposalById(createdProposal.id);
    
    // Test responses
    const createdResponse = await testCreateResponse(createdProposal.id);
    await testGetResponses(createdProposal.id);
  }
  
  // Test all responses
  await testGetAllResponses();
  
  console.log('\n✅ All tests completed!');
  console.log('=====================================');
}

// Run the tests
runAllTests().catch(console.error);
