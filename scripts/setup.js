// turndown.jsをlib/にコピーするセットアップスクリプト
const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, '../node_modules/turndown/lib/turndown.browser.umd.js');
const dest = path.join(__dirname, '../lib/turndown.js');

// lib/ディレクトリがなければ作成
const libDir = path.dirname(dest);
if (!fs.existsSync(libDir)) {
    fs.mkdirSync(libDir, { recursive: true });
}

fs.copyFileSync(src, dest);
console.log('turndown.js をコピーしました');
