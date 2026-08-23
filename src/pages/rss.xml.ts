import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { newestFirst, postUrl } from '../lib/blog';

export async function GET(context) {
  const posts = (await getCollection('blog', ({ data }) => !data.draft)).sort(newestFirst);

  return rss({
    title: 'farish.dev — Writing by Farish Kashefinejad',
    description: 'Thoughts on AI, software, technical education, EdTech, learning, and work.',
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.published,
      link: postUrl(post),
      categories: post.data.tags,
    })),
    customData: '<language>en-us</language>',
    trailingSlash: false,
  });
}
