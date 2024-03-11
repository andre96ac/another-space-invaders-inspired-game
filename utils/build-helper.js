import * as fs from 'fs';
import * as url from 'url';

const DIST_FOLDER_NAME = "dist";
const SRC_FOLDER_NAME = "src"
const UTILS_FOLDER_NAME = "utils"

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const __src = __dirname.replace(UTILS_FOLDER_NAME, SRC_FOLDER_NAME)
const __dist = __dirname.replace(UTILS_FOLDER_NAME, DIST_FOLDER_NAME)

if(fs.existsSync(__dist)){
    console.log("Deleting old dist folder...");
    fs.rmSync(__dist, {recursive: true})
    console.log("Old dist folder properly deleted!");
}


console.log("Creating empty dist folder...");
fs.mkdirSync(__dist);
console.log("New dist folder properly created!")


console.log("Copying index.html in dist folter...")
fs.copyFileSync(`${__src}index.html`, `${__dist}index.html`);
console.log("Index.html copied properly in dist folder!")

console.log("Building...")
