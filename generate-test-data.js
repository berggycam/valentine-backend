const { createClient } = require('@supabase/supabase-js');
const { faker } = require('@faker-js/faker');

// Supabase configuration (using the same hardcoded credentials as other files)
const supabaseUrl = 'https://wcpysmnwsovhznvcxyyz.supabase.co';
const supabaseKey = 'sb_publishable_8Vr6irzDMBXmPDMkIHkT1g_D9wUBwpR';
const supabase = createClient(supabaseUrl, supabaseKey);

// Emotion options for proposals and responses
const emotionsList = ["Love", "Happiness", "Passion", "Excitement", "Nervousness", "Joy", "Hope", "Adoration", "Gratitude", "Affection"];

// Common first names for generating random names
const firstNames = [
  'James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda',
  'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica',
  'Thomas', 'Sarah', 'Charles', 'Karen', 'Christopher', 'Nancy', 'Daniel', 'Lisa',
  'Matthew', 'Margaret', 'Anthony', 'Betty', 'Donald', 'Sandra', 'Mark', 'Ashley'
];

// Common email domains
const emailDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com'];

// Generate a random date within the last 30 days
function randomDate() {
  const now = new Date();
  const pastDate = new Date();
  pastDate.setDate(now.getDate() - 30);
  return new Date(pastDate.getTime() + Math.random() * (now.getTime() - pastDate.getTime()));
}

// Generate a random proposal
async function generateProposal() {
  const fromName = faker.helpers.arrayElement(firstNames);
  const toName = faker.helpers.arrayElement(firstNames.filter(name => name !== fromName));
  
  // Generate a random message with sections
  const howWeMet = [
    `We met at ${faker.company.name()}`,
    `We've known each other since ${faker.date.past().getFullYear()}`,
    `We met through ${faker.name.jobTitle().toLowerCase()}`,
    `We first crossed paths at a ${faker.word.adjective()} ${faker.word.noun()}`
  ];
  
  const whatILove = [
    `your ${faker.word.adjective()} smile`,
    `how you always ${faker.word.verb()} when you're ${faker.word.adverb()}`,
    `your ${faker.word.adjective()} personality`,
    `the way you ${faker.word.verb()} when you're ${faker.word.adjective()}`
  ];
  
  const howYouMakeMeFeel = [
    `like I'm ${faker.word.adverb()} ${faker.word.adjective()}`,
    `${faker.word.adjective()} and ${faker.word.adjective()}`,
    `like I can ${faker.word.verb()} anything`,
    `${faker.word.adjective()} in ways I can't explain`
  ];
  
  const message = `How we met: ${faker.helpers.arrayElement(howWeMet)}\n\n` +
                `What I love about you: ${faker.helpers.arrayElement(whatILove)}\n\n` +
                `How you make me feel: ${faker.helpers.arrayElement(howYouMakeMeFeel)}\n\n` +
                `My Valentine's message: ${faker.lorem.sentences(2)}`;
  
  // Randomly select 1-3 emotions
  const emotions = faker.helpers.arrayElements(
    emotionsList, 
    faker.datatype.number({ min: 1, max: 3 })
  );
  
  // Generate email in the format firstname.lastname@domain
  const fromEmail = `${fromName.toLowerCase()}.${faker.name.lastName().toLowerCase()}` +
                   `@${faker.helpers.arrayElement(emailDomains)}`;
  
  const toEmail = `${toName.toLowerCase()}.${faker.name.lastName().toLowerCase()}` +
                 `@${faker.helpers.arrayElement(emailDomains)}`;
  
  const proposal = {
    id: faker.datatype.uuid(),
    fromName,
    toName,
    message,
    emotions,
    fromEmail,
    toEmail,
    createdAt: randomDate().toISOString()
  };
  
  return proposal;
}

// Generate a random response for a proposal
function generateResponse(proposalId) {
  const responseEmotions = faker.helpers.arrayElements(
    emotionsList, 
    faker.datatype.number({ min: 1, max: 2 })
  );
  
  const responseTemplates = [
    `I feel the same way! ${faker.lorem.sentence()}`,
    `Thank you for your sweet words. ${faker.lorem.sentence()}`,
    `You make me so happy! ${faker.lorem.sentence()}`,
    `I've been waiting for this moment. ${faker.lorem.sentence()}`,
    `This means so much to me. ${faker.lorem.sentence()}`
  ];
  
  return {
    id: faker.datatype.uuid(),
    proposalId,
    message: faker.helpers.arrayElement(responseTemplates),
    fromName: proposalId.toName, // Responding as the recipient
    emotions: responseEmotions,
    createdAt: new Date().toISOString() // Response is always now
  };
}

// Main function to generate and insert test data
async function generateTestData(numProposals = 10) {
  try {
    console.log(`Generating ${numProposals} test proposals and responses...`);
    
    // Generate proposals
    const proposals = [];
    for (let i = 0; i < numProposals; i++) {
      const proposal = await generateProposal();
      proposals.push(proposal);
    }
    
    // Insert proposals
    console.log('Inserting proposals...');
    const { data: insertedProposals, error: proposalError } = await supabase
      .from('proposals')
      .insert(proposals);
    
    if (proposalError) {
      throw new Error(`Error inserting proposals: ${proposalError.message}`);
    }
    
    console.log(`Successfully inserted ${proposals.length} proposals`);
    
    // For each proposal, generate 0-2 responses
    const responses = [];
    for (const proposal of proposals) {
      const numResponses = Math.floor(Math.random() * 3); // 0, 1, or 2 responses
      
      for (let i = 0; i < numResponses; i++) {
        const response = generateResponse(proposal.id);
        responses.push(response);
      }
    }
    
    // Insert responses if there are any
    if (responses.length > 0) {
      console.log(`Inserting ${responses.length} responses...`);
      const { data: insertedResponses, error: responseError } = await supabase
        .from('responses')
        .insert(responses);
      
      if (responseError) {
        throw new Error(`Error inserting responses: ${responseError.message}`);
      }
      
      console.log(`Successfully inserted ${responses.length} responses`);
    } else {
      console.log('No responses to insert.');
    }
    
    console.log('Test data generation complete!');
    console.log(`Total: ${proposals.length} proposals, ${responses.length} responses`);
    
  } catch (error) {
    console.error('Error generating test data:', error.message);
  }
}

// Get number of proposals from command line argument or use default (10)
const numProposals = process.argv[2] ? parseInt(process.argv[2], 10) : 10;

// Run the generator
generateTestData(numProposals);
