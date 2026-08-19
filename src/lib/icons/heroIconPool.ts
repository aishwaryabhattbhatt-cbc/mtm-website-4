import { icons } from './registry';

// Media-consumption themed categories only — excludes tool/dashboard icons,
// product badges (18+/JR/NC logos), solutions category icons, and
// census-tool, which look out of place floating in a hero. Shared by
// ProductsHeroSection and SolutionsHeroSection so both heroes draw from the
// same curated pool.
const HERO_ICON_CATEGORIES = [
    'demographics',
    'demographics-group',
    'demographics-household',
    'demographics-income',
    'demographics-language',
    'demographics-user',
    'device-audio',
    'device-cellphone',
    'device-gaming',
    'device-tablet',
    'device-tv',
    'service-audio-podcast',
    'service-audio-radio',
    'service-internet',
    'service-news',
    'service-social',
    'service-streaming',
    'service-video-online',
    'service-video-shortform',
    'service-video-svod',
    'gen',
    'time',
] as const;

const EXCLUDED_ICON_PATHS = new Set<string>([
    // Already shown in the product pages' Features/benefits rows
    // (Mtm18PlusFeaturesSection, JuniorsFeaturesSection,
    // NewcomersFeaturesSection) — kept out of the hero pool so the same
    // icon doesn't visibly repeat between the hero and the benefits below it.
    icons.gen.largeSamples,
    icons.gen.bilingual,
    icons['demographics-group'].newcomers,
    // Already shown in ProductMethodologySection, for the same reason.
    icons.gen.sampleCoverage,
    icons.gen.surveyDesign,
    icons.gen.sampleComposition,
    icons.gen.researchProvider,
    // Certification/trust-badge style icons — read as "benefit" iconography
    // rather than device/data icons, out of place floating in a photo hero.
    icons.gen.badgeOne,
    icons.gen.badgeStar,
    icons.gen.checkmark,
    icons.gen.credibility,
    icons.gen.qa,
    icons.gen.accreditedResearch,
    // Chip/circuit icon reads the same way — generic "tech" iconography, not
    // a device or data-consumption icon.
    icons.gen.tech,
]);

export function getHeroIconPool(base: string): string[] {
    return HERO_ICON_CATEGORIES.flatMap((category) =>
        Object.values(icons[category])
            .filter((path) => !EXCLUDED_ICON_PATHS.has(path))
            .map((path) => `${base}${path}`)
    );
}
