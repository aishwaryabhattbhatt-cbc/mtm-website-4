import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import type { Locale } from './types';

export interface NewsItem {
    languages: string[];
    products: string[];
    title: string;
    link: string;
    date: string;
    platform: string;
}

function getLocalNewsPath(): string {
    return resolve(process.cwd(), 'src/content/copy', 'news-items.json');
}

export function getNewsItems(): NewsItem[] {
    const path = getLocalNewsPath();
    if (!existsSync(path)) {
        console.warn('[CMS] No local news-items.json found. Run `npm run sync-copy`.');
        return [];
    }
    try {
        return JSON.parse(readFileSync(path, 'utf-8')) as NewsItem[];
    } catch {
        console.warn('[CMS] Failed to parse news-items.json.');
        return [];
    }
}

export function getNewsItemsForLocale(locale: Locale): NewsItem[] {
    const target = locale === 'fr' ? 'french' : 'english';
    // Rows can be tagged "English, French" but only carry a single headline/link —
    // there's no separate per-language text. Matching on "includes" would let a
    // French-only headline leak onto the English page (and vice versa) whenever
    // that shared headline happens to be written in the other language. Requiring
    // an exact single-language tag is the only way to guarantee correct-language
    // text per page until the sheet has separate en/fr title+link columns.
    return getNewsItems().filter(
        (item) => item.languages.length === 1 && item.languages[0].toLowerCase() === target
    );
}
