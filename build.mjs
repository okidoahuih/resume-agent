import { mkdir, copyFile, rm } from 'node:fs/promises';

// Keep the Vercel build explicitly static. `server.mjs` is only for local use.
const output = 'dist';
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await Promise.all(['index.html', 'styles.css', 'app.js', 'manifest.webmanifest', 'sw.js'].map((file) => copyFile(file, `${output}/${file}`)));
console.log('Static site generated in dist');
