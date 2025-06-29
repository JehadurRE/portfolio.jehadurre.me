/*
  # Add Skills Table

  1. New Tables
    - `skills`
      - `id` (uuid, primary key)
      - `name` (text)
      - `category` (text)
      - `technologies` (text array)
      - `icon` (text)
      - `proficiency_level` (integer)
      - `years_experience` (integer)
      - `description` (text)
      - `is_featured` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on skills table
    - Add policies for public read access
    - Add policies for authenticated admin access
*/

-- Create skills table
CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL CHECK (category IN ('frontend', 'backend', 'research', 'tools', 'database', 'cloud', 'mobile')),
  technologies text[] DEFAULT '{}',
  icon text NOT NULL,
  proficiency_level integer NOT NULL DEFAULT 1 CHECK (proficiency_level >= 1 AND proficiency_level <= 5),
  years_experience integer NOT NULL DEFAULT 1,
  description text NOT NULL,
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Anyone can read skills"
  ON skills
  FOR SELECT
  TO public
  USING (true);

-- Create policies for authenticated admin access
CREATE POLICY "Authenticated users can manage skills"
  ON skills
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create trigger for updated_at
CREATE TRIGGER update_skills_updated_at
  BEFORE UPDATE ON skills
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample skills data
INSERT INTO skills (name, category, technologies, icon, proficiency_level, years_experience, description, is_featured) VALUES
('Frontend Development', 'frontend', ARRAY['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Vue.js'], 'Code', 5, 4, 'Expert in building modern, responsive web applications with focus on user experience and performance optimization.', true),
('Backend Development', 'backend', ARRAY['Node.js', 'Python', 'Express.js', 'FastAPI', 'REST APIs'], 'Zap', 5, 4, 'Proficient in server-side development, API design, and building scalable backend architectures.', true),
('Database Management', 'database', ARRAY['PostgreSQL', 'MongoDB', 'Redis', 'Supabase', 'MySQL'], 'Database', 4, 3, 'Experienced in database design, optimization, and working with both SQL and NoSQL databases.', true),
('Cloud & DevOps', 'cloud', ARRAY['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform'], 'Cloud', 4, 3, 'Skilled in cloud infrastructure, containerization, and implementing DevOps practices for scalable deployments.', true),
('Machine Learning', 'research', ARRAY['Python', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'Pandas'], 'BookOpen', 4, 2, 'Research-focused experience in machine learning algorithms, data analysis, and AI model development.', true),
('Development Tools', 'tools', ARRAY['Git', 'VS Code', 'Figma', 'Postman', 'Jest'], 'Lightbulb', 5, 4, 'Proficient with modern development tools and workflows that enhance productivity and code quality.', false),
('Mobile Development', 'mobile', ARRAY['React Native', 'Flutter', 'iOS', 'Android'], 'Smartphone', 3, 2, 'Experience in cross-platform mobile app development with focus on native performance.', false);