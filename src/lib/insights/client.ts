import type { Locale } from '../cms/types';

export interface InsightProduct {
    id: string;
    name: string;
    variant: string | null;
}
export interface InsightAction {
    kind: 'request' | 'download';
    label: string;
    url?: string | null;
}
export interface InsightCard {
    id: number;
    type: string;
    title: string;
    subheading: string;
    description: string;
    publishedDate: string;
    dateLabel: string;
    imageUrl: string | null;
    graphIconSrc: string | null;
    graphTitle: string;
    graphDetail: string;
    chartSrc: string | null;
    chartAlt: string;
    isEmailCatcher: boolean;
    canRequest: boolean;
    products: InsightProduct[];
    tags: string[];
    actions: InsightAction[];
}
export interface InsightsCatalog {
    reports: InsightCard[];
    featuredReportId: number | null;
    freeReportIds: number[];
    infographicReportId: number | null;
    productSampleReportIds: Record<string, number>;
}

const pending = new Map<Locale, Promise<InsightsCatalog>>();
export function resetCatalogCache() {
    pending.clear();
}
export function getCatalog(locale: Locale): Promise<InsightsCatalog> {
    let request = pending.get(locale);
    if (!request) {
        request = (async () => {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 20000);
            try {
                const response = await fetch(`/api/insights/reports?locale=${locale}`, {
                    headers: { Accept: 'application/json' },
                    credentials: 'same-origin',
                    cache: 'no-store',
                    signal: controller.signal,
                });
                if (!response.ok) throw new Error(`Report request failed: ${response.status}`);
                const value: InsightsCatalog = await response.json();
                if (
                    !Array.isArray(value.reports) ||
                    !Array.isArray(value.freeReportIds) ||
                    !value.productSampleReportIds
                )
                    throw new Error('Invalid report response');
                return value;
            } finally {
                clearTimeout(timeout);
            }
        })().catch((error: unknown) => {
            pending.delete(locale);
            throw error;
        });
        pending.set(locale, request);
    }
    return request;
}

export function safeLocalPath(value: string | null | undefined): string | null {
    if (!value || !value.startsWith('/') || value.startsWith('//') || value.includes('\\'))
        return null;
    if (
        [...value].some(
            (character) => character.charCodeAt(0) < 32 || character.charCodeAt(0) === 127
        )
    )
        return null;
    try {
        const url = new URL(value, window.location.origin);
        return url.origin === window.location.origin ? url.pathname + url.search + url.hash : null;
    } catch {
        return null;
    }
}

export function positiveId(value: string | null): number | null {
    if (!value || !/^[1-9]\d*$/.test(value)) return null;
    const id = Number(value);
    return Number.isSafeInteger(id) && id <= 2147483647 ? id : null;
}

export function actionHref(
    report: InsightCard,
    action: InsightAction,
    catalog: InsightsCatalog,
    locale: Locale,
    sourcePath?: string
): string | null {
    if (action.kind !== 'request') return safeLocalPath(action.url);
    const page = catalog.freeReportIds.includes(report.id)
        ? 'report-download'
        : 'report-download-2';
    const from = safeLocalPath(sourcePath) ?? window.location.pathname + window.location.hash;
    return `${import.meta.env.BASE_URL}${locale}/insights/${page}/?reportId=${report.id}&from=${encodeURIComponent(from)}`;
}
