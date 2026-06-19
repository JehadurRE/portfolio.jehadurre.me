import { Feed } from 'feed';
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Using dotenv or just relying on process.env in the script wrapper
import { config } from 'dotenv';
config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const siteUrl = 'https://jehadurre.me';

const feed = new Feed({
  title: "Jehadur Rahman Emran's Blog",
  description: 'Thoughts on software engineering, full-stack development, and research.',
  id: siteUrl,
  link: siteUrl,
  language: 'en',
  image: `${siteUrl}/logo.png`,
  favicon: `${siteUrl}/favicon.ico`,
  copyright: `All rights reserved ${new Date().getFullYear()}, Jehadur Rahman Emran`,
  updated: new Date(),
  feedLinks: {
    json: `${siteUrl}/json`,
    atom: `${siteUrl}/atom`
  },
  author: {
    name: 'Jehadur Rahman Emran',
    email: 'emran.jehadur@gmail.com',
    link: siteUrl
  }
});

async function generateRSS() {
  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('dummy')) {
    console.warn('Missing or dummy Supabase environment variables, generating empty RSS');
    writeFeed();
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  try {
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('is_published', true)
      .order('published_at', { ascending: false });

    if (error) {
      console.warn('Error fetching posts:', error.message);
    } else {
      posts?.forEach(post => {
        feed.addItem({
          title: post.title,
          id: `${siteUrl}/blog/${post.slug}`,
          link: `${siteUrl}/blog/${post.slug}`,
          description: post.excerpt,
          content: post.excerpt,
          author: [
            {
              name: 'Jehadur Rahman Emran',
              email: 'emran.jehadur@gmail.com',
              link: siteUrl
            }
          ],
          contributor: [],
          date: new Date(post.published_at),
          image: post.cover_image ? `${siteUrl}${post.cover_image}` : undefined
        });
      });
    }
  } catch (err) {
    console.warn('Failed to fetch from Supabase:', err);
  }

  writeFeed();
}

function writeFeed() {
  const publicDir = path.resolve(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
  }

  fs.writeFileSync(path.join(publicDir, 'rss.xml'), feed.rss2());
  console.log('Successfully generated rss.xml');
}

generateRSS().catch(console.error);
