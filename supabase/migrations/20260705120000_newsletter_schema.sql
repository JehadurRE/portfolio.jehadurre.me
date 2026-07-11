-- Create newsletter_subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    email text UNIQUE NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Allow public inserts (anyone can subscribe)
CREATE POLICY "Allow public inserts" ON newsletter_subscribers
    FOR INSERT WITH CHECK (true);

-- Only authenticated users (admin) can select/update/delete
CREATE POLICY "Allow authenticated full access" ON newsletter_subscribers
    FOR ALL USING (auth.role() = 'authenticated');
