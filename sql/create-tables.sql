-- CREATE TABLES SCRIPT
-- Run this in your Supabase SQL Editor after deleting the old tables

-- Create proposals table
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

-- Create responses table
CREATE TABLE responses (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  proposalId TEXT NOT NULL,
  message TEXT,
  fromName TEXT,
  emotions JSONB DEFAULT '[]'::jsonb,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (proposalId) REFERENCES proposals(id) ON DELETE CASCADE
);

-- Enable Row Level Security (recommended for production)
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations
CREATE POLICY "Allow all operations on proposals" ON proposals FOR ALL USING (true);
CREATE POLICY "Allow all operations on responses" ON responses FOR ALL USING (true);

-- Create indexes for better performance
CREATE INDEX idx_proposals_created_at ON proposals(createdAt DESC);
CREATE INDEX idx_responses_proposal_id ON responses(proposalId);
CREATE INDEX idx_responses_created_at ON responses(createdAt DESC);

-- Verify the tables were created
SELECT 'Tables created successfully!' as status;
