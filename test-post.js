// Simple script to add test data to the database

// Data to be added
const testData = {
  fromName: "Test User",
  toName: "Valentine",
  message: "This is a test message from our simple script!",
  emotions: ["Love", "Happiness"],
  fromEmail: "test@example.com"
};

// Function to add data to the database
async function addProposal(data) {
  try {
    const response = await fetch('https://valentine-backend-nu.vercel.app/api/proposals', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    console.log('Status:', response.status);
    console.log('Success:', result);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Call the function with our test data
addProposal(testData);
