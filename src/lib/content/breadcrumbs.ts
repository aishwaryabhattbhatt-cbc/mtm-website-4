// 2-level only (Home -> Page) — a real middle tier (Products/Solutions/Tools)
// would need actual /products/, /solutions/, /tools/ index routes to link to,
// which don't exist yet. Don't add a middle ListItem pointing at a 404.
export function buildBreadcrumbList(siteRoot: string, pageName: string, pageUrl: string) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: siteRoot },
            { '@type': 'ListItem', position: 2, name: pageName, item: pageUrl },
        ],
    };
}
