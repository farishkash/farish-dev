# Blog workflow

The blog is designed to be managed from conversation as much as from an editor.

## 1. Save an idea

When Farish says **“save this idea”**, create a GitHub issue using this structure:

- Title: `[Post idea] <working title>`
- Core idea: the argument, observation, question, or experience
- Possible angle: why it is worth a full post
- Notes/examples: useful stories, links, evidence, counterarguments, or fragments
- Possible tags

Do not create a public blog post yet.

## 2. Draft a post

When Farish says **“draft this”**, create a Markdown or MDX file in `src/content/blog/` with `draft: true`.

Use this frontmatter:

```yaml
---
title: Working title
description: One-sentence description for the blog index and search/social metadata.
published: 2026-08-22
draft: true
tags:
  - AI
featured: false
archive: false
---
```

Draft posts are loaded and schema-validated by Astro, but are excluded from the public blog index, article routes, tags, homepage, and RSS feed.

## 3. Revise

Revisions happen by updating the same file. Keep the slug stable unless there is a good reason to change the URL.

Useful editorial checks before publishing:

- The opening makes the point quickly.
- The post sounds like Farish rather than generic marketing copy.
- Claims that need evidence are sourced.
- Counterarguments are represented fairly.
- The title and description match what the post actually argues.
- Tags are useful for browsing rather than keyword stuffing.

## 4. Publish

When Farish says **“publish this”**:

1. Confirm the final title, description, tags, and publication date from the approved draft.
2. Change `draft: true` to `draft: false`.
3. Set `published` to the intended publication date if needed.
4. Set `updated` only for meaningful post-publication revisions.
5. Commit the change to `main`.

A push to `main` triggers the GitHub validation build. Once the repository is connected to Cloudflare Workers Builds, that same push can trigger the production deployment automatically.

## Frontmatter fields

| Field | Required | Purpose |
| --- | --- | --- |
| `title` | yes | Post title |
| `description` | yes | Index, RSS, SEO, and social description |
| `published` | yes | Publication date |
| `updated` | no | Meaningful revision date |
| `draft` | no | Defaults to `false`; drafts are never publicly generated |
| `tags` | no | Topic navigation and related-post matching |
| `featured` | no | Highlights a post on the Writing page |
| `archive` | no | Marks older migrated material |

## URLs

A file named `src/content/blog/example-post.mdx` publishes at:

`https://farish.dev/writing/example-post`

Tag archives publish under:

`https://farish.dev/writing/tags/<tag>`

The RSS feed is:

`https://farish.dev/rss.xml`
