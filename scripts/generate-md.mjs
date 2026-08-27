/**
 * generate-md.mjs
 * Emits a plain-text Markdown twin of every indexable page, so LLM agents can
 * read the site without parsing 100KB of HTML. Runs automatically after
 * `npm run build` via the npm `postbuild` lifecycle hook.
 *
 * URLs come from the sitemap that @astrojs/sitemap just wrote — that file is
 * already filtered by isNoindexPath(), so the noindex rules live in exactly one
 * place (astro.config.mjs) and can never drift out of sync with this script.
 *
 * Output uses the `.md.txt` double extension rather than a bare `.md`: GitHub
 * Pages serves unknown extensions as application/octet-stream and offers no
 * _headers override, so `.txt` is what actually gets us text/plain. Same
 * approach ai.google.dev uses for its llms.txt targets.
 *
 * /en/about-us/  ->  dist/en/about-us.md.txt
 *
 * Usage: node scripts/generate-md.mjs
 */

import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { unified } from 'unified';
import rehypeParse from 'rehype-parse';
import rehypeRemark from 'rehype-remark';
import remarkStringify from 'remark-stringify';
import { visit } from 'unist-util-visit';

const DIST = 'dist';
// Mirrors astro.config.mjs — dist/ is served AT this path, so it has to come
// off the sitemap URLs to get a real file path. Stripping "the first segment"
// instead would silently write to the wrong place under a nested base.
const BASE_PATH = process.env.BUILD_BASE_PATH || '/mtm-website-4/';
const SITEMAP = path.join(DIST, 'sitemap-0.xml');

/**
 * Tags dropped whole, children included. nav/header/footer are in here because
 * the Navbar and Footer render *inside* <main> on every page — <main> alone is
 * not the content boundary it looks like, and without this the site chrome is
 * repeated at the top of all 28 files.
 */
const DROP_TAGS = new Set([
    'script',
    'style',
    'noscript',
    'canvas',
    'svg',
    'iframe',
    'template',
    'nav',
    'header',
    'footer',
]);

/**
 * Strips presentational nodes and rewrites relative URLs to absolute ones, so a
 * link or image is still resolvable once the markdown is read away from the site.
 * @param {string} pageUrl absolute URL of the page being converted
 */
function cleanTree(pageUrl) {
    return (tree) => {
        // Astro leaves source comments in the rendered HTML, and rehype-remark
        // passes them straight through. They are implementation notes about CSS
        // classes and image sizing — noise to anything reading this as content.
        visit(tree, 'comment', (node, index, parent) => {
            if (!parent || index === undefined) return;
            parent.children.splice(index, 1);
            return [visit.SKIP, index];
        });

        visit(tree, 'element', (node, index, parent) => {
            if (!parent || index === undefined) return;

            if (DROP_TAGS.has(node.tagName)) {
                parent.children.splice(index, 1);
                return [visit.SKIP, index];
            }

            // alt="" is the author declaring an image decorative. Keeping it
            // would emit a bare ![](...) that is pure noise to a reader.
            if (node.tagName === 'img' && !node.properties?.alt) {
                parent.children.splice(index, 1);
                return [visit.SKIP, index];
            }

            for (const attr of ['href', 'src']) {
                const value = node.properties?.[attr];
                if (typeof value === 'string' && value && !/^[a-z]+:|^#/i.test(value)) {
                    node.properties[attr] = new URL(value, pageUrl).href;
                }
            }
        });
    };
}

/** @param {string} html @param {string} pageUrl */
async function htmlToMarkdown(html, pageUrl) {
    const file = await unified()
        .use(rehypeParse, { fragment: true })
        .use(() => cleanTree(pageUrl))
        .use(rehypeRemark)
        .use(remarkStringify, { bullet: '-', fences: true, rule: '-' })
        .process(html);
    return String(file);
}

/** Pulls <main>; site chrome nested inside it is stripped later by DROP_TAGS. */
function extractMain(html) {
    const match = html.match(/<main[^>]*>([\s\S]*)<\/main>/i);
    return match ? match[1] : undefined;
}

async function main() {
    if (!existsSync(SITEMAP)) {
        console.error(`✗  ${SITEMAP} not found — run \`astro build\` first.`);
        process.exit(1);
    }

    const xml = await readFile(SITEMAP, 'utf-8');
    const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    if (urls.length === 0) {
        console.error('✗  sitemap contained no <loc> entries.');
        process.exit(1);
    }

    let written = 0;
    const skipped = [];

    for (const url of urls) {
        const { pathname } = new URL(url);
        const relative = pathname.startsWith(BASE_PATH) ? pathname.slice(BASE_PATH.length) : pathname.replace(/^\//, '');
        const htmlPath = path.join(DIST, relative, 'index.html');

        if (!existsSync(htmlPath)) {
            skipped.push(`${pathname} (no ${htmlPath})`);
            continue;
        }

        const main = extractMain(await readFile(htmlPath, 'utf-8'));
        if (!main) {
            skipped.push(`${pathname} (no <main>)`);
            continue;
        }

        const body = (await htmlToMarkdown(main, url)).trim();
        // Trailing slash would make dirname/index.md.txt; strip it so the file
        // sits beside the directory as <page>.md.txt.
        const outPath = `${path.join(DIST, relative.replace(/\/$/, '') || 'index')}.md.txt`;

        await writeFile(outPath, `<!-- Source: ${url} -->\n\n${body}\n`, 'utf-8');
        written += 1;
    }

    console.log(`📄  Wrote ${written} .md.txt page(s) from ${urls.length} sitemap URL(s).`);
    if (skipped.length) {
        console.warn(`⚠️   Skipped ${skipped.length}:`);
        for (const s of skipped) console.warn(`      ${s}`);
    }
}

main().catch((err) => {
    console.error('✗  generate-md failed:', err);
    process.exit(1);
});
