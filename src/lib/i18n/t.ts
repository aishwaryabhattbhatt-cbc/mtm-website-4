import type { CMSDictionary, Locale } from '../cms/types';

export function t(
  dictionary: CMSDictionary,
  key: string,
  locale: Locale,
  fallback = ''
): string {
  const row = dictionary[key];
  if (!row) {
    console.warn(`[CMS] Missing key: ${key}`);
    return fallback || `[${key}]`;
  }

  const localized = locale === 'fr' ? row.fr : row.en;
  if (localized) return localized;

  if (row.en) {
    console.warn(`[CMS] Missing locale "${locale}" for key "${key}". Falling back to English.`);
    return row.en;
  }

  console.warn(`[CMS] Missing English fallback for key "${key}".`);
  return fallback || `[${key}]`;
}
