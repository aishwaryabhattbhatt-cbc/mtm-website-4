import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { getPageCMSConfig } from './config';
import type { CMSDictionary, PageCMSConfig } from './types';

const inMemoryCache = new Map<string, CMSDictionary>();
const SHARED_PAGE_ID = 'home';
// Page <title>/meta-description copy for every page, centralized in one tab
// rather than scattered across each page's own sheet — merged in below like
// SHARED_PAGE_ID, so every page (including home) picks up its own X_page_title
// / X_page_description keys automatically.
const SEO_PAGE_ID = 'seo';
// Aria-labels/alt text for shared components (Navbar, Footer, CarouselNavArrows
// call sites, etc.) that render identically across many different pages —
// merged everywhere for the same reason SHARED_PAGE_ID and SEO_PAGE_ID are.
const ALT_LABELS_PAGE_ID = 'alt-labels';
const useInMemoryCache = process.env.NODE_ENV === 'production';

function getLocalCopyPath(pageId: string): string {
    // Resolved from process.cwd() (the project root), not import.meta.url — the
    // build bundles this module into dist/.prerender/chunks, which breaks any
    // path resolved relative to the compiled module's own location.
    return resolve(process.cwd(), 'src/content/copy', `${pageId}.json`);
}

export async function getPageDictionary(pageId: string): Promise<CMSDictionary> {
    if (useInMemoryCache && inMemoryCache.has(pageId)) {
        return inMemoryCache.get(pageId) ?? {};
    }

    // SEO_PAGE_ID is a flat title/description dictionary — it never needs
    // SHARED_PAGE_ID's nav/footer keys, so skip that fetch here. Without this,
    // 'seo' pulls in 'home', which pulls 'seo' back in, forever.
    let sharedDictionary: CMSDictionary = {};
    if (pageId !== SHARED_PAGE_ID && pageId !== SEO_PAGE_ID && pageId !== ALT_LABELS_PAGE_ID) {
        sharedDictionary = await getPageDictionary(SHARED_PAGE_ID);
    }
    let seoDictionary: CMSDictionary = {};
    if (pageId !== SEO_PAGE_ID && pageId !== ALT_LABELS_PAGE_ID) {
        seoDictionary = await getPageDictionary(SEO_PAGE_ID);
    }
    let altLabelsDictionary: CMSDictionary = {};
    if (pageId !== ALT_LABELS_PAGE_ID) {
        altLabelsDictionary = await getPageDictionary(ALT_LABELS_PAGE_ID);
    }

    // 1. Local copy file (written by `npm run sync-copy`) — fast, no network
    const localPath = getLocalCopyPath(pageId);
    if (existsSync(localPath)) {
        try {
            const dict = JSON.parse(readFileSync(localPath, 'utf-8')) as CMSDictionary;
            const mergedDict = {
                ...sharedDictionary,
                ...seoDictionary,
                ...altLabelsDictionary,
                ...dict,
            };
            if (useInMemoryCache) {
                inMemoryCache.set(pageId, mergedDict);
            }
            return mergedDict;
        } catch {
            console.warn(`[CMS] Local copy for "${pageId}" is unreadable or invalid JSON.`);
        }
    }

    // No local copy: nothing more to try. `npm run sync-copy` writes one JSON
    // per page and they are committed, so this is a missing-file problem rather
    // than something to fetch around. Fetching the sheet at build time used to
    // live here; it could not fire — every pageId a page actually asks for has
    // a committed JSON — and it cost a runtime papaparse dependency.
    console.warn(`[CMS] No local copy for "${pageId}". Run \`npm run sync-copy\` to create one.`);
    return {};
}

export function getRuntimeCMSConfig(pageId: string): PageCMSConfig {
    // Live-reload from the published sheet is dev-only — production visitors
    // must never see in-progress spreadsheet edits. Omitting the csv/sheet
    // info here makes the runtime script's own no-op guard kick in.
    if (!import.meta.env.DEV) {
        return { pageId, refreshMs: getPageCMSConfig(pageId).refreshMs };
    }
    return getPageCMSConfig(pageId);
}
