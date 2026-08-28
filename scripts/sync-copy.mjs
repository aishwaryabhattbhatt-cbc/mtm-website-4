/**
 * sync-copy.mjs
 * Fetches all configured Google Sheets tabs and writes them to
 * src/content/copy/{pageId}.json — the CMS reads these files first
 * in dev and build, so no live network fetches are needed during dev.
 *
 * Usage: npm run sync-copy
 *
 * HOW URLs ARE RESOLVED (in priority order):
 *  1. GOOGLE_SHEET_ID in .env  →  export?format=csv  (live, no CDN cache — needs edit access)
 *  2. GOOGLE_SHEET_CSV_URL_MAP_JSON in .env  →  overrides/extends the hardcoded map below
 *  3. Hardcoded published CSV URLs (MAIN_PUB_URL_MAP / SOLUTIONS_PUB_URL_MAP)  →  the
 *     default — works out of the box for anyone with read access to the published
 *     sheets, no .env or GitHub secret required. May lag 1-5 min after edits due to
 *     Google's CDN cache. Add a new tab here (and to DEFAULT_TAB_MAP) rather than a
 *     GitHub secret whenever a new page/tab is added.
 *
 * To enable instant sync (no CDN lag), add your real spreadsheet ID to .env:
 *   GOOGLE_SHEET_ID=<the ID from your sheet's edit URL>
 * The ID is the long string between /d/ and /edit in the browser address bar.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '..');

// ── Env loader ────────────────────────────────────────────────────────────────

function loadEnv() {
  const envPath = join(projectRoot, '.env');
  if (!existsSync(envPath)) return {};
  const env = {};
  for (const line of readFileSync(envPath, 'utf-8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
  }
  return env;
}

// ── CSV parser (mirrors sheets.ts logic) ─────────────────────────────────────

function normalizeCell(v) {
  return v == null ? '' : String(v).trim();
}

function findCol(headers, candidates) {
  return headers.findIndex(h =>
    candidates.some(c => h.toLowerCase().includes(c))
  );
}

function tokenizeCsv(csvText) {
  // Split into rows of cells, respecting quoted fields
  const rows = [];
  let cur = [], field = '', inQuote = false;
  for (let i = 0; i < csvText.length; i++) {
    const ch = csvText[i];
    if (ch === '"') {
      if (inQuote && csvText[i + 1] === '"') { field += '"'; i++; }
      else inQuote = !inQuote;
    } else if (ch === ',' && !inQuote) {
      cur.push(field); field = '';
    } else if ((ch === '\n' || ch === '\r') && !inQuote) {
      if (ch === '\r' && csvText[i + 1] === '\n') i++;
      cur.push(field); field = '';
      if (cur.some(c => c !== '')) rows.push(cur);
      cur = [];
    } else {
      field += ch;
    }
  }
  if (field || cur.length) { cur.push(field); rows.push(cur); }
  return rows;
}

async function fetchCsvWithRetries(url) {
  let lastErr;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      // Node's fetch has no default response timeout. Without this signal a
      // Sheets connection that opens but never answers hangs forever: nothing
      // throws, so neither the retry below nor the keep-existing-JSON fallback
      // in main() ever runs, and CI sits on this step until the job is killed.
      // A whole sync of 30+ tabs normally takes ~17s, so 15s per attempt is
      // already far beyond a healthy response.
      const res = await fetch(url, {
        redirect: 'follow',
        signal: AbortSignal.timeout(15_000),
        headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.text();
    } catch (err) {
      lastErr = err;
      if (attempt < 3) await new Promise((r) => setTimeout(r, attempt * 500));
    }
  }
  throw lastErr;
}

function parseCSV(csvText) {
  const rows = tokenizeCsv(csvText);

  if (rows.length === 0) return {};

  const headerRow = rows[0].map(c => normalizeCell(c));
  const firstCell = headerRow[0].toLowerCase();
  const hasHeader = firstCell === 'key' || firstCell === 'tag' || firstCell === 'id';
  if (!hasHeader) return {};

  const enIdx = (() => {
    // Check in priority order: most specific first, to avoid 'en' matching 'current text'
    const specific = findCol(headerRow, ['updated text (english)']);
    if (specific !== -1) return specific;
    const english = findCol(headerRow, ['english']);
    if (english !== -1) return english;
    const current = findCol(headerRow, ['current text', 'text']);
    if (current !== -1) return current;
    return 1;
  })();
  const frIdx = findCol(headerRow, ['updated text (french)', 'french', 'fr']);

  const dict = {};
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const key = normalizeCell(row[0]);
    if (!key) continue;
    const en = normalizeCell(row[enIdx]);
    const fr = frIdx >= 0 ? normalizeCell(row[frIdx]) : '';
    dict[key] = { key, en, fr };
  }
  return dict;
}

// ── In the News (Insights page) — separate published sheet, one row per
// article rather than the key/en/fr dictionary shape every other tab uses.
// Two header variants are supported: a "Title"+"Link" pair, or two columns
// both literally named "Link" (the first holding the headline text) — in
// that case the first "link"-named column is treated as the title and the
// last as the URL.

const NEWS_CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vSGdktvNmQ1aTzBsHsqF12vK6Nk4W9QVmkbNywbEl6elMmHVGH4Lb9LkCYuIsAK7DadNXW6qt0Mc0dC/pub?output=csv';

function parseNewsRows(csvText) {
  const rows = tokenizeCsv(csvText);
  if (rows.length < 2) return [];

  const headerRow = rows[0].map(c => normalizeCell(c).toLowerCase());
  const languageIdx = headerRow.indexOf('language');
  const productIdx = headerRow.indexOf('product');
  const dateIdx = headerRow.indexOf('date');
  const platformIdx = headerRow.indexOf('platform');
  const titleIdx = headerRow.includes('title') ? headerRow.indexOf('title') : headerRow.indexOf('link');
  const linkIdx = headerRow.lastIndexOf('link');

  const items = [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const title = normalizeCell(row[titleIdx]);
    if (!title) continue;
    items.push({
      languages: normalizeCell(row[languageIdx]).split(',').map(s => s.trim()).filter(Boolean),
      products: normalizeCell(row[productIdx]).split(',').map(s => s.trim()).filter(Boolean),
      title,
      link: normalizeCell(row[linkIdx]),
      date: normalizeCell(row[dateIdx]),
      platform: normalizeCell(row[platformIdx]),
    });
  }
  return items;
}

// ── Tab GID map (mirrors src/lib/cms/config.ts DEFAULT_PAGE_TAB_MAP) ─────────

const DEFAULT_TAB_MAP = {
  home: '328712104',
  seo: '135464300',
  'alt-labels': '1381991042',
  'mtm-18-plus': '7615361',
  juniors: '1128385549',
  newcomers: '1277962868',
  census: '0',
  'analytic-tools': '1734378829',
  'census-tool': '606257462',
  insights: '1724411017',
  // No tab yet — gid '0' is skipped below, leaving the committed JSON alone.
  'insights-ai-technology': '0',
  'about-us': '550283014',
  // Small utility pages share one tab — keys are page-prefixed to avoid
  // collisions (sign_in_*, register_*, request_demo_*, etc.)
  'request-demo': '133994915',
  'request-demo-success': '133994915',
  'sign-in': '133994915',
  'forgot-password': '133994915',
  register: '133994915',
  'register-success': '133994915',
  'contact-success': '133994915',
  contact: '133994915',
  'report-download': '133994915',
  'download-success': '133994915',
};

// Solutions pages live on a separate spreadsheet — always use published CSV URLs directly.
const SOLUTIONS_PUB_URL_MAP = {
  media: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQsmnkAj6Ua-ePN8jhlMR7P5DWJMoaeUQax6js_mWYv_-30Sll92GvDW0xKkK-DQA/pub?gid=1361843616&single=true&output=csv',
  advertising: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQsmnkAj6Ua-ePN8jhlMR7P5DWJMoaeUQax6js_mWYv_-30Sll92GvDW0xKkK-DQA/pub?gid=769668628&single=true&output=csv',
  industry: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQsmnkAj6Ua-ePN8jhlMR7P5DWJMoaeUQax6js_mWYv_-30Sll92GvDW0xKkK-DQA/pub?gid=2038951837&single=true&output=csv',
  education: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQsmnkAj6Ua-ePN8jhlMR7P5DWJMoaeUQax6js_mWYv_-30Sll92GvDW0xKkK-DQA/pub?gid=682166038&single=true&output=csv',
  'gov-ngos': 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQsmnkAj6Ua-ePN8jhlMR7P5DWJMoaeUQax6js_mWYv_-30Sll92GvDW0xKkK-DQA/pub?gid=611009991&single=true&output=csv',
};

// Main content spreadsheet (home, alt-labels, products, tools, insights, about-us,
// seo, and the shared utility-pages tab) — published, no secret/env needed. Built
// straight from DEFAULT_TAB_MAP so a new tab only ever needs a gid added there.
const MAIN_SHEET_PUBLISH_ID =
  '2PACX-1vTtJO_WQ583iizQJkxxd7JsA4lvGBfLM5HuqU2uXYEvdyUPWyo3O8JHJgU-9rxB3g';
const MAIN_PUB_URL_MAP = Object.fromEntries(
  Object.entries(DEFAULT_TAB_MAP)
    .filter(([, gid]) => gid && gid !== '0')
    .map(([pageId, gid]) => [
      pageId,
      `https://docs.google.com/spreadsheets/d/e/${MAIN_SHEET_PUBLISH_ID}/pub?gid=${gid}&single=true&output=csv`,
    ])
);

// ── Build the URL map from available env config ───────────────────────────────

function buildCsvUrlMap(env) {
  const sheetId = env.GOOGLE_SHEET_ID ?? process.env.GOOGLE_SHEET_ID;

  if (sheetId) {
    // export?format=csv bypasses Google's CDN cache — always returns live data
    const tabMapRaw = env.GOOGLE_SHEET_TAB_MAP_JSON ?? process.env.GOOGLE_SHEET_TAB_MAP_JSON;
    const tabMap = tabMapRaw
      ? { ...DEFAULT_TAB_MAP, ...JSON.parse(tabMapRaw) }
      : DEFAULT_TAB_MAP;

    const urlMap = {};
    for (const [pageId, gid] of Object.entries(tabMap)) {
      if (gid && gid !== '0') {
        urlMap[pageId] = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;
      }
    }
    // Solutions are on a separate spreadsheet — always merge pub URLs for them
    return { urlMap: { ...urlMap, ...SOLUTIONS_PUB_URL_MAP }, mode: 'export' };
  }

  // No GOOGLE_SHEET_ID (the common case — it requires edit access most
  // contributors won't have): use published CSV URLs, hardcoded here so
  // syncing never depends on a GitHub secret or local .env. An optional
  // GOOGLE_SHEET_CSV_URL_MAP_JSON can still override/extend this if needed.
  const rawMap = env.GOOGLE_SHEET_CSV_URL_MAP_JSON ?? process.env.GOOGLE_SHEET_CSV_URL_MAP_JSON;
  let envOverrides = {};
  if (rawMap) {
    try {
      envOverrides = JSON.parse(rawMap);
    } catch {
      // ignore malformed override, fall back to the hardcoded map
    }
  }
  return {
    urlMap: { ...MAIN_PUB_URL_MAP, ...envOverrides, ...SOLUTIONS_PUB_URL_MAP },
    mode: 'pub',
  };
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const env = loadEnv();
  const { urlMap: csvUrlMap, mode } = buildCsvUrlMap(env);

  if (!csvUrlMap || Object.keys(csvUrlMap).length === 0) {
    console.error('❌  No sheet config found. Set GOOGLE_SHEET_ID or GOOGLE_SHEET_CSV_URL_MAP_JSON in .env');
    process.exit(1);
  }

  if (mode === 'pub') {
    console.log('⚠️   Using published CSV URLs — changes may take 1-5 min to appear after editing.');
    console.log('    Add GOOGLE_SHEET_ID=<your-sheet-id> to .env for instant sync.\n');
  }

  const outputDir = join(projectRoot, 'src', 'content', 'copy');
  mkdirSync(outputDir, { recursive: true });

  let anyFailed = false;

  for (const [pageId, url] of Object.entries(csvUrlMap)) {
    if (!url) {
      console.log(`⚠️   ${pageId}: no URL configured, skipping`);
      continue;
    }

    process.stdout.write(`  Syncing ${pageId}… `);

    const outPath = join(outputDir, `${pageId}.json`);
    const hadExistingCopy = existsSync(outPath);

    let lastErr;
    let dict;
    try {
      dict = parseCSV(await fetchCsvWithRetries(url));
    } catch (err) {
      lastErr = err;
    }

    if (dict) {
      const keys = Object.keys(dict);
      writeFileSync(outPath, JSON.stringify(dict, null, 2));

      console.log(`✓  ${keys.length} keys`);
      for (const key of keys) {
        const en = dict[key].en.slice(0, 60) + (dict[key].en.length > 60 ? '…' : '');
        console.log(`      ${key.padEnd(35)} ${en}`);
      }
    } else if (hadExistingCopy) {
      // A previously-synced copy is already committed — keep serving it rather
      // than failing the whole build over one flaky Google Sheets fetch.
      console.log(`⚠️   ${lastErr.message} — keeping existing src/content/copy/${pageId}.json`);
    } else {
      console.log(`❌  ${lastErr.message} — no existing copy to fall back on`);
      anyFailed = true;
    }
  }

  process.stdout.write(`  Syncing in-the-news… `);
  const newsOutPath = join(outputDir, 'news-items.json');
  const hadExistingNews = existsSync(newsOutPath);
  let newsItems, newsErr;
  try {
    newsItems = parseNewsRows(await fetchCsvWithRetries(NEWS_CSV_URL));
  } catch (err) {
    newsErr = err;
  }

  if (newsItems) {
    writeFileSync(newsOutPath, JSON.stringify(newsItems, null, 2));
    console.log(`✓  ${newsItems.length} articles`);
  } else if (hadExistingNews) {
    console.log(`⚠️   ${newsErr.message} — keeping existing src/content/copy/news-items.json`);
  } else {
    console.log(`❌  ${newsErr.message} — no existing copy to fall back on`);
    anyFailed = true;
  }

  if (anyFailed) process.exit(1);
}

console.log('\n📋  sync-copy — pulling Google Sheets content\n');
main().then(() => console.log('\n✅  Done. Commit src/content/copy/ to keep copy versioned.\n'));
