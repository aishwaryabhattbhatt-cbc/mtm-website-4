export type Locale = 'en' | 'fr';

export type CMSRow = {
  key: string;
  en: string;
  fr: string;
};

export type CMSDictionary = Record<string, CMSRow>;

export type PageTabMap = Record<string, string>;

export type PageCMSConfig = {
  pageId: string;
  csvUrl?: string;
  sheetId?: string;
  gid?: string;
  refreshMs: number;
};
