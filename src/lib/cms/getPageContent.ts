import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { getPageCMSConfig, getPublishedCsvUrl } from './config';
import { fetchSheetDictionary } from './sheets';
import type { CMSDictionary, PageCMSConfig } from './types';

const inMemoryCache = new Map<string, CMSDictionary>();
const SHARED_PAGE_ID = 'home';
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

    let sharedDictionary: CMSDictionary = {};
    if (pageId !== SHARED_PAGE_ID) {
        sharedDictionary = await getPageDictionary(SHARED_PAGE_ID);
    }

    // 1. Local copy file (written by `npm run sync-copy`) — fast, no network
    const localPath = getLocalCopyPath(pageId);
    if (existsSync(localPath)) {
        try {
            const dict = JSON.parse(readFileSync(localPath, 'utf-8')) as CMSDictionary;
            const mergedDict =
                pageId === SHARED_PAGE_ID
                    ? dict
                    : {
                          ...sharedDictionary,
                          ...dict,
                      };
            if (useInMemoryCache) {
                inMemoryCache.set(pageId, mergedDict);
            }
            return mergedDict;
        } catch {
            console.warn(
                `[CMS] Failed to read local copy for "${pageId}", falling back to sheet fetch`
            );
        }
    }

    // 2. Live sheet fetch (fallback when local file doesn't exist)
    const config = getPageCMSConfig(pageId);
    const csvUrl =
        config.csvUrl ||
        (config.sheetId && config.gid ? getPublishedCsvUrl(config.sheetId, config.gid) : undefined);

    if (!csvUrl) {
        console.warn(
            `[CMS] No local copy and no sheet URL configured for "${pageId}". Run \`npm run sync-copy\`.`
        );
        return {};
    }

    try {
        const dictionary = await fetchSheetDictionary(csvUrl);
        const mergedDictionary =
            pageId === SHARED_PAGE_ID
                ? dictionary
                : {
                      ...sharedDictionary,
                      ...dictionary,
                  };
        if (useInMemoryCache) {
            inMemoryCache.set(pageId, mergedDictionary);
        }
        return mergedDictionary;
    } catch (error) {
        console.warn(
            `[CMS] Failed to load page dictionary for "${pageId}". Run \`npm run sync-copy\` to create a local copy.`,
            error
        );
        return {};
    }
}

export function getRuntimeCMSConfig(pageId: string): PageCMSConfig {
    return getPageCMSConfig(pageId);
}
