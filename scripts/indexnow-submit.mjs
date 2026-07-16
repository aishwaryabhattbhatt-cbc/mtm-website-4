/**
 * indexnow-submit.mjs
 * Pings the IndexNow API (relayed to Bing, Yandex, Naver, etc.) with every URL
 * in the live sitemap, so those crawlers get pushed changes instead of only
 * discovering them on their own crawl cycle. Run after a deploy, once the
 * site is actually live — it fetches the sitemap over HTTP, not from dist/.
 *
 * Usage: node scripts/indexnow-submit.mjs
 */

const SITE_ORIGIN = 'https://aishwaryabhattbhatt-cbc.github.io';
const BASE_PATH = '/mtm-website-4';
const INDEXNOW_KEY = '1cae23d9e1e9afde45908fe7ea265e6f';

async function fetchSitemapUrls() {
  const indexRes = await fetch(`${SITE_ORIGIN}${BASE_PATH}/sitemap-index.xml`);
  if (!indexRes.ok) throw new Error(`sitemap-index.xml: HTTP ${indexRes.status}`);
  const indexXml = await indexRes.text();
  const chunkUrls = [...indexXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

  const urls = [];
  for (const chunkUrl of chunkUrls) {
    const res = await fetch(chunkUrl);
    if (!res.ok) throw new Error(`${chunkUrl}: HTTP ${res.status}`);
    const xml = await res.text();
    urls.push(...[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]));
  }
  return urls;
}

async function main() {
  const urlList = await fetchSitemapUrls();
  console.log(`📡  Submitting ${urlList.length} URLs to IndexNow…`);

  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host: new URL(SITE_ORIGIN).host,
      key: INDEXNOW_KEY,
      keyLocation: `${SITE_ORIGIN}${BASE_PATH}/${INDEXNOW_KEY}.txt`,
      urlList,
    }),
  });

  // IndexNow returns 200 or 202 on success; both mean "accepted".
  if (res.ok || res.status === 202) {
    console.log(`✅  IndexNow accepted the submission (HTTP ${res.status}).`);
  } else {
    console.error(`❌  IndexNow submission failed: HTTP ${res.status} ${await res.text()}`);
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error('❌  IndexNow submission errored:', err.message);
  // Non-fatal — don't fail the deploy over a discovery-acceleration ping.
  process.exitCode = 0;
});
