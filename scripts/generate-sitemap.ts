import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { config } from 'dotenv';

config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const siteUrl = 'https://jehadurre.me';

const staticRoutes = [
  { url: '/', changefreq: 'weekly', priority: 1.0, lastmod: '2026-07-14' },
  { url: '/#about', changefreq: 'monthly', priority: 0.8 },
  { url: '/#projects', changefreq: 'weekly', priority: 0.8 },
  { url: '/#research', changefreq: 'monthly', priority: 0.8 },
  { url: '/#certifications', changefreq: 'monthly', priority: 0.7 },
  { url: '/#blog', changefreq: 'weekly', priority: 0.8 },
  { url: '/#contact', changefreq: 'monthly', priority: 0.6 },
];

let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

staticRoutes.forEach(route => {
  sitemap += `  <url>
    <loc>${siteUrl}${route.url}</loc>
${route.lastmod ? `    <lastmod>${route.lastmod}</lastmod>\n` : ''}    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority.toFixed(1)}</priority>
  </url>
`;
});

async function generateSitemap() {
  try {
    const response = await fetch("https://api.github.com/users/JehadurRE/repos?sort=updated&per_page=50");
    if (!response.ok) {
        console.warn('Failed to fetch from GitHub API:', response.status);
    } else {
        const repos = await response.json();
        repos.forEach((repo: { name: string, updated_at: string }) => {
            const updatedAt = repo.updated_at ? new Date(repo.updated_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
            sitemap += `  <url>
    <loc>${siteUrl}/project/${repo.name}</loc>
    <lastmod>${updatedAt}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
`;
        });
    }
  } catch(err) {
      console.warn('Failed to fetch repos from GitHub API:', err);
  }

  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('dummy')) {
    console.warn('Missing or dummy Supabase environment variables, generating basic sitemap');
    writeSitemap();
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  try {
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('slug, updated_at')
      .eq('is_published', true);

    if (error) {
      console.warn('Error fetching posts:', error.message);
    } else {
      posts?.forEach(post => {
        const updatedAt = post.updated_at ? new Date(post.updated_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
        sitemap += `  <url>
    <loc>${siteUrl}/blog/${post.slug}</loc>
    <lastmod>${updatedAt}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
`;
      });
    }
  } catch (err) {
    console.warn('Failed to fetch from Supabase:', err);
  }

  writeSitemap();
}

function writeSitemap() {
  sitemap += `</urlset>`;

  const publicDir = path.resolve(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
  }

  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
  console.log('Successfully generated sitemap.xml');
}

generateSitemap().catch(console.error);
