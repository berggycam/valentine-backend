// Debug the response endpoint issue
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://wcpysmnwsovhznvcxyyz.supabase.co';
const supabaseKey = 'sb_publishable_8Vr6irzDMBXmPDMkIHkT1g_D9wUBwpR';
const supabase = createClient(supabaseUrl, supabaseKey);

async function debugResponse() {
  console.log('Testing direct database insert for response...\n');
  
  try {
    // Try to insert a response directly
    const { data, error } = await supabase
      .from('responses')
      .insert([{
        proposalid: 'qs98ag69ee',
        message: 'Test response message',
        fromname: 'Test User',
        emotions: ['Love']
      }])
      .select();
    
    if (error) {
      console.log('❌ Direct insert error:', error);
      console.log('   Details:', error.details);
      console.log('   Hint:', error.hint);
      console.log('   Code:', error.code);
    } else {
      console.log('✅ Direct insert success:', data);
    }
    
    // Check if the proposal exists
    console.log('\nChecking if proposal exists...');
    const { data: proposal, error: proposalError } = await supabase
      .from('proposals')
      .select('id')
      .eq('id', 'qs98ag69ee')
      .single();
    
    if (proposalError) {
      console.log('❌ Proposal not found:', proposalError.message);
    } else {
      console.log('✅ Proposal found:', proposal);
    }
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

debugResponse();
