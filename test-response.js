// Test adding a response
const testData = {
  message: "Thank you for your lovely message! ❤️",
  fromName: "Valentine",
  emotions: ["Love", "Gratitude"]
};

async function addResponse(proposalId, data) {
  try {
    const response = await fetch(`https://valentine-backend-nu.vercel.app/api/proposals/${proposalId}/responses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    console.log('Status:', response.status);
    console.log('Result:', result);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Use the proposal ID from the test
addResponse('qs98ag69ee', testData);
