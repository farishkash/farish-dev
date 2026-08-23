const pages = ['/', '/work', '/about', '/writing', '/writing/the-starting-point'];

export function GET() {
  const urls = pages.map((path) => `<url><loc>https://farish.dev${path}</loc></url>`).join('');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, {
    headers: { 'Content-Type': 'application/xml' },
  });
}
