-- Valentine App Sample Data
-- Run this script in your Supabase SQL Editor to insert test data

-- Insert sample proposals
INSERT INTO proposals (id, fromName, toName, message, emotions, fromEmail, toEmail, createdAt) VALUES
('7013', 'David', 'jessica', 'How we met: in school

What I love about you: their voice

How you make me feel: i feel great

My Valentine''s message: i miss you', '["Love", "Happiness", "Passion"]', NULL, NULL, '2026-02-12T12:30:55.090Z'),
('6f60', 'dave', 'yh', 'How we met: nothing

What I love about you: yh

How you make me feel: yh

My Valentine''s message: yh', '["Hope"]', NULL, NULL, '2026-02-12T12:31:29.816Z'),
('3a20', 'Test', 'Test2', 'Test message', '[]', 'test@test.com', NULL, NOW()),
('34a3', 'yh', 'yh', 'yh', '["Excitement"]', 'bergsjoseph@gmail.com', '', '2026-02-12T12:32:29.816Z'),
('29e5', 'yh', 'yh', 'yh', '["Excitement"]', 'yh@gmail.com', '', '2026-02-12T12:32:29.816Z'),
('4596', 'yh', 'yh', 'yh', '["Nervousness"]', 'y67@gmail.com', '', '2026-02-12T12:36:11.699Z'),
('3c5f', 'yh', 'yh', 'ok sure', '["Nervousness"]', 'yh0@gmail.com', '', '2026-02-12T13:07:14.995Z'),
('test-001', 'Alice', 'Bob', 'Happy Valentine''s Day! You make my heart skip a beat. 💖', '["Love", "Excitement", "Joy"]', 'alice@email.com', 'bob@email.com', NOW()),
('test-002', 'Charlie', 'Diana', 'You''re the most amazing person I know. Will you be my Valentine?', '["Adoration", "Nervousness", "Hope"]', 'charlie@email.com', 'diana@email.com', NOW());

-- Insert sample responses
INSERT INTO responses (id, proposalId, message, fromName, emotions, createdAt) VALUES
(gen_random_uuid(), '7013', 'That''s so sweet! I love you too ❤️', 'jessica', '["Love", "Happiness"]', NOW()),
(gen_random_uuid(), '6f60', 'Thanks for the message!', 'yh', '["Joy"]', NOW()),
(gen_random_uuid(), 'test-001', 'Yes! I''d love to be your Valentine! 💕', 'Bob', '["Love", "Happiness", "Excitement"]', NOW()),
(gen_random_uuid(), 'test-002', 'Of course! You''re amazing too! 💑', 'Diana', '["Love", "Joy", "Gratitude"]', NOW());

-- Verify the data was inserted
SELECT 'Proposals count:' as info, COUNT(*) as count FROM proposals
UNION ALL
SELECT 'Responses count:' as info, COUNT(*) as count FROM responses;

-- Show all proposals
SELECT id, fromName, toName, LEFT(message, 50) || '...' as message_preview, emotions, createdAt
FROM proposals
ORDER BY createdAt DESC;

-- Show all responses with proposal info
SELECT r.id, r.proposalId, p.fromName as proposal_from, p.toName as proposal_to,
       LEFT(r.message, 50) || '...' as response_preview, r.emotions, r.createdAt
FROM responses r
JOIN proposals p ON r.proposalId = p.id
ORDER BY r.createdAt DESC;
