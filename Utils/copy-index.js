import * as fs from 'fs';
import * as url from 'url';

console.log("Copying index.html in dist folter...")

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const __src = __dirname.replace("utils", "src")
const __dist = __dirname.replace("utils", "dist")


fs.copyFileSync(`${__src}index.html`, `${__dist}index.html`);
console.log("Index.html copied properly in dist folder!")
