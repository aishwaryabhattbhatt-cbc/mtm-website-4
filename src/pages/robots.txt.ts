/**
 * robots.txt — endpoint so the Sitemap line follows the configured site + base.
 * A hardcoded sitemap URL is worse than none: crawlers cache the 404.
 */
import type { APIRoute } from 'astro';

const root = new URL(import.meta.env.BASE_URL, import.meta.env.SITE).href;

const body = `User-agent: *
Allow: /

Sitemap: ${root}sitemap-index.xml
`;

export const GET: APIRoute = () =>
    new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
