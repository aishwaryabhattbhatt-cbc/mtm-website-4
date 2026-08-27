/**
 * site.webmanifest — endpoint so start_url and icon paths follow the base path.
 * These were hardcoded to /mtm-website-4/ and would 404 on any other base.
 */
import type { APIRoute } from 'astro';

const base = import.meta.env.BASE_URL;

const manifest = {
    name: 'MTM',
    short_name: 'MTM',
    start_url: `${base}en/`,
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#ffffff',
    icons: [{ src: `${base}images/mtm-favicon.svg`, sizes: 'any', type: 'image/svg+xml' }],
};

export const GET: APIRoute = () =>
    new Response(JSON.stringify(manifest, null, 2), {
        headers: { 'Content-Type': 'application/manifest+json' },
    });
