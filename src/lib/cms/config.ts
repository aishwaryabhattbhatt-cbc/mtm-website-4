import type { PageCMSConfig, PageTabMap } from './types';

const DEFAULT_PAGE_TAB_MAP: PageTabMap = {
    home: '328712104',
    'mtm-18-plus': '7615361',
    juniors: '1128385549',
    newcomers: '1277962868',
    census: '0',
    'analytic-tools': '1734378829',
    'census-tool': '606257462',
    insights: '1724411017',
    media: '0',
    advertising: '0',
    industry: '0',
    education: '0',
    'gov-ngos': '0',
};

const DEFAULT_PAGE_CSV_URL_MAP: PageTabMap = {
    home: '',
    'mtm-18-plus':
        'https://docs.google.com/spreadsheets/d/e/2PACX-1vTtJO_WQ583iizQJkxxd7JsA4lvGBfLM5HuqU2uXYEvdyUPWyo3O8JHJgU-9rxB3g/pub?gid=7615361&single=true&output=csv',
    juniors:
        'https://docs.google.com/spreadsheets/d/e/2PACX-1vTtJO_WQ583iizQJkxxd7JsA4lvGBfLM5HuqU2uXYEvdyUPWyo3O8JHJgU-9rxB3g/pub?gid=1128385549&single=true&output=csv',
    newcomers:
        'https://docs.google.com/spreadsheets/d/e/2PACX-1vTtJO_WQ583iizQJkxxd7JsA4lvGBfLM5HuqU2uXYEvdyUPWyo3O8JHJgU-9rxB3g/pub?gid=1277962868&single=true&output=csv',
    census: '',
    'analytic-tools':
        'https://docs.google.com/spreadsheets/d/e/2PACX-1vTtJO_WQ583iizQJkxxd7JsA4lvGBfLM5HuqU2uXYEvdyUPWyo3O8JHJgU-9rxB3g/pub?gid=1734378829&single=true&output=csv',
    'census-tool':
        'https://docs.google.com/spreadsheets/d/e/2PACX-1vTtJO_WQ583iizQJkxxd7JsA4lvGBfLM5HuqU2uXYEvdyUPWyo3O8JHJgU-9rxB3g/pub?gid=606257462&single=true&output=csv',
    insights:
        'https://docs.google.com/spreadsheets/d/e/2PACX-1vTtJO_WQ583iizQJkxxd7JsA4lvGBfLM5HuqU2uXYEvdyUPWyo3O8JHJgU-9rxB3g/pub?gid=1724411017&single=true&output=csv',
    media: '',
    advertising: '',
    industry: '',
    education: '',
    'gov-ngos': '',
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
        console.warn(
            '[CMS] Invalid GOOGLE_SHEET_CSV_URL_MAP_JSON. Falling back to defaults.',
            error
        );
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
