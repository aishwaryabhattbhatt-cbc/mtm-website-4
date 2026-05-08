import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();
const includeDirs = ['src', 'public'];
const allowedHtmlPages = new Set(['src/pages/index.astro']);
const errors = [];

function walk(dirPath) {
  for (const entry of readdirSync(dirPath)) {
    const absolutePath = path.join(dirPath, entry);
    const relativePath = path.relative(projectRoot, absolutePath);

    if (relativePath.startsWith('.claude') || relativePath.startsWith('.astro') || relativePath.startsWith('dist') || relativePath.startsWith('node_modules')) {
      continue;
    }

    const stat = statSync(absolutePath);
    if (stat.isDirectory()) {
      walk(absolutePath);
      continue;
    }

    if (!/\.(astro|js|ts|mjs|css)$/.test(relativePath)) {
      continue;
    }

    const content = readFileSync(absolutePath, 'utf8');

    if (relativePath.startsWith('src/') && content.includes('href="#"')) {
      errors.push(`${relativePath}: replace placeholder href="#" links with real destinations.`);
    }

    if (relativePath.startsWith('src/') && content.includes('style="')) {
      errors.push(`${relativePath}: avoid inline style attributes in Astro templates.`);
    }

    if ((relativePath.startsWith('src/') || relativePath === 'public/js/runtime/script.js') && content.includes('console.log(')) {
      errors.push(`${relativePath}: remove console.log debug output from production code.`);
    }

    if (relativePath.startsWith('src/pages/') && content.includes('<html') && !allowedHtmlPages.has(relativePath)) {
      errors.push(`${relativePath}: pages should use Layout.astro instead of duplicating full document HTML.`);
    }
  }
}

for (const dir of includeDirs) {
  walk(path.join(projectRoot, dir));
}

if (errors.length > 0) {
  console.error('\nProduction site audit failed:\n');
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log('Production site audit passed.');
