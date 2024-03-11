import * as fs from 'fs';

import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const __src = __dirname.replace("Utils", "src")
const __dist = __dirname.replace("Utils", "dist")

console.log(__src)

fs.copyFileSync(`${__src}index.html`, `${__dist}index.html`);
