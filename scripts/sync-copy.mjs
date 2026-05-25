/**
 * sync-copy.mjs
 * Fetches all configured Google Sheets tabs and writes them to
 * src/content/copy/{pageId}.json — the CMS reads these files first
 * in dev and build, so no live network fetches are needed during dev.
 *
 * Usage: npm run sync-copy
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
    const u = findCol(headerRow, ['updated text (english)', 'english', 'en']);
    if (u !== -1) return u;
    const t = findCol(headerRow, ['current text', 'text']);
    return t !== -1 ? t : 1;
  })();
  const frIdx = findCol(headerRow, ['updated text (french)', 'french', 'fr']);
  const currentTextIdx = findCol(headerRow, ['current text', 'text']);

  const dict = {};
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const key = normalizeCell(row[0]);
    if (!key) continue;
    const currentText = currentTextIdx >= 0 ? normalizeCell(row[currentTextIdx]) : '';
    const en = normalizeCell(row[enIdx]) || currentText;
    const fr = frIdx >= 0 ? normalizeCell(row[frIdx]) : '';
    dict[key] = { key, en, fr };
  }
  return dict;
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const env = loadEnv();

  const rawMap = env.GOOGLE_SHEET_CSV_URL_MAP_JSON ?? process.env.GOOGLE_SHEET_CSV_URL_MAP_JSON;
  if (!rawMap) {
    console.error('❌  GOOGLE_SHEET_CSV_URL_MAP_JSON not found in .env or environment');
    process.exit(1);
  }

  let csvUrlMap;
  try {
    csvUrlMap = JSON.parse(rawMap);
  } catch {
    console.error('❌  Failed to parse GOOGLE_SHEET_CSV_URL_MAP_JSON — check JSON syntax in .env');
    process.exit(1);
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
      const res = await fetch(url, { redirect: 'follow' });
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
