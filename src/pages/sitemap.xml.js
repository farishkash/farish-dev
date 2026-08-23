import { getCollection } from 'astro:content';
import { BLOG_CATEGORIES } from '../lib/categories';
import { postUrl, tagSlug } from '../lib/blog';

export async function GET() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  const tags = [...new Set(posts.flatMap((post) => post.data.tags))];

  const paths = [
    '/',
    '/work',
    '/about',
    '/writing',
    ...posts.map((post) => postUrl(post)),
    ...BLOG_CATEGORIES.map((category) => `/writing/categories/${category.slug}`),
    ...tags.map((tag) => `/writing/tags/${tagSlug(tag)}`),
  ];

  const urls = [...new Set(paths)]
    .map((path) => `<url><loc>https://farish.dev${path}</loc></url>`)
    .join('');

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`,
    { headers: { 'Content-Type': 'application/xml' } },
  );
}
