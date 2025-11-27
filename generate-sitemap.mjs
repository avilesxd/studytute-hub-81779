import fs from 'fs';
import path from 'path';

const publicDir = path.resolve(process.cwd(), 'public');
const domain = 'https://tutoriasentreestudiantes.vercel.app';

const routes = [
  '/',
  '/profile',
  '/auth',
  '/director',
  '/legal/privacy-policy',
  '/legal/terms-of-service',
  '/tutoring',
];

function generateSitemap() {
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${routes
        .map(route => `
    <url>
        <loc>${domain}${route}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>
    `).join('')}
</urlset>
    `.trim();

    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
    console.log('sitemap.xml generated successfully');
}

generateSitemap();
