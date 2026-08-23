# farish.dev

The current generation of [farish.dev](https://farish.dev), rebuilt with Astro as a writing-first personal site and designed to deploy as a static site on Cloudflare Workers.

## Stack

- Astro 7
- Astro content collections
- Markdown + MDX posts
- `@astrojs/rss`
- Plain CSS
- Cloudflare Workers static assets
- Wrangler for local Cloudflare preview and deployment

The site intentionally has no client-side UI framework or runtime JavaScript dependency unless a future feature actually needs one.

## Blog

Posts live in `src/content/blog/`. The collection schema is defined in `src/content.config.ts`.

A post with `draft: true` is validated during builds but excluded from public article routes, the blog index, homepage, tag pages, related posts, and RSS. Publishing is therefore a frontmatter change rather than moving files around.

See [`docs/BLOG_WORKFLOW.md`](docs/BLOG_WORKFLOW.md) for the idea → draft → revise → publish workflow and [`docs/post-template.mdx`](docs/post-template.mdx) for a reusable post starter.

Published posts appear at `/writing/<slug>`. Tags are generated automatically under `/writing/tags/<tag>`, and the RSS feed is `/rss.xml`.

## Local development

Requires Node.js 22.12.0 or newer.

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Astro writes the static site to `dist/`. GitHub Actions runs the same production build on every push to `main` and on pull requests.

## Preview with the Cloudflare runtime

```bash
npm run cf:preview
```

## Deploy

```bash
npm run deploy
```

`wrangler.jsonc` serves `./dist` as static assets and uses the generated `404.html` for unmatched routes.

## Cloudflare Git integration

For Workers Builds, use:

- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`
- Node.js: 22.12.0 or newer

Once Workers Builds is connected to this repository, publishing a post to `main` can automatically validate, build, and deploy the updated site. The custom domain stays on the existing site until the new build is reviewed and ready to replace it.
