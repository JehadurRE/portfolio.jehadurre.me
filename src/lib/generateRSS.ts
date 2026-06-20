import { Feed } from 'feed';
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
// fallback to standard .env if the above doesn't exist
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Missing Supabase environment variables. Skipping RSS feed generation.");
  process.exit(0);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function generateRSS() {
  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching blog posts:', error);
    console.warn('Skipping RSS generation due to fetch error. Proceeding with build.');
    return;
  }

  const feed = new Feed({
    title: 'Md. Jehadur Rahman Emran - Blog',
    description: 'Thoughts, tutorials, and insights on software engineering and research.',
    id: 'https://jehadurre.me/',
    link: 'https://jehadurre.me/',
    language: 'en',
    image: 'https://github.com/JehadurRE.png',
    favicon: 'https://jehadurre.me/favicon.ico',
    copyright: `All rights reserved ${new Date().getFullYear()}, Md. Jehadur Rahman Emran`,
    updated: posts && posts.length > 0 ? new Date(posts[0].published_at) : new Date(),
    generator: 'Feed for Node.js',
    feedLinks: {
      rss: 'https://jehadurre.me/rss.xml',
    },
    author: {
      name: 'Md. Jehadur Rahman Emran',
      email: 'emran.jehadur@gmail.com',
      link: 'https://jehadurre.me/',
    },
  });

  if (posts) {
    posts.forEach((post) => {
      feed.addItem({
        title: post.title,
        id: `https://jehadurre.me/blog/${post.slug}`,
        link: `https://jehadurre.me/blog/${post.slug}`,
        description: post.excerpt,
        content: post.content, // Includes full markdown
        author: [
          {
            name: 'Md. Jehadur Rahman Emran',
            email: 'emran.jehadur@gmail.com',
            link: 'https://jehadurre.me/',
          },
        ],
        date: new Date(post.published_at),
        image: post.cover_image ? (post.cover_image.startsWith('http') ? post.cover_image : `https://jehadurre.me${post.cover_image}`) : undefined,
      });
    });
  }

  const publicDir = path.resolve(__dirname, '../../public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  fs.writeFileSync(path.join(publicDir, 'rss.xml'), feed.rss2());
  console.log('Successfully generated rss.xml');
}

generateRSS().catch(console.error);
