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
