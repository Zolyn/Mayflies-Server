"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path_1 = require("path");
const rootDir = (path) => (0, path_1.resolve)(__dirname, '../../', path);
console.log('Generating package.json for production...');
const packageFile = JSON.parse(fs.readFileSync(rootDir('package.json'), { encoding: 'utf-8' }));
packageFile.name = 'ephemeres-server-production';
packageFile.scripts = undefined;
fs.writeFileSync(rootDir('dist/package.json'), JSON.stringify(packageFile));
console.log('Done.');
console.log('Copying vercel configuration...');
fs.copyFileSync(rootDir('vercel.json'), rootDir('dist/vercel.json'));
console.log('Done.');
//# sourceMappingURL=postbuild.js.map