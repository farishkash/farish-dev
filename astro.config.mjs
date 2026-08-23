import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://farish.dev',
  trailingSlash: 'never',
  integrations: [mdx()],
});
