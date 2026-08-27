// Dataset schema for Google Dataset Search / the dataset rich result. Only the
// product pages carry it — each one is the landing page for one recurring
// survey. The survey data itself is gated, so there is no `distribution` node
// and `isAccessibleForFree` is false; Google still indexes the metadata.
interface DatasetArgs {
    siteRoot: string;
    url: string;
    name: string;
    description: string;
    keywords: string[];
    // ISO 8601 interval; open-ended ("2001/..") for the ongoing surveys.
    temporalCoverage: string;
    locale: string;
}

export function buildDataset({
    siteRoot,
    url,
    name,
    description,
    keywords,
    temporalCoverage,
    locale,
}: DatasetArgs) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Dataset',
        name,
        description,
        url,
        keywords,
        // Name + url alongside the @id: Google won't follow an @id defined on
        // another page, and it wants a named creator on a Dataset.
        creator: {
            '@type': 'Organization',
            '@id': `${siteRoot}#organization`,
            name: 'MTM',
            url: siteRoot,
        },
        publisher: { '@id': `${siteRoot}#organization` },
        isAccessibleForFree: false,
        spatialCoverage: { '@type': 'Country', name: 'Canada' },
        temporalCoverage,
        inLanguage: locale === 'fr' ? 'fr-CA' : 'en-CA',
    };
}
