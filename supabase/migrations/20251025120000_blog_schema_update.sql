-- Add new fields to blog_posts for SEO and enhanced blog post features
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS cover_image text;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS category text;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS views integer DEFAULT 0;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS seo_title text;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS seo_description text;
