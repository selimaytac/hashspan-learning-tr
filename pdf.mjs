// Prints _site/print-html/*.html to _site/pdf/*.pdf with headless Chrome, then removes the print sources from _site.
// Run after build.mjs: node pdf.mjs   (CHROME_PATH overrides where Chrome is looked for)
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, rmSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const site = join(dirname(fileURLToPath(import.meta.url)), '_site');
const candidates = [
  process.env.CHROME_PATH,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/google-chrome-stable',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
].filter(Boolean);
const chrome = candidates.find((p) => existsSync(p));
if (!chrome) throw new Error(`Chrome not found; set CHROME_PATH (looked in: ${candidates.join(', ')})`);

const files = JSON.parse(readFileSync(join(site, 'print-html', 'list.json'), 'utf8'));
mkdirSync(join(site, 'pdf'), { recursive: true });
let bytes = 0;
for (const file of files) {
  const pdf = join(site, 'pdf', `${file}.pdf`);
  execFileSync(chrome, [
    '--headless=new', '--disable-gpu', '--no-sandbox', '--no-pdf-header-footer', '--virtual-time-budget=15000',
    '--run-all-compositor-stages-before-draw', `--print-to-pdf=${pdf}`, pathToFileURL(join(site, 'print-html', `${file}.html`)).href,
  ], { stdio: 'ignore' });
  if (!existsSync(pdf)) throw new Error(`no PDF for ${file}`);
  bytes += statSync(pdf).size;
}
rmSync(join(site, 'print-html'), { recursive: true, force: true });
rmSync(join(site, 'print'), { recursive: true, force: true });
console.log(`${files.length} PDFs, ${(bytes / 1048576).toFixed(1)} MiB → ${join(site, 'pdf')}`);
