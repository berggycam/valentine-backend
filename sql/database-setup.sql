-- Valentine App Database Setup Script
-- Run this script in your Supabase SQL Editor

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

-- Enable Row Level Security (recommended for production)
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations (you can restrict these later)
CREATE POLICY "Allow all operations on proposals" ON proposals FOR ALL USING (true);
CREATE POLICY "Allow all operations on responses" ON responses FOR ALL USING (true);

-- Insert sample data (optional - remove if you don't want sample data)
INSERT INTO proposals (id, fromName, toName, message, emotions, fromEmail, createdAt) VALUES
('7013', 'David', 'jessica', 'How we met: in school

What I love about you: their voice

How you make me feel: i feel great

My Valentine''s message: i miss you', '["Love", "Happiness", "Passion"]', NULL, NULL, '2026-02-12T12:30:55.090Z'),
('6f60', 'dave', 'yh', 'How we met: nothing

What I love about you: yh

How you make me feel: yh


My Valentine''s message: yh', '["Hope"]', NULL, NULL, '2026-02-12T12:31:29.816Z'),
('3a20', 'Test', 'Test2', 'Test message', '[]', 'test@test.com', NOW()),
('34a3', 'yh', 'yh', 'yh', '["Excitement"]', 'bergsjoseph@gmail.com', '2026-02-12T12:32:29.816Z'),
('29e5', 'yh', 'yh', 'yh', '["Excitement"]', 'yh@gmail.com', '2026-02-12T12:32:29.816Z'),
('4596', 'yh', 'yh', 'yh', '["Nervousness"]', 'y67@gmail.com', '2026-02-12T12:36:11.699Z'),
('3c5f', 'yh', 'yh', 'ok sure', '["Nervousness"]', 'yh0@gmail.com', '2026-02-12T13:07:14.995Z');

-- Insert sample responses (optional)
INSERT INTO responses (proposalId, message, fromName, emotions, createdAt) VALUES
('7013', 'That''s so sweet! I love you too ❤️', 'jessica', '["Love", "Happiness"]', NOW());

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_proposals_created_at ON proposals(createdAt DESC);
CREATE INDEX IF NOT EXISTS idx_responses_proposal_id ON responses(proposalId);
CREATE INDEX IF NOT EXISTS idx_responses_created_at ON responses(createdAt DESC);
