import * as fs from 'fs';
import * as url from 'url';

const FILES_TO_COPY = [
]
const FOLDERS_TO_COPY = [
    "assets"
]

const DIST_FOLDER_NAME = "dist-release";
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


console.log("Copying FILES in dist folter...")
FILES_TO_COPY.forEach(fileName => {
    fs.copyFileSync(`${__src}${fileName}`, `${__dist}${fileName}`);
});
console.log("FILES copied properly in dist folder!")


console.log("Copying FOLDERS in dist folter...")
FOLDERS_TO_COPY.forEach(folder => {
    fs.cpSync(`${__src}${folder}`, `${__dist}/${folder}`, {recursive: true});
})
console.log("FOLDERS copied properly in dist folder!")


console.log("Building...")



// function copyFolder(folderName){
//     const subSrcPath = `${__src}${folderName}`
//     const subDistPath = `${__dist}/${folderName}`
//     fs.mkdirSync(subDistPath)
//     const fileList = fs.readdirSync(subSrcPath)
//     fileList.forEach(fileName =>{
//         fs.copyFileSync(`${subSrcPath}/${fileName}`, `${subDistPath}/${fileName}`)
//     })
// }
