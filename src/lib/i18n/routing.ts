import type { Locale } from '../cms/types';

export const SUPPORTED_LOCALES: Locale[] = ['en', 'fr'];
export const DEFAULT_LOCALE: Locale = 'en';

export function resolveLocale(raw?: string): Locale {
    return raw === 'fr' ? 'fr' : DEFAULT_LOCALE;
}

export function getLocaleSwitchUrls(base: string, path = ''): Record<Locale, string> {
    const normalizedPath = path ? `${path.replace(/^\/+|\/+$/g, '')}/` : '';
    return {
        en: `${base}en/${normalizedPath}`,
        fr: `${base}fr/${normalizedPath}`,
    };
}

// hreflang and JSON-LD `url` fields must be fully-qualified per Google's spec —
// internal <a href> usage (Navbar, etc.) works fine with the root-relative
// paths above, but resolve through this before emitting either of those two.
export function toAbsoluteUrl(site: URL | undefined, path: string): string {
    return site ? new URL(path, site).toString() : path;
}
