-- FIX DATABASE SCRIPT
-- Run this in your Supabase SQL Editor to fix the database schema

-- First, let's check what tables exist
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Drop existing tables if they exist (this will delete all data)
DROP TABLE IF EXISTS responses CASCADE;
DROP TABLE IF EXISTS proposals CASCADE;

-- Create proposals table with correct schema
CREATE TABLE proposals (
  id TEXT PRIMARY KEY,
  fromName TEXT NOT NULL,
  toName TEXT NOT NULL,
  message TEXT,
  emotions JSONB DEFAULT '[]'::jsonb,
  fromEmail TEXT,
  toEmail TEXT,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create responses table with correct schema
CREATE TABLE responses (
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

-- Create policies to allow all operations
CREATE POLICY "Allow all operations on proposals" ON proposals FOR ALL USING (true);
CREATE POLICY "Allow all operations on responses" ON responses FOR ALL USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_proposals_created_at ON proposals(createdAt DESC);
CREATE INDEX IF NOT EXISTS idx_responses_proposal_id ON responses(proposalId);
CREATE INDEX IF NOT EXISTS idx_responses_created_at ON responses(createdAt DESC);

-- Verify the schema
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name IN ('proposals', 'responses') 
AND table_schema = 'public'
ORDER BY table_name, ordinal_position;

-- Insert sample data
INSERT INTO proposals (id, fromName, toName, message, emotions, fromEmail, toEmail) VALUES
('test-001', 'Alice', 'Bob', 'Happy Valentine\'s Day! 💖', '["Love", "Happiness"]', 'alice@email.com', 'bob@email.com'),
('test-002', 'Charlie', 'Diana', 'You make my heart skip a beat!', '["Love", "Excitement"]', 'charlie@email.com', 'diana@email.com');

INSERT INTO responses (proposalId, message, fromName, emotions) VALUES
('test-001', 'Thank you Alice! You\'re amazing too! 💕', 'Bob', '["Love", "Gratitude"]'),
('test-002', 'Oh Charlie, that\'s so sweet! ❤️', 'Diana', '["Love", "Joy"]');

-- Show the data
SELECT 'Proposals:' as info, id, fromName, toName, LEFT(message, 30) as message_preview FROM proposals
UNION ALL
SELECT 'Responses:' as info, id, proposalId, fromName, LEFT(message, 30) as message_preview FROM responses;
