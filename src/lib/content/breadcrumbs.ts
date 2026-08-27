// Home -> Page by default. A middle tier is only correct when the section
// actually has an index route to link to — /insights/ does, so topic pages
// under it pass one; Products/Solutions/Tools still don't, so don't add a
// middle ListItem for those or it points at a 404.
interface ParentCrumb {
    name: string;
    url: string;
}

export function buildBreadcrumbList(
    siteRoot: string,
    pageName: string,
    pageUrl: string,
    parent?: ParentCrumb
) {
    const items = [
        { '@type': 'ListItem', position: 1, name: 'Home', item: siteRoot },
        ...(parent
            ? [{ '@type': 'ListItem', position: 2, name: parent.name, item: parent.url }]
            : []),
    ];

    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            ...items,
            { '@type': 'ListItem', position: items.length + 1, name: pageName, item: pageUrl },
        ],
    };
}
