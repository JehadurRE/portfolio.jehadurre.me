import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const url = process.env.VITE_SUPABASE_URL || '';
const key = process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(url, key);

async function testInsert() {
  const testPost = {
    title: 'The State of Web Performance: Vite, React, and the Death of Create React App',
    slug: 'the-state-of-web-performance-vite-react',
    excerpt: 'Explore how Vite transformed React development by eliminating bundler bottlenecks and creating a new standard for web performance and developer experience.',
    content: 'Full content here...',
    tags: ['React', 'Vite', 'Performance'],
    published_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    read_time: 6,
    is_published: true
  };

  console.log("Testing insert without category/cover_image...");
  const { data, error } = await supabase
    .from('blog_posts')
    .upsert(testPost, { onConflict: 'slug' })
    .select();

  if (error) {
    console.error("Insert error:", error);
  } else {
    console.log("✅ Successfully inserted/updated test post:", data);
  }
}

testInsert();
