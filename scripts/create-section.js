#!/usr/bin/env node
// scripts/create-section.js
// Usage: node scripts/create-section.js SectionName

const fs = require('fs');
const path = require('path');



if (process.argv.length < 5) {
  console.error('Usage: node scripts/create-section.js PageName SectionName AstroPagePath');
  process.exit(1);
}

const pageName = process.argv[2]; // e.g., 'home', 'mtm18plus'
const sectionName = process.argv[3]; // e.g., 'Hero', 'Stats'
const astroPagePath = process.argv[4]; // e.g., '../src/pages/[locale]/index.astro'

// Folder for the page's components
const folderName = pageName.toLowerCase();
const fileName = `${pageName.charAt(0).toUpperCase() + pageName.slice(1)}${sectionName}.astro`;
const destDir = path.join(__dirname, '../src/components', folderName);
const destPath = path.join(destDir, fileName);

const template = `---
import type { CMSDictionary, Locale } from '../../lib/cms/types';
import { t } from '../../lib/i18n/t';

interface Props {
  locale: Locale;
  copy: CMSDictionary;
}

const { locale, copy } = Astro.props as Props;
const copyKeys = {
  title: '${sectionName.toLowerCase()}_title',
  subtitle: '${sectionName.toLowerCase()}_subtitle',
};
---

<section class="section ${folderName}-section-${sectionName.toLowerCase()}">
  <div class="container mx-auto px-4 py-16">
    <h1 class="heading-xl mb-8">{t(copy, copyKeys.title, locale, 'Default Title')}</h1>
    <p class="body-lg mb-4">{t(copy, copyKeys.subtitle, locale, 'Default subtitle')}</p>
    <!-- Add more content/components here -->
  </div>
</section>
`;

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

if (fs.existsSync(destPath)) {
  console.error(`File already exists: ${destPath}`);
  process.exit(1);
}

fs.writeFileSync(destPath, template, 'utf8');
console.log(`Section created: ${destPath}`);

// Insert import and usage into the Astro page
const astroPageFullPath = path.isAbsolute(astroPagePath)
  ? astroPagePath
  : path.join(__dirname, '..', astroPagePath);

if (!fs.existsSync(astroPageFullPath)) {
  console.error(`Astro page not found: ${astroPageFullPath}`);
  process.exit(1);
}

const importStatement = `import ${pageName.charAt(0).toUpperCase() + pageName.slice(1)}${sectionName} from '../../components/${folderName}/${fileName}';\n`;
const usageStatement = `    <${pageName.charAt(0).toUpperCase() + pageName.slice(1)}${sectionName} locale={locale} copy={copy} />\n`;

let astroPageContent = fs.readFileSync(astroPageFullPath, 'utf8');

// Add import after last import
const importRegex = /^(import .+;\s*)+/m;
if (importRegex.test(astroPageContent)) {
  astroPageContent = astroPageContent.replace(importRegex, (match) => match + importStatement);
} else {
  astroPageContent = importStatement + astroPageContent;
}

// Add usage before closing </main> (or at the end if not found)
const mainCloseTag = '</main>';
if (astroPageContent.includes(mainCloseTag)) {
  astroPageContent = astroPageContent.replace(mainCloseTag, usageStatement + mainCloseTag);
} else {
  astroPageContent += '\n' + usageStatement;
}

fs.writeFileSync(astroPageFullPath, astroPageContent, 'utf8');
console.log(`Component imported and used in: ${astroPageFullPath}`);
