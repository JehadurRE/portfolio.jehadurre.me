/*
  # Portfolio Database Schema

  1. New Tables
    - `certifications`
      - `id` (uuid, primary key)
      - `title` (text)
      - `issuer` (text)
      - `issue_date` (date)
      - `expiry_date` (date, nullable)
      - `credential_id` (text)
      - `verification_url` (text)
      - `image_url` (text)
      - `description` (text)
      - `skills` (text array)
      - `category` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `achievements`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `date` (date)
      - `category` (text)
      - `icon` (text)
      - `details` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `blog_posts`
      - `id` (uuid, primary key)
      - `title` (text)
      - `slug` (text, unique)
      - `excerpt` (text)
      - `content` (text)
      - `tags` (text array)
      - `published_at` (timestamp)
      - `read_time` (integer)
      - `is_published` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access
    - Add policies for authenticated admin access
*/

-- Create certifications table
CREATE TABLE IF NOT EXISTS certifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  issuer text NOT NULL,
  issue_date date NOT NULL,
  expiry_date date,
  credential_id text NOT NULL,
  verification_url text NOT NULL,
  image_url text NOT NULL,
  description text NOT NULL,
  skills text[] DEFAULT '{}',
  category text NOT NULL CHECK (category IN ('technical', 'professional', 'academic')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  date date NOT NULL,
  category text NOT NULL CHECK (category IN ('award', 'recognition', 'milestone')),
  icon text NOT NULL,
  details text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text NOT NULL,
  content text NOT NULL,
  tags text[] DEFAULT '{}',
  published_at timestamptz,
  read_time integer NOT NULL DEFAULT 5,
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Anyone can read certifications"
  ON certifications
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can read achievements"
  ON achievements
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can read published blog posts"
  ON blog_posts
  FOR SELECT
  TO public
  USING (is_published = true);

-- Create policies for authenticated admin access (for future admin panel)
CREATE POLICY "Authenticated users can manage certifications"
  ON certifications
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage achievements"
  ON achievements
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage blog posts"
  ON blog_posts
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_certifications_updated_at
  BEFORE UPDATE ON certifications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_achievements_updated_at
  BEFORE UPDATE ON achievements
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for certifications
INSERT INTO certifications (title, issuer, issue_date, expiry_date, credential_id, verification_url, image_url, description, skills, category) VALUES
('AWS Certified Solutions Architect - Associate', 'Amazon Web Services', '2023-08-15', '2026-08-15', 'AWS-ASA-2023-001', 'https://aws.amazon.com/verification', 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=400', 'Demonstrates expertise in designing distributed systems on AWS platform with focus on scalability, security, and cost optimization.', ARRAY['AWS', 'Cloud Architecture', 'System Design', 'Security'], 'technical'),
('Google Cloud Professional Developer', 'Google Cloud', '2023-06-20', '2025-06-20', 'GCP-PD-2023-002', 'https://cloud.google.com/certification/verify', 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=400', 'Validates skills in developing scalable and highly available applications using Google Cloud technologies.', ARRAY['Google Cloud', 'Kubernetes', 'DevOps', 'Microservices'], 'technical'),
('Certified Kubernetes Administrator (CKA)', 'Cloud Native Computing Foundation', '2023-04-10', '2026-04-10', 'CKA-2023-003', 'https://training.linuxfoundation.org/certification/verify', 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=400', 'Demonstrates expertise in Kubernetes administration, including cluster management, networking, and troubleshooting.', ARRAY['Kubernetes', 'Container Orchestration', 'Linux', 'DevOps'], 'technical'),
('MongoDB Certified Developer', 'MongoDB Inc.', '2023-02-28', NULL, 'MDB-DEV-2023-004', 'https://university.mongodb.com/verify_certificate', 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=400', 'Validates proficiency in MongoDB database design, development, and optimization techniques.', ARRAY['MongoDB', 'NoSQL', 'Database Design', 'Performance Optimization'], 'technical'),
('Project Management Professional (PMP)', 'Project Management Institute', '2022-11-15', '2025-11-15', 'PMP-2022-005', 'https://www.pmi.org/certifications/certification-resources/registry', 'https://images.pexels.com/photos/1181316/pexels-photo-1181316.jpeg?auto=compress&cs=tinysrgb&w=400', 'Demonstrates competency in leading and directing projects, managing teams, and delivering results.', ARRAY['Project Management', 'Leadership', 'Risk Management', 'Agile'], 'professional'),
('Machine Learning Specialization', 'Stanford University (Coursera)', '2022-09-30', NULL, 'STAN-ML-2022-006', 'https://coursera.org/verify', 'https://images.pexels.com/photos/1181354/pexels-photo-1181354.jpeg?auto=compress&cs=tinysrgb&w=400', 'Comprehensive specialization covering machine learning algorithms, neural networks, and practical applications.', ARRAY['Machine Learning', 'Python', 'TensorFlow', 'Data Science'], 'academic');

-- Insert sample data for achievements
INSERT INTO achievements (title, description, date, category, icon, details) VALUES
('Best Paper Award', 'International Conference on Software Engineering 2024', '2024-01-15', 'award', '🏆', 'Received the Best Paper Award for research on "Advanced Machine Learning Approaches for Software Engineering" at ICSE 2024, competing against 500+ submissions.'),
('GitHub Arctic Code Vault Contributor', 'Contributed to open source projects preserved in Arctic Code Vault', '2023-07-02', 'recognition', '❄️', 'Selected as one of the contributors whose open source work was deemed significant enough to be preserved in the GitHub Arctic Code Vault for future generations.'),
('Dean''s List Recognition', 'Academic Excellence in Computer Science', '2023-05-20', 'recognition', '🎓', 'Achieved Dean''s List recognition for maintaining exceptional academic performance with a GPA of 3.9/4.0 in Computer Science graduate program.'),
('Hackathon Winner', 'First Place - National AI Hackathon 2023', '2023-03-18', 'award', '🥇', 'Led a team of 4 developers to win first place in the National AI Hackathon, developing an innovative ML-powered solution for healthcare diagnostics.'),
('10K+ GitHub Stars', 'Reached milestone of 10,000+ stars across repositories', '2023-01-10', 'milestone', '⭐', 'Achieved a significant milestone of accumulating over 10,000 stars across various open source projects, demonstrating community impact and code quality.'),
('Research Excellence Award', 'Outstanding Research Contribution in Computer Science', '2022-12-05', 'award', '🔬', 'Recognized for exceptional research contributions in the field of computer science, particularly in machine learning applications for software engineering.');

-- Insert sample data for blog posts
INSERT INTO blog_posts (title, slug, excerpt, content, tags, published_at, read_time, is_published) VALUES
('Building Scalable React Applications with TypeScript', 'building-scalable-react-applications', 'Learn best practices for creating maintainable and scalable React applications using TypeScript, focusing on proper architecture and design patterns.', 'Full content would go here...', ARRAY['React', 'TypeScript', 'Web Development'], '2024-01-15 10:00:00+00', 8, true),
('The Future of Machine Learning in Software Engineering', 'future-of-ml-in-software-engineering', 'Exploring how machine learning is transforming software development processes, from automated testing to intelligent code generation.', 'Full content would go here...', ARRAY['Machine Learning', 'Software Engineering', 'AI'], '2024-01-10 14:30:00+00', 12, true),
('Optimizing Database Performance for Web Applications', 'optimizing-database-performance', 'Deep dive into database optimization techniques including indexing strategies, query optimization, and caching mechanisms.', 'Full content would go here...', ARRAY['Database', 'Performance', 'Backend'], '2024-01-05 09:15:00+00', 10, true),
('Modern CSS Techniques for Better User Experiences', 'modern-css-techniques', 'Discover advanced CSS techniques including Grid, Flexbox, and CSS Custom Properties to create stunning user interfaces.', 'Full content would go here...', ARRAY['CSS', 'Frontend', 'UI/UX'], '2024-01-01 16:45:00+00', 6, true);