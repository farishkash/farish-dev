# farish.dev

The current generation of [farish.dev](https://farish.dev), rebuilt with Astro and designed to deploy as a static site on Cloudflare Workers.

## Stack

- Astro 7
- Plain CSS
- Cloudflare Workers static assets
- Wrangler for local Cloudflare preview and deployment

The site intentionally has no UI framework or runtime JavaScript dependency unless a future feature actually needs one.

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

Astro writes the static site to `dist/`.

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

The custom domain will remain on the existing site until the new build is reviewed and ready to replace it.
