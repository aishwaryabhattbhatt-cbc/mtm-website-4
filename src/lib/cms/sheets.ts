import Papa from 'papaparse';
import type { CMSDictionary, CMSRow } from './types';

function normalizeCell(value: unknown): string {
    if (value === null || value === undefined) return '';
    return String(value).trim();
}

function isHeaderRow(firstCell: string): boolean {
    const normalized = firstCell.toLowerCase();
    return normalized.startsWith('key') || normalized === 'tag' || normalized === 'id';
}

function findColumnIndex(headers: string[], candidates: string[]): number {
    return headers.findIndex((header) => {
        const normalized = header.toLowerCase();
        return candidates.some((candidate) => normalized.includes(candidate));
    });
}

export function parseSheetCsv(csvText: string): CMSDictionary {
    const parsed = Papa.parse<string[]>(csvText, {
        skipEmptyLines: true,
    });

    const rows = (parsed.data ?? []) as string[][];
    const dictionary: CMSDictionary = {};
    const headerRow = rows[0]?.map((cell) => normalizeCell(cell)) ?? [];
    const hasHeader = headerRow.length > 0 && isHeaderRow(headerRow[0]);

    const keyIndex = 0;
    const englishIndex = hasHeader
        ? (() => {
              const updatedEnglish = findColumnIndex(headerRow, [
                  'updated text (english)',
                  'updated text english',
                  'english',
              ]);
              if (updatedEnglish !== -1) return updatedEnglish;

              const currentText = findColumnIndex(headerRow, ['current text', 'text']);
              if (currentText !== -1) return currentText;

              return 1;
          })()
        : 1;

    const frenchIndex = hasHeader
        ? findColumnIndex(headerRow, ['updated text (french)', 'updated text french', 'french'])
        : 2;

    rows.forEach((row, index) => {
        if (!row || row.length === 0) return;

        const key = normalizeCell(row[keyIndex]);

        if (index === 0 && hasHeader) return;
        if (!key) return;

        const en = normalizeCell(row[englishIndex]);
        const fr = frenchIndex >= 0 ? normalizeCell(row[frenchIndex]) : '';

        const normalized: CMSRow = {
            key,
            en,
            fr,
        };

        dictionary[key] = normalized;
    });

    return dictionary;
}

export async function fetchSheetDictionary(csvUrl: string): Promise<CMSDictionary> {
    const response = await fetch(csvUrl, { cache: 'no-store', redirect: 'follow' });

    if (!response.ok) {
        throw new Error(`[CMS] Failed to fetch sheet CSV (${response.status})`);
    }

    const csvText = await response.text();
    return parseSheetCsv(csvText);
}
