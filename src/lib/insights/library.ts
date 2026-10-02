import type { InsightCard, InsightsCatalog } from './client';

const libraryProducts: Record<string, string> = {
    mtm18plus: 'OG',
    junior: 'JR',
    newcomers: 'NC',
};

export function libraryReports(catalog: InsightsCatalog, filter: string): InsightCard[] {
    const productIds =
        filter === 'all'
            ? Object.values(libraryProducts)
            : [libraryProducts[filter]].filter(Boolean);
    const selectedIds = new Set<number>();

    for (const productId of productIds) {
        // The fallback permits deploying Astro before the updated API.
        const ids =
            catalog.libraryReportIdsByProduct?.[productId] ??
            catalog.reports
                .filter((report) => report.products.some((product) => product.id === productId))
                .slice(0, 4)
                .map((report) => report.id);
        ids.forEach((id) => selectedIds.add(id));
    }

    // Keep the API's newest-first order and show shared reports once in All.
    return catalog.reports.filter((report) => selectedIds.has(report.id));
}
