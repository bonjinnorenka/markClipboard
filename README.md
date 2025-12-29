# markClipboard

右クリックメニューからWebページをMarkdownに変換し、クリップボードにコピーするブラウザ拡張機能です。

## 機能

- 右クリックメニューから「markClipboard - Markdownにコピー」を選択
- ページ全体または選択範囲をMarkdownに変換
- タイトルとURLを自動的にMarkdownの先頭に追加
- Chrome/Firefox両対応（Manifest V3）

## セットアップ

```bash
npm install
npm run setup
```

これでturndown.jsが`lib/`にコピーされます。

## インストール

### Chrome

1. `chrome://extensions` を開く
2. 「デベロッパーモード」を有効化
3. 「パッケージ化されていない拡張機能を読み込む」をクリック
4. このフォルダを選択

### Firefox

1. `about:debugging#/runtime/this-firefox` を開く
2. 「一時的なアドオンを読み込む」をクリック
3. `manifest.json` を選択

## 使い方

1. 任意のWebページで右クリック
2. 「markClipboard - Markdownにコピー」を選択
3. テキストエディタにペーストしてMarkdownを使用

## プロジェクト構造

```
markClipboard/
├── manifest.json      # 拡張機能マニフェスト
├── background.js      # Service Worker
├── content.js         # コンテンツスクリプト
├── lib/
│   └── turndown.js    # HTML→Markdown変換ライブラリ
├── icons/
│   ├── icon16.svg
│   ├── icon48.svg
│   └── icon128.svg
└── scripts/
    └── setup.js       # turndown.jsコピースクリプト
```

## 技術スタック

- [Turndown](https://github.com/mixmark-io/turndown) - HTML→Markdown変換
- Manifest V3

## ライセンス

MIT