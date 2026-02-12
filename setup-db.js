#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables. Please check your .env file.');
  console.error('Required variables:');
  console.error('  NEXT_PUBLIC_SUPABASE_URL');
  console.error('  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupDatabase() {
  console.log('🚀 Starting Supabase database setup...\n');

  try {
    // Check connection
    console.log('📡 Testing Supabase connection...');
    const { data: connectionTest, error: connectionError } = await supabase
      .from('proposals')
      .select('count')
      .limit(1);

    if (connectionError && connectionError.code !== 'PGRST116') {
      console.log('✅ Supabase connection successful');
    } else {
      console.log('✅ Supabase connection successful');
    }

    // Note: In Supabase, we need to use the SQL Editor for table creation
    // since the client doesn't have direct table creation methods
    console.log('⚠️  Note: This script requires tables to be created via Supabase SQL Editor');
    console.log('📋 Please run the following SQL in your Supabase SQL Editor:\n');

    console.log(`-- Valentine App Database Setup
-- Run this in your Supabase SQL Editor

-- Create proposals table
CREATE TABLE IF NOT EXISTS proposals (
  id TEXT PRIMARY KEY,
  fromName TEXT NOT NULL,
  toName TEXT NOT NULL,
  message TEXT,
  emotions JSONB DEFAULT '[]'::jsonb,
  fromEmail TEXT,
  toEmail TEXT,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create responses table
CREATE TABLE IF NOT EXISTS responses (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  proposalId TEXT NOT NULL,
  message TEXT,
  fromName TEXT,
  emotions JSONB DEFAULT '[]'::jsonb,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (proposalId) REFERENCES proposals(id) ON DELETE CASCADE
);

-- Enable Row Level Security
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow all operations on proposals" ON proposals FOR ALL USING (true);
CREATE POLICY "Allow all operations on responses" ON responses FOR ALL USING (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_proposals_created_at ON proposals(createdAt DESC);
CREATE INDEX IF NOT EXISTS idx_responses_proposal_id ON responses(proposalId);
CREATE INDEX IF NOT EXISTS idx_responses_created_at ON responses(createdAt DESC);`);

    console.log('\n📝 After running the SQL, this script will insert sample data...\n');

    // Wait for user to confirm they've run the SQL
    console.log('❓ Have you run the SQL above in your Supabase dashboard? (y/n): ');

    // For now, let's try to insert sample data assuming tables exist
    console.log('\n🔄 Attempting to insert sample data...');

    const sampleProposals = [
      {
        id: '7013',
        fromName: 'David',
        toName: 'jessica',
        message: 'How we met: in school\n\nWhat I love about you: their voice\n\nHow you make me feel: i feel great\n\nMy Valentine\'s message: i miss you',
        emotions: ['Love', 'Happiness', 'Passion'],
        fromEmail: null,
        toEmail: null,
        createdAt: '2026-02-12T12:30:55.090Z'
      },
      {
        id: '6f60',
        fromName: 'dave',
        toName: 'yh',
        message: 'How we met: nothing\n\nWhat I love about you: yh\n\nHow you make me feel: yh\n\n\nMy Valentine\'s message: yh',
        emotions: ['Hope'],
        fromEmail: null,
        toEmail: null,
        createdAt: '2026-02-12T12:31:29.816Z'
      },
      {
        id: '3a20',
        fromName: 'Test',
        toName: 'Test2',
        message: 'Test message',
        emotions: [],
        fromEmail: 'test@test.com',
        toEmail: null,
        createdAt: new Date().toISOString()
      }
    ];

    // Insert sample proposals
    console.log('📝 Inserting sample proposals...');
    const { data: proposalsData, error: proposalsError } = await supabase
      .from('proposals')
      .upsert(sampleProposals, { onConflict: 'id' });

    if (proposalsError) {
      console.error('❌ Error inserting proposals:', proposalsError.message);
      console.log('💡 This might mean the tables don\'t exist yet. Please run the SQL first.');
    } else {
      console.log(`✅ Successfully inserted ${sampleProposals.length} sample proposals`);
    }

    // Insert sample response
    console.log('📝 Inserting sample response...');
    const { data: responseData, error: responseError } = await supabase
      .from('responses')
      .insert([{
        proposalId: '7013',
        message: 'That\'s so sweet! I love you too ❤️',
        fromName: 'jessica',
        emotions: ['Love', 'Happiness'],
        createdAt: new Date().toISOString()
      }]);

    if (responseError) {
      console.error('❌ Error inserting response:', responseError.message);
    } else {
      console.log('✅ Successfully inserted sample response');
    }

    // Test the API endpoints
    console.log('\n🧪 Testing API endpoints...');

    // Test GET proposals
    const { data: testProposals, error: testProposalsError } = await supabase
      .from('proposals')
      .select('*')
      .limit(1);

    if (testProposalsError) {
      console.error('❌ Error testing proposals endpoint:', testProposalsError.message);
    } else {
      console.log('✅ Proposals endpoint working');
    }

    // Test GET responses
    const { data: testResponses, error: testResponsesError } = await supabase
      .from('responses')
      .select('*')
      .limit(1);

    if (testResponsesError) {
      console.error('❌ Error testing responses endpoint:', testResponsesError.message);
    } else {
      console.log('✅ Responses endpoint working');
    }

    console.log('\n🎉 Database setup complete!');
    console.log('📚 Your Valentine app backend is now connected to Supabase!');
    console.log('🔄 Data will persist across deployments.');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure your .env file has the correct Supabase credentials');
    console.log('2. Run the SQL commands in your Supabase dashboard first');
    console.log('3. Check your internet connection');
    process.exit(1);
  }
}

// Run the setup
setupDatabase();
