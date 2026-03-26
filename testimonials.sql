-- SQL Schema for Testimonials Table

-- Create the testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  image_url VARCHAR(512),
  role VARCHAR(255),
  approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create an index on the 'approved' column for faster queries
CREATE INDEX IF NOT EXISTS idx_testimonials_approved ON testimonials(approved);

-- Create an index on the 'created_at' column for sorting by dater
CREATE INDEX IF NOT EXISTS idx_testimonials_created_at ON testimonials(created_at DESC);

-- Add a trigger to automatically update 'updated_at' column
CREATE OR REPLACE FUNCTION update_testimonials_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER update_testimonials_timestamp_trigger
BEFORE UPDATE ON testimonials
FOR EACH ROW
EXECUTE FUNCTION update_testimonials_timestamp();

-- If using Supabase, enable RLS (Row Level Security)
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow reading approved testimonials
CREATE POLICY "Allow public to view approved testimonials" ON testimonials
  FOR SELECT
  USING (approved = true);

-- Create a policy to allow authenticated users to insert testimonials
CREATE POLICY "Allow authenticated users to insert testimonials" ON testimonials
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Create a policy to allow authenticated users to view their own testimonials
CREATE POLICY "Allow users to view their own testimonials" ON testimonials
  FOR SELECT
  USING (auth.uid() = auth.uid());

-- Sample data insertion (optional)
INSERT INTO testimonials (name, message, image_url, role, approved) VALUES
('Sarah Chen', 'This platform revolutionized how we showcase our work and connect with talented developers. The experience was seamless and impactful.', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop', 'Software Engineer', true),
('Marcus Johnson', 'Incredible community engagement and opportunities. The platform made it easy to find collaborators and contribute to meaningful projects.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop', 'Product Manager', true),
('Priya Patel', 'Best decision to join this hub. The support and resources provided are unparalleled. Highly recommend for anyone in tech.', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop', 'UX Designer', true);

-- Query to fetch all approved testimonials (ordered by creation date)
-- SELECT id, name, message, image_url, role, created_at FROM testimonials WHERE approved = true ORDER BY created_at DESC;

-- Query to fetch random testimonials
-- SELECT * FROM testimonials WHERE approved = true ORDER BY RANDOM() LIMIT 9;
