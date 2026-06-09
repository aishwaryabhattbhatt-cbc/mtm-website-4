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
  'mtm-18-plus': '7615361',
  juniors: '1128385549',
  newcomers: '1277962868',
  census: '0',
  'analytic-tools': '1734378829',
  'census-tool': '606257462',
  insights: '1724411017',
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
    return { urlMap, mode: 'export' };
  }

  // Fall back to pub URLs — may lag 1-5 minutes after sheet edits due to Google CDN caching.
  // Add GOOGLE_SHEET_ID to .env to fix this permanently (see comment at top of file).
  const rawMap = env.GOOGLE_SHEET_CSV_URL_MAP_JSON ?? process.env.GOOGLE_SHEET_CSV_URL_MAP_JSON;
  if (!rawMap) return { urlMap: null, mode: 'pub' };

  try {
    return { urlMap: JSON.parse(rawMap), mode: 'pub' };
  } catch {
    return { urlMap: null, mode: 'pub' };
  }
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const env = loadEnv();
  const { urlMap: csvUrlMap, mode } = buildCsvUrlMap(env);

  if (!csvUrlMap) {
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

    try {
      const res = await fetch(url, {
        redirect: 'follow',
        headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const csv = await res.text();
      const dict = parseCSV(csv);
      const keys = Object.keys(dict);

      const outPath = join(outputDir, `${pageId}.json`);
      writeFileSync(outPath, JSON.stringify(dict, null, 2));

      console.log(`✓  ${keys.length} keys`);
      for (const key of keys) {
        const en = dict[key].en.slice(0, 60) + (dict[key].en.length > 60 ? '…' : '');
        console.log(`      ${key.padEnd(35)} ${en}`);
      }
    } catch (err) {
      console.log(`❌  ${err.message}`);
      anyFailed = true;
    }
  }

  if (anyFailed) process.exit(1);
}

console.log('\n📋  sync-copy — pulling Google Sheets content\n');
main().then(() => console.log('\n✅  Done. Commit src/content/copy/ to keep copy versioned.\n'));
