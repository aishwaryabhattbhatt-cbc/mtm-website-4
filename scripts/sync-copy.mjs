/**
 * sync-copy.mjs
 * Fetches all configured Google Sheets tabs and writes them to
 * src/content/copy/{pageId}.json — the CMS reads these files first
 * in dev and build, so no live network fetches are needed during dev.
 *
 * Usage: npm run sync-copy
 *
 * HOW URLs ARE RESOLVED (in priority order):
 *  1. GOOGLE_SHEET_ID in .env  →  export?format=csv  (live, no CDN cache — recommended)
 *  2. GOOGLE_SHEET_CSV_URL_MAP_JSON in .env  →  used as-is (may lag 1-5 min after edits)
 *
 * To enable instant sync, add your real spreadsheet ID to .env:
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

function parseCSV(csvText) {
  // Split into lines respecting quoted fields
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

// ── Tab GID map (mirrors src/lib/cms/config.ts DEFAULT_PAGE_TAB_MAP) ─────────

const DEFAULT_TAB_MAP = {
  home: '328712104',
  seo: '135464300',
  'mtm-18-plus': '7615361',
  juniors: '1128385549',
  newcomers: '1277962868',
  census: '0',
  'analytic-tools': '1734378829',
  'census-tool': '606257462',
  insights: '1724411017',
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

  // Fall back to pub URLs — may lag 1-5 minutes after sheet edits due to Google CDN caching.
  // Add GOOGLE_SHEET_ID to .env to fix this permanently (see comment at top of file).
  const rawMap = env.GOOGLE_SHEET_CSV_URL_MAP_JSON ?? process.env.GOOGLE_SHEET_CSV_URL_MAP_JSON;
  if (!rawMap) {
    // No main sheet configured — at minimum sync solutions pages
    return { urlMap: { ...SOLUTIONS_PUB_URL_MAP }, mode: 'pub' };
  }

  try {
    return { urlMap: { ...JSON.parse(rawMap), ...SOLUTIONS_PUB_URL_MAP }, mode: 'pub' };
  } catch {
    return { urlMap: { ...SOLUTIONS_PUB_URL_MAP }, mode: 'pub' };
  }
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
    for (let attempt = 1; attempt <= 3 && !dict; attempt++) {
      try {
        const res = await fetch(url, {
          redirect: 'follow',
          headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const csv = await res.text();
        dict = parseCSV(csv);
      } catch (err) {
        lastErr = err;
        if (attempt < 3) await new Promise((r) => setTimeout(r, attempt * 500));
      }
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

  if (anyFailed) process.exit(1);
}

console.log('\n📋  sync-copy — pulling Google Sheets content\n');
main().then(() => console.log('\n✅  Done. Commit src/content/copy/ to keep copy versioned.\n'));
