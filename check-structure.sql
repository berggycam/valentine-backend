-- Check the actual structure of your tables
-- Run this in Supabase SQL Editor

-- Check what columns exist in proposals table
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'proposals' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check what columns exist in responses table
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'responses' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Show all tables in public schema
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
