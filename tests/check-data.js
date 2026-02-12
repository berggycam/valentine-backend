// Check what's in the backend
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://wcpysmnwsovhznvcxyyz.supabase.co';
const supabaseKey = 'sb_publishable_8Vr6irzDMBXmPDMkIHkT1g_D9wUBwpR';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkData() {
  console.log('Checking backend data...\n');
  
  try {
    // Get all proposals
    const { data: proposals, error: proposalError } = await supabase
      .from('proposals')
      .select('*');
    
    if (proposalError) {
      console.error('Error fetching proposals:', proposalError);
    } else {
      console.log(`Found ${proposals.length} proposals:`);
      proposals.slice(0, 3).forEach(p => {
        console.log(`  - ${p.fromname} -> ${p.toname} (${p.fromemail})`);
      });
    }
    
    // Get all responses
    const { data: responses, error: responseError } = await supabase
      .from('responses')
      .select('*');
    
    if (responseError) {
      console.error('Error fetching responses:', responseError);
    } else {
      console.log(`\nFound ${responses.length} responses:`);
      responses.slice(0, 3).forEach(r => {
        console.log(`  - Response from ${r.fromname} to proposal ${r.proposalid}`);
      });
    }
    
    // Test search for test@example.com
    console.log('\nSearching for test@example.com...');
    const testEmail = 'test@example.com';
    const matchingProposals = proposals.filter(p => 
      p.fromemail === testEmail || p.toemail === testEmail
    );
    console.log(`Found ${matchingProposals.length} proposals for ${testEmail}:`);
    matchingProposals.forEach(p => {
      console.log(`  - ${p.fromname} -> ${p.toname}`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkData();
