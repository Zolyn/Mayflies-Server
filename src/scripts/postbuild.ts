import * as fs from 'fs';
import { resolve } from 'path';

const rootDir = (path: string) => resolve(__dirname, '../../', path);

console.log('Generating package.json for production...');
const packageFile = JSON.parse(
  fs.readFileSync(rootDir('package.json'), { encoding: 'utf-8' }),
);

packageFile.name = 'ephemeres-server-production';
packageFile.scripts = undefined;

fs.writeFileSync(rootDir('dist/package.json'), JSON.stringify(packageFile));

console.log('Done.');

console.log('Copying vercel configuration...');

fs.copyFileSync(rootDir('vercel.prod.json'), rootDir('dist/vercel.json'));

console.log('Done.');
