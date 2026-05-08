import type { PageCMSConfig, PageTabMap } from './types';

const DEFAULT_PAGE_TAB_MAP: PageTabMap = {
  home: '0',
};

const DEFAULT_PAGE_CSV_URL_MAP: PageTabMap = {
  home: '',
};

const DEFAULT_REFRESH_MS = 30000;

function parsePageTabMap(raw?: string): PageTabMap {
  if (!raw) return DEFAULT_PAGE_TAB_MAP;

  try {
    const parsed = JSON.parse(raw) as PageTabMap;
    if (!parsed || typeof parsed !== 'object') {
      return DEFAULT_PAGE_TAB_MAP;
    }
    return { ...DEFAULT_PAGE_TAB_MAP, ...parsed };
  } catch (error) {
    console.warn('[CMS] Invalid GOOGLE_SHEET_TAB_MAP_JSON. Falling back to defaults.', error);
    return DEFAULT_PAGE_TAB_MAP;
  }
}

function parsePageCsvUrlMap(raw?: string): PageTabMap {
  if (!raw) return DEFAULT_PAGE_CSV_URL_MAP;

  try {
    const parsed = JSON.parse(raw) as PageTabMap;
    if (!parsed || typeof parsed !== 'object') {
      return DEFAULT_PAGE_CSV_URL_MAP;
    }
    return { ...DEFAULT_PAGE_CSV_URL_MAP, ...parsed };
  } catch (error) {
    console.warn('[CMS] Invalid GOOGLE_SHEET_CSV_URL_MAP_JSON. Falling back to defaults.', error);
    return DEFAULT_PAGE_CSV_URL_MAP;
  }
}

export function getPageTabMap(): PageTabMap {
  return parsePageTabMap(import.meta.env.GOOGLE_SHEET_TAB_MAP_JSON);
}

export function getPageCsvUrlMap(): PageTabMap {
  return parsePageCsvUrlMap(import.meta.env.GOOGLE_SHEET_CSV_URL_MAP_JSON);
}

export function getSheetId(): string | undefined {
  return import.meta.env.GOOGLE_SHEET_ID;
}

export function getRefreshMs(): number {
  const raw = Number(import.meta.env.PUBLIC_CMS_REFRESH_MS ?? DEFAULT_REFRESH_MS);
  if (!Number.isFinite(raw) || raw < 5000) return DEFAULT_REFRESH_MS;
  return raw;
}

export function getPageCMSConfig(pageId: string): PageCMSConfig {
  const map = getPageTabMap();
  const csvUrlMap = getPageCsvUrlMap();
  return {
    pageId,
    csvUrl: csvUrlMap[pageId],
    sheetId: getSheetId(),
    gid: map[pageId],
    refreshMs: getRefreshMs(),
  };
}

export function getPublishedCsvUrl(sheetId: string, gid: string): string {
  return `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;
}
