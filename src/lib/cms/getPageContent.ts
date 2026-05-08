import { getPageCMSConfig, getPublishedCsvUrl } from './config';
import { fetchSheetDictionary } from './sheets';
import type { CMSDictionary, PageCMSConfig } from './types';

const inMemoryCache = new Map<string, CMSDictionary>();

export async function getPageDictionary(pageId: string): Promise<CMSDictionary> {
  if (inMemoryCache.has(pageId)) {
    return inMemoryCache.get(pageId) ?? {};
  }

  const config = getPageCMSConfig(pageId);
  const csvUrl = config.csvUrl || (config.sheetId && config.gid ? getPublishedCsvUrl(config.sheetId, config.gid) : undefined);

  if (!csvUrl) {
    console.warn(`[CMS] Missing configuration for pageId "${pageId}". Returning empty dictionary.`);
    return {};
  }

  try {
    const dictionary = await fetchSheetDictionary(csvUrl);
    inMemoryCache.set(pageId, dictionary);
    return dictionary;
  } catch (error) {
    console.warn(`[CMS] Failed to load page dictionary for "${pageId}". Falling back to empty dictionary.`, error);
    return {};
  }
}

export function getRuntimeCMSConfig(pageId: string): PageCMSConfig {
  return getPageCMSConfig(pageId);
}
