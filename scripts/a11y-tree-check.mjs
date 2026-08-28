import fs from 'node:fs';
import path from 'node:path';

const distRoot = path.join(process.cwd(), 'dist');
const STRICT = process.argv.includes('--strict');

// Roles used by the site plus the common ARIA 1.2 set we care about.
const VALID_ROLES = new Set([
  'alert', 'alertdialog', 'application', 'article', 'banner', 'button', 'cell',
  'checkbox', 'columnheader', 'combobox', 'complementary', 'contentinfo',
  'definition', 'dialog', 'directory', 'document', 'feed', 'figure', 'form',
  'grid', 'gridcell', 'group', 'heading', 'img', 'link', 'list', 'listbox',
  'listitem', 'log', 'main', 'marquee', 'math', 'menu', 'menubar', 'menuitem',
  'menuitemcheckbox', 'menuitemradio', 'navigation', 'none', 'note', 'option',
  'presentation', 'progressbar', 'radio', 'radiogroup', 'region', 'row',
  'rowgroup', 'rowheader', 'scrollbar', 'search', 'searchbox', 'separator',
  'slider', 'spinbutton', 'status', 'switch', 'tab', 'table', 'tablist',
  'tabpanel', 'term', 'textbox', 'timer', 'toolbar', 'tooltip', 'tree',
  'treegrid', 'treeitem',
]);

// Roles that must be reachable and operable via keyboard when applied to a
// non-interactive element (div/span/li/a-without-href, etc.).
const INTERACTIVE_ROLES = new Set([
  'button', 'checkbox', 'link', 'menuitem', 'menuitemcheckbox', 'menuitemradio',
  'option', 'radio', 'slider', 'switch', 'tab', 'textbox', 'combobox',
]);

const NATIVELY_FOCUSABLE = new Set(['a', 'button', 'input', 'select', 'textarea', 'summary']);

const BOOLEAN_ARIA = ['aria-expanded', 'aria-pressed', 'aria-selected', 'aria-checked', 'aria-hidden'];

function collectHtmlFiles(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectHtmlFiles(full, files);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      // Skip .html drops that aren't rendered pages — e.g. Google Search
      // Console's verification file, which is a single line of text and must
      // keep its exact contents, so it can never satisfy page-level checks.
      if (fs.readFileSync(full, 'utf8').includes('<html')) files.push(full);
    }
  }
  return files;
}

function getAttr(attrs, name) {
  const re = new RegExp(`${name}\\s*=\\s*(["'])(.*?)\\1`, 'i');
  const m = attrs.match(re);
  return m ? m[2].trim() : '';
}

function stripTags(input) {
  return input.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function hasText(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function checkFile(filePath) {
  const rel = path.relative(process.cwd(), filePath).replaceAll('\\', '/');
  const html = fs.readFileSync(filePath, 'utf8');
  const issues = [];

  const labelsByFor = new Map();
  for (const m of html.matchAll(/<label\b([^>]*)>([\s\S]*?)<\/label>/gi)) {
    const attrs = m[1] || '';
    const labelText = stripTags(m[2] || '');
    const forId = getAttr(attrs, 'for');
    if (forId && hasText(labelText)) {
      labelsByFor.set(forId, labelText);
    }
  }

  if (!/<main\b/i.test(html)) {
    issues.push({ type: 'missing-main-landmark', file: rel, detail: 'No <main> found' });
  }

  for (const m of html.matchAll(/<img\b([^>]*)>/gi)) {
    const attrs = m[1] || '';
    if (!/\balt\b/i.test(attrs)) {
      issues.push({
        type: 'img-missing-alt',
        file: rel,
        detail: stripTags(m[0]).slice(0, 160),
      });
    }
  }

  for (const m of html.matchAll(/<select\b([^>]*)>/gi)) {
    const attrs = m[1] || '';
    const id = getAttr(attrs, 'id');
    const name =
      getAttr(attrs, 'aria-label') ||
      getAttr(attrs, 'aria-labelledby') ||
      (id && labelsByFor.has(id) ? labelsByFor.get(id) : '');

    if (!hasText(name)) {
      issues.push({ type: 'select-no-name', file: rel, detail: stripTags(m[0]).slice(0, 160) });
    }
  }

  for (const m of html.matchAll(/<textarea\b([^>]*)>/gi)) {
    const attrs = m[1] || '';
    const id = getAttr(attrs, 'id');
    const name =
      getAttr(attrs, 'aria-label') ||
      getAttr(attrs, 'aria-labelledby') ||
      (id && labelsByFor.has(id) ? labelsByFor.get(id) : '');

    if (!hasText(name)) {
      issues.push({
        type: 'textarea-no-name',
        file: rel,
        detail: stripTags(m[0]).slice(0, 160),
      });
    }
  }

  for (const m of html.matchAll(/<input\b([^>]*)>/gi)) {
    const attrs = m[1] || '';
    const type = (getAttr(attrs, 'type') || 'text').toLowerCase();
    if (type === 'hidden') continue;

    // Checkbox/radio controls are frequently label-wrapped without explicit
    // aria-label/for wiring in static HTML output. Avoid false positives here.
    if (type === 'checkbox' || type === 'radio') continue;

    const id = getAttr(attrs, 'id');
    const fromLabel = id && labelsByFor.has(id) ? labelsByFor.get(id) : '';

    let name = getAttr(attrs, 'aria-label') || getAttr(attrs, 'aria-labelledby') || fromLabel;

    if (!hasText(name) && ['submit', 'button', 'reset'].includes(type)) {
      name = getAttr(attrs, 'value') || getAttr(attrs, 'title');
    }

    if (!hasText(name) && type === 'image') {
      name = getAttr(attrs, 'alt');
    }

    if (!hasText(name)) {
      issues.push({ type: 'input-no-name', file: rel, detail: stripTags(m[0]).slice(0, 160) });
    }
  }

  for (const m of html.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/gi)) {
    const attrs = m[1] || '';
    const text = stripTags(m[2] || '');
    const name = getAttr(attrs, 'aria-label') || getAttr(attrs, 'aria-labelledby') || text;
    if (!hasText(name)) {
      issues.push({
        type: 'button-no-name',
        file: rel,
        detail: stripTags(m[0]).slice(0, 160),
      });
    }
  }

  // ---------------------------------------------------------------------
  // Strict pass: ARIA role/state consistency + keyboard interaction patterns
  // ---------------------------------------------------------------------
  const strict = [];

  const idCounts = new Map();
  for (const m of html.matchAll(/\sid\s*=\s*(["'])(.*?)\1/gi)) {
    const id = m[2].trim();
    if (id) idCounts.set(id, (idCounts.get(id) || 0) + 1);
  }
  for (const [id, count] of idCounts) {
    if (count > 1) {
      strict.push({ type: 'duplicate-id', file: rel, detail: `#${id} appears ${count}x` });
    }
  }

  const langAttr = getAttr((html.match(/<html\b([^>]*)>/i) || [, ''])[1] || '', 'lang');
  if (!hasText(langAttr)) {
    strict.push({ type: 'html-missing-lang', file: rel, detail: 'No lang on <html>' });
  }

  for (const m of html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)) {
    const attrs = m[1] || '';
    if (!/\shref\s*=/i.test(attrs)) continue;
    const inner = m[2] || '';
    const imgAlt = (inner.match(/<img\b[^>]*>/i) || [''])[0];
    const name =
      getAttr(attrs, 'aria-label') ||
      getAttr(attrs, 'aria-labelledby') ||
      stripTags(inner) ||
      getAttr(imgAlt, 'alt') ||
      getAttr(attrs, 'title');
    if (!hasText(name)) {
      strict.push({ type: 'link-no-name', file: rel, detail: stripTags(m[0]).slice(0, 160) });
    }
  }

  const tagWithAttrs = /<([a-z][a-z0-9-]*)\b([^>]*)>/gi;
  for (const m of html.matchAll(tagWithAttrs)) {
    const tag = m[1].toLowerCase();
    const attrs = m[2] || '';
    if (!/\s(role|aria-|tabindex)/i.test(` ${attrs}`)) continue;

    const role = getAttr(attrs, 'role').toLowerCase();
    const tabindex = getAttr(attrs, 'tabindex');
    const ariaHidden = getAttr(attrs, 'aria-hidden').toLowerCase();
    const snippet = stripTags(m[0]).slice(0, 160) || m[0].slice(0, 160);

    if (hasText(role) && !role.split(/\s+/).every((r) => VALID_ROLES.has(r))) {
      strict.push({ type: 'invalid-role', file: rel, detail: `role="${role}" ${snippet}` });
    }

    for (const state of BOOLEAN_ARIA) {
      if (!new RegExp(`\\s${state}\\s*=`, 'i').test(attrs)) continue;
      const value = getAttr(attrs, state).toLowerCase();
      const allowed =
        state === 'aria-checked' || state === 'aria-selected' || state === 'aria-pressed'
          ? ['true', 'false', 'mixed', 'undefined']
          : ['true', 'false'];
      if (!allowed.includes(value)) {
        strict.push({
          type: 'invalid-aria-state',
          file: rel,
          detail: `${state}="${value}" ${snippet}`,
        });
      }
    }

    for (const ref of ['aria-labelledby', 'aria-describedby', 'aria-controls']) {
      const value = getAttr(attrs, ref);
      if (!hasText(value)) continue;
      for (const target of value.split(/\s+/)) {
        if (!idCounts.has(target)) {
          strict.push({
            type: 'aria-reference-missing-target',
            file: rel,
            detail: `${ref}="${target}" ${snippet}`,
          });
        }
      }
    }

    if (hasText(tabindex) && Number(tabindex) > 0) {
      strict.push({ type: 'positive-tabindex', file: rel, detail: snippet });
    }

    // aria-hidden on a focusable element hides it from the tree while leaving
    // it tabbable. tabindex="-1" is the correct escape hatch, so allow it.
    const isTabbable = hasText(tabindex)
      ? Number(tabindex) >= 0
      : NATIVELY_FOCUSABLE.has(tag) && (tag !== 'a' || /\shref\s*=/i.test(attrs));

    if (ariaHidden === 'true' && isTabbable) {
      strict.push({ type: 'aria-hidden-focusable', file: rel, detail: snippet });
    }

    const isNativeInteractive =
      NATIVELY_FOCUSABLE.has(tag) && (tag !== 'a' || /\shref\s*=/i.test(attrs));

    if (
      INTERACTIVE_ROLES.has(role) &&
      !isNativeInteractive &&
      !hasText(tabindex) &&
      ariaHidden !== 'true'
    ) {
      strict.push({
        type: 'interactive-role-not-focusable',
        file: rel,
        detail: `role="${role}" needs tabindex — ${snippet}`,
      });
    }
  }

  for (const m of html.matchAll(/<(div|span|li|p|section)\b([^>]*)>/gi)) {
    const attrs = m[2] || '';
    if (!/\son(click|keydown|keyup|keypress)\s*=/i.test(attrs)) continue;
    const role = getAttr(attrs, 'role');
    const tabindex = getAttr(attrs, 'tabindex');
    if (!hasText(role) || !hasText(tabindex)) {
      strict.push({
        type: 'click-handler-not-keyboard-accessible',
        file: rel,
        detail: stripTags(m[0]).slice(0, 160) || m[0].slice(0, 160),
      });
    }
  }

  for (const issue of strict) {
    issues.push({ ...issue, strict: true });
  }

  return issues;
}

if (!fs.existsSync(distRoot)) {
  console.error('dist folder not found. Run npm run build first.');
  process.exit(1);
}

const htmlFiles = collectHtmlFiles(distRoot);
const allIssues = htmlFiles.flatMap(checkFile);
const baseIssues = allIssues.filter((issue) => !issue.strict);
const strictIssues = allIssues.filter((issue) => issue.strict);

console.log(`Scanned HTML pages: ${htmlFiles.length}`);

function report(label, list) {
  const grouped = list.reduce((acc, issue) => {
    acc[issue.type] = (acc[issue.type] || 0) + 1;
    return acc;
  }, {});
  console.log(`\n${label}: ${list.length} issue(s)`);
  for (const [type, count] of Object.entries(grouped)) {
    console.log(`- ${type}: ${count}`);
  }
  for (const issue of list.slice(0, 40)) {
    console.log(`  · [${issue.type}] ${issue.file} :: ${issue.detail}`);
  }
}

if (baseIssues.length === 0) {
  console.log('PASS: Baseline accessibility-tree checks passed.');
} else {
  report('FAIL (baseline)', baseIssues);
}

if (strictIssues.length === 0) {
  console.log('PASS: Strict ARIA role/state + keyboard checks passed.');
} else {
  report(STRICT ? 'FAIL (strict)' : 'WARN (strict)', strictIssues);
  if (!STRICT) {
    console.log('\nRun with --strict to treat the above as failures.');
  }
}

if (baseIssues.length > 0 || (STRICT && strictIssues.length > 0)) {
  process.exit(2);
}

process.exit(0);
