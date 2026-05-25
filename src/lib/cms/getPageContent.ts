import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { getPageCMSConfig, getPublishedCsvUrl } from './config';
import { fetchSheetDictionary } from './sheets';
import type { CMSDictionary, PageCMSConfig } from './types';

const inMemoryCache = new Map<string, CMSDictionary>();

function getLocalCopyPath(pageId: string): string {
  const dir = dirname(fileURLToPath(import.meta.url));
  return resolve(dir, `../../content/copy/${pageId}.json`);
}

export async function getPageDictionary(pageId: string): Promise<CMSDictionary> {
  if (inMemoryCache.has(pageId)) {
    return inMemoryCache.get(pageId) ?? {};
  }

  // 1. Local copy file (written by `npm run sync-copy`) — fast, no network
  const localPath = getLocalCopyPath(pageId);
  if (existsSync(localPath)) {
    try {
      const dict = JSON.parse(readFileSync(localPath, 'utf-8')) as CMSDictionary;
      console.log(`[CMS] "${pageId}" loaded from local copy (${Object.keys(dict).length} keys)`);
      inMemoryCache.set(pageId, dict);
      return dict;
    } catch {
      console.warn(`[CMS] Failed to read local copy for "${pageId}", falling back to sheet fetch`);
    }
  }

  // 2. Live sheet fetch (fallback when local file doesn't exist)
  const config = getPageCMSConfig(pageId);
  const csvUrl = config.csvUrl || (config.sheetId && config.gid ? getPublishedCsvUrl(config.sheetId, config.gid) : undefined);

  if (!csvUrl) {
    console.warn(`[CMS] No local copy and no sheet URL configured for "${pageId}". Run \`npm run sync-copy\`.`);
    return {};
  }

  try {
    const dictionary = await fetchSheetDictionary(csvUrl);
    inMemoryCache.set(pageId, dictionary);
    return dictionary;
  } catch (error) {
    console.warn(`[CMS] Failed to load page dictionary for "${pageId}". Run \`npm run sync-copy\` to create a local copy.`, error);
    return {};
  }
}

export function getRuntimeCMSConfig(pageId: string): PageCMSConfig {
  return getPageCMSConfig(pageId);
}
