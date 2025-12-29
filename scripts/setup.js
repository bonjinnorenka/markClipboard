// turndown.jsとturndown-plugin-gfm.jsをlib/にコピーするセットアップスクリプト
const fs = require('fs');
const path = require('path');

// lib/ディレクトリがなければ作成
const libDir = path.join(__dirname, '../lib');
if (!fs.existsSync(libDir)) {
    fs.mkdirSync(libDir, { recursive: true });
}

// turndown.jsをコピー
const turndownSrc = path.join(__dirname, '../node_modules/turndown/lib/turndown.browser.umd.js');
const turndownDest = path.join(libDir, 'turndown.js');
fs.copyFileSync(turndownSrc, turndownDest);
console.log('turndown.js をコピーしました');

// turndown-plugin-gfm.jsをコピー
const gfmSrc = path.join(__dirname, '../node_modules/joplin-turndown-plugin-gfm/dist/turndown-plugin-gfm.js');
const gfmDest = path.join(libDir, 'turndown-plugin-gfm.js');
fs.copyFileSync(gfmSrc, gfmDest);
console.log('turndown-plugin-gfm.js をコピーしました');
