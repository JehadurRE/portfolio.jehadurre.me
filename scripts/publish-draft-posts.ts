import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const url = process.env.VITE_SUPABASE_URL || '';
const key = process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(url, key);

function parseSqlFile(filePath: string) {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  
  // Extract values list from VALUES (...)
  const match = fileContent.match(/VALUES\s*\(\s*([\s\S]*)\s*\);?/i);
  if (!match) return null;

  const raw = match[1].trim();

  // Helper to extract SQL string literals and arrays
  // Values order:
  // 1: title, 2: slug, 3: excerpt, 4: content, 5: category, 6: ARRAY['...'], 7: cover_image,
  // 8: published_at, 9: updated_at, 10: read_time, 11: seo_title, 12: seo_description, 13: is_published

  // Parse title (first single quoted string)
  const titleMatch = raw.match(/^'([^']*(?:''[^']*)*)'/);
  if (!titleMatch) return null;
  const title = titleMatch[1].replace(/''/g, "'");

  let remaining = raw.substring(titleMatch[0].length).replace(/^\s*,\s*/, '');

  // Parse slug
  const slugMatch = remaining.match(/^'([^']*(?:''[^']*)*)'/);
  if (!slugMatch) return null;
  const slug = slugMatch[1].replace(/''/g, "'");

  remaining = remaining.substring(slugMatch[0].length).replace(/^\s*,\s*/, '');

  // Parse excerpt
  const excerptMatch = remaining.match(/^'([^']*(?:''[^']*)*)'/);
  if (!excerptMatch) return null;
  const excerpt = excerptMatch[1].replace(/''/g, "'");

  remaining = remaining.substring(excerptMatch[0].length).replace(/^\s*,\s*/, '');

  // Parse content
  const contentMatch = remaining.match(/^'([^']*(?:''[^']*)*)'/);
  if (!contentMatch) return null;
  const content = contentMatch[1].replace(/''/g, "'");

  remaining = remaining.substring(contentMatch[0].length).replace(/^\s*,\s*/, '');

  // Parse category
  const categoryMatch = remaining.match(/^'([^']*(?:''[^']*)*)'/);
  if (!categoryMatch) return null;
  const category = categoryMatch[1].replace(/''/g, "'");

  remaining = remaining.substring(categoryMatch[0].length).replace(/^\s*,\s*/, '');

  // Parse tags (ARRAY['tag1', 'tag2'])
  const arrayMatch = remaining.match(/^ARRAY\[([^\]]+)\]/i);
  let tags: string[] = [];
  if (arrayMatch) {
    tags = arrayMatch[1]
      .split(',')
      .map(t => t.trim().replace(/^'|'$/g, '').replace(/''/g, "'"));
    remaining = remaining.substring(arrayMatch[0].length).replace(/^\s*,\s*/, '');
  }

  // Parse cover_image
  const coverMatch = remaining.match(/^'([^']*(?:''[^']*)*)'/);
  const cover_image = coverMatch ? coverMatch[1].replace(/''/g, "'") : '';
  if (coverMatch) remaining = remaining.substring(coverMatch[0].length).replace(/^\s*,\s*/, '');

  // Parse published_at
  const pubMatch = remaining.match(/^'([^']*(?:''[^']*)*)'/);
  const published_at = pubMatch ? pubMatch[1].replace(/''/g, "'") : new Date().toISOString();
  if (pubMatch) remaining = remaining.substring(pubMatch[0].length).replace(/^\s*,\s*/, '');

  // Parse updated_at
  const upMatch = remaining.match(/^'([^']*(?:''[^']*)*)'/);
  const updated_at = upMatch ? upMatch[1].replace(/''/g, "'") : new Date().toISOString();
  if (upMatch) remaining = remaining.substring(upMatch[0].length).replace(/^\s*,\s*/, '');

  // Parse read_time
  const readMatch = remaining.match(/^(\d+)/);
  const read_time = readMatch ? parseInt(readMatch[1], 10) : 5;
  if (readMatch) remaining = remaining.substring(readMatch[0].length).replace(/^\s*,\s*/, '');

  // Parse seo_title
  const seoTitleMatch = remaining.match(/^'([^']*(?:''[^']*)*)'/);
  const seo_title = seoTitleMatch ? seoTitleMatch[1].replace(/''/g, "'") : title;
  if (seoTitleMatch) remaining = remaining.substring(seoTitleMatch[0].length).replace(/^\s*,\s*/, '');

  // Parse seo_description
  const seoDescMatch = remaining.match(/^'([^']*(?:''[^']*)*)'/);
  const seo_description = seoDescMatch ? seoDescMatch[1].replace(/''/g, "'") : excerpt;
  if (seoDescMatch) remaining = remaining.substring(seoDescMatch[0].length).replace(/^\s*,\s*/, '');

  const is_published = true;

  return {
    title,
    slug,
    excerpt,
    content,
    category,
    tags,
    cover_image,
    published_at,
    updated_at,
    read_time,
    seo_title,
    seo_description,
    is_published
  };
}

async function run() {
  const draftsDir = path.join(process.cwd(), 'blog-posts', 'drafts');
  const files = fs.readdirSync(draftsDir).filter(f => f.endsWith('.sql'));

  console.log(`Found ${files.length} draft SQL files in ${draftsDir}`);

  for (const file of files) {
    const filePath = path.join(draftsDir, file);
    try {
      const post = parseSqlFile(filePath);
      if (!post) {
        console.warn(`Could not parse SQL file: ${file}`);
        continue;
      }

      console.log(`Publishing: "${post.title}" (${post.slug})...`);
      const { data, error } = await supabase
        .from('blog_posts')
        .upsert(post, { onConflict: 'slug' })
        .select();

      if (error) {
        console.error(`Error inserting ${post.slug}:`, error.message);
      } else {
        console.log(`✅ Successfully published: ${post.slug}`);
      }
    } catch (err) {
      console.error(`Failed to process ${file}:`, err);
    }
  }
}

run();
