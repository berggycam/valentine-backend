// Script to check database schema
const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://wcpysmnwsovhznvcxyyz.supabase.co';
const supabaseKey = 'sb_publishable_8Vr6irzDMBXmPDMkIHkT1g_D9wUBwpR';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  console.log('Checking database schema...\n');
  
  try {
    // Check proposals table structure
    console.log('Checking proposals table...');
    const { data: proposalsData, error: proposalsError } = await supabase
      .from('proposals')
      .select('*')
      .limit(1);
    
    if (proposalsError) {
      console.log('❌ Error accessing proposals:', proposalsError.message);
    } else {
      console.log('✅ Proposals table accessible');
      if (proposalsData.length > 0) {
        console.log('   Columns:', Object.keys(proposalsData[0]));
        console.log('   Sample row:', JSON.stringify(proposalsData[0], null, 2));
      } else {
        console.log('   Table is empty, but accessible');
      }
    }
    
    // Check responses table structure
    console.log('\nChecking responses table...');
    const { data: responsesData, error: responsesError } = await supabase
      .from('responses')
      .select('*')
      .limit(1);
    
    if (responsesError) {
      console.log('❌ Error accessing responses:', responsesError.message);
    } else {
      console.log('✅ Responses table accessible');
      if (responsesData.length > 0) {
        console.log('   Columns:', Object.keys(responsesData[0]));
        console.log('   Sample row:', JSON.stringify(responsesData[0], null, 2));
      } else {
        console.log('   Table is empty, but accessible');
      }
    }
    
    // Try to get table info using information_schema (if accessible)
    console.log('\nTrying to get detailed schema info...');
    const { data: schemaData, error: schemaError } = await supabase
      .from('information_schema.columns')
      .select('table_name, column_name, data_type')
      .in('table_name', ['proposals', 'responses']);
    
    if (schemaError) {
      console.log('⚠️ Cannot access information_schema (expected with RLS):', schemaError.message);
    } else {
      console.log('✅ Schema info:');
      schemaData.forEach(col => {
        console.log(`   ${col.table_name}.${col.column_name} (${col.data_type})`);
      });
    }
    
  } catch (error) {
    console.error('Unexpected error:', error.message);
  }
}

checkSchema();
