export const BLOG_CATEGORIES = [
  {
    name: 'AI in Practice',
    slug: 'ai-in-practice',
    description: 'What works, what doesn’t, and where the gap between the pitch and reality starts to show.',
  },
  {
    name: 'Software & Building',
    slug: 'software-and-building',
    description: 'Tools, experiments, workflows, and the occasional thing I built because I wanted to see if I could.',
  },
  {
    name: 'Technical Education',
    slug: 'technical-education',
    description: 'How people actually learn complicated technical subjects, especially while the technology keeps moving.',
  },
  {
    name: 'Work',
    slug: 'work',
    description: 'Observations about products, teams, careers, leadership, and what happens when technology meets real organizations.',
  },
] as const;

export type BlogCategoryName = (typeof BLOG_CATEGORIES)[number]['name'];

export function categorySlug(name: string) {
  const category = BLOG_CATEGORIES.find((item) => item.name === name);
  if (category) return category.slug;

  return name
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function categoryFromSlug(slug: string) {
  return BLOG_CATEGORIES.find((category) => category.slug === slug);
}
