import { mkdir, readFile, writeFile } from 'node:fs/promises';

const output = new URL('../dist/', import.meta.url);
const html = await readFile(new URL('index.html', output), 'utf8');

// GitHub Pages serves files directly and has no SPA rewrite configuration.
// Give each public route an entry point so opening or refreshing it returns 200.
for (const route of ['work', 'about']) {
  const directory = new URL(`${route}/`, output);
  await mkdir(directory, { recursive: true });
  await writeFile(new URL('index.html', directory), html);
}

// Unknown paths can still load React Router's existing redirect to Home.
await writeFile(new URL('404.html', output), html);
await writeFile(new URL('.nojekyll', output), '');
