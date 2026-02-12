// Test direct database insertion
const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://wcpysmnwsovhznvcxyyz.supabase.co';
const supabaseKey = 'sb_publishable_8Vr6irzDMBXmPDMkIHkT1g_D9wUBwpR';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
  console.log('Testing direct database insertion...\n');
  
  // Test inserting a proposal with minimal fields
  const minimalProposal = {
    id: 'test-' + Date.now(),
    fromName: 'Test User',
    toName: 'Test Recipient',
    message: 'Test message'
  };
  
  console.log('Inserting minimal proposal:', minimalProposal);
  
  try {
    const { data, error } = await supabase
      .from('proposals')
      .insert([minimalProposal])
      .select();
    
    if (error) {
      console.log('❌ Error inserting minimal proposal:', error.message);
      
      // Try without emotions field
      console.log('\nTrying without emotions field...');
      const { data: data2, error: error2 } = await supabase
        .from('proposals')
        .insert([{
          id: 'test-' + Date.now() + '-2',
          fromName: 'Test User',
          toName: 'Test Recipient',
          message: 'Test message'
        }])
        .select();
      
      if (error2) {
        console.log('❌ Still error:', error2.message);
      } else {
        console.log('✅ Success with minimal fields');
      }
    } else {
      console.log('✅ Success:', data);
    }
    
    // Test querying all proposals
    console.log('\nQuerying all proposals...');
    const { data: allProposals, error: queryError } = await supabase
      .from('proposals')
      .select('*');
    
    if (queryError) {
      console.log('❌ Query error:', queryError.message);
    } else {
      console.log('✅ Found proposals:', allProposals.length);
      if (allProposals.length > 0) {
        console.log('   Columns:', Object.keys(allProposals[0]));
      }
    }
    
  } catch (error) {
    console.error('Unexpected error:', error.message);
  }
}

testInsert();
