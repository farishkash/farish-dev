import type { CollectionEntry } from 'astro:content';

export type BlogPost = CollectionEntry<'blog'>;

export function postSlug(post: BlogPost) {
  return post.id.replace(/\.(md|mdx)$/i, '');
}

export function postUrl(post: BlogPost) {
  return `/writing/${postSlug(post)}`;
}

export function tagSlug(tag: string) {
  return tag
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function readingTime(body = '') {
  const words = body
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/[#>*_`~\[\]()!-]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  return Math.max(1, Math.ceil(words / 220));
}

export function formatPostDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function newestFirst(a: BlogPost, b: BlogPost) {
  return b.data.published.getTime() - a.data.published.getTime();
}
