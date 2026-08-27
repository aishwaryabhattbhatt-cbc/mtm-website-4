/**
 * llms.txt — https://llmstxt.org/
 *
 * An endpoint rather than a static public/ file so every URL is built from the
 * configured site + base. Changing domain is then one env var (see README),
 * not a hand-edit of 15 absolute URLs that silently rot when they are missed.
 */
import type { APIRoute } from 'astro';

const root = new URL(import.meta.env.BASE_URL, import.meta.env.SITE).href;

const body = `# MTM (Media Technology Monitor)

> MTM is a research initiative that tracks how Canadians use media and technology. It publishes nationally representative, bilingual survey data through a family of products, each fielded by a named third-party research partner.

MTM data informs media, advertising, education, industry, and government/NGO decision-making across Canada. Reports and tools are available in English and French.

Every URL below has a French equivalent at the same path, with \`/en/\` replaced by \`/fr/\`.

A plain-text Markdown version of every page below is served at the same path with \`.md.txt\` appended in place of the trailing slash — for example \`${root}en/about-us.md.txt\`.

## About

- [MTM Home](${root}en/): Overview of the MTM dataset, products, and the sectors it serves.
- [About MTM](${root}en/about-us/): Continuous, independent research measuring how Canadians use media and technology since 2005 — methodology, team, and dataset framework.

## Products

- [MTM 18+](${root}en/products/mtm-18-plus/): Media and technology habits of Canadians aged 18+. Fielded by Forum Research (est. 1993). 25+ years of continuous data collection, 12,000+ Canadian adults surveyed annually.
- [MTM Juniors](${root}en/products/juniors/): Media and technology habits of Canadians aged 2-17. Fielded by Ad Hoc Research (est. 1984).
- [MTM Newcomers](${root}en/products/newcomers/): Media and technology habits of newcomers to Canada who have arrived in the last 5 years. Fielded by Léger.
- [MTM Census Tool](${root}en/tools/census-tool/): Demographic data tool built on Statistics Canada census data, queryable to the postal-code level.
- [MTM Analytic Tools](${root}en/tools/analytic-tools/): Query MTM's full dataset with the Data Analysis Tool, Trending Tool, and Forecasting Tool for custom audience and media insights.

## Solutions

- [Media](${root}en/solutions/media/): Audience behaviour and platform-shift data for broadcasters and media companies.
- [Advertising](${root}en/solutions/advertising/): Data to plan, target, and validate advertising campaigns across every platform and demographic.
- [Education](${root}en/solutions/education/): Data for education-sector research, curriculum planning, and understanding student media habits.
- [Industry](${root}en/solutions/industry/): Consumer and market trend data for industry and enterprise teams.
- [Government & NGOs](${root}en/solutions/gov-ngos/): Data to inform public-sector and non-profit decisions, funding, and outreach strategy.

## Insights

- [Insights](${root}en/insights/): Reports, infographics, and data stories on Canadian media and technology trends, drawn from MTM's continuous research since 2002.
- [AI & Emerging Technology in Canada](${root}en/insights/ai-emerging-technology/): MTM research on AI adoption and emerging technology use in Canada — generative AI, AI tools, technology adoption, digital behaviours and connected devices, across Canadian adults, youth, and newcomers.

## Get Access

- [Request a Demo](${root}en/request-demo/): Book a walkthrough with an MTM expert — how to get access to the products, tools, and reports.
`;

export const GET: APIRoute = () =>
    new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
