// Check what columns actually exist in the tables
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://wcpysmnwsovhznvcxyyz.supabase.co';
const supabaseKey = 'sb_publishable_8Vr6irzDMBXmPDMkIHkT1g_D9wUBwpR';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkActualColumns() {
  console.log('Checking actual columns in proposals table...\n');
  
  // Try to select all columns to see what exists
  try {
    const { data, error } = await supabase
      .from('proposals')
      .select('*')
      .limit(1);
    
    if (error) {
      console.log('Error selecting *:', error.message);
      
      // Try common column name variations
      const columnTests = [
        ['id', 'from_name', 'to_name', 'message', 'emotions', 'from_email', 'to_email', 'created_at'],
        ['id', 'fromname', 'toname', 'message', 'emotions', 'fromemail', 'toemail', 'createdat'],
        ['id', 'sender', 'recipient', 'message', 'emotions', 'email', 'created_at'],
        ['id', 'from', 'to', 'message', 'emotions', 'email', 'created_at']
      ];
      
      for (const columns of columnTests) {
        console.log(`\nTrying columns: ${columns.join(', ')}`);
        try {
          const { data: testData, error: testError } = await supabase
            .from('proposals')
            .select(columns.join(', '))
            .limit(1);
          
          if (testError) {
            console.log(`  ❌ Error: ${testError.message}`);
          } else {
            console.log(`  ✅ Success! These columns exist: ${columns.join(', ')}`);
            if (testData.length > 0) {
              console.log('  Sample data:', testData[0]);
            }
            break;
          }
        } catch (e) {
          console.log(`  ❌ Exception: ${e.message}`);
        }
      }
    } else {
      if (data.length > 0) {
        console.log('✅ Found columns:', Object.keys(data[0]));
        console.log('Sample row:', data[0]);
      } else {
        console.log('Table is empty, but accessible');
      }
    }
  } catch (error) {
    console.error('Unexpected error:', error.message);
  }
}

checkActualColumns();
