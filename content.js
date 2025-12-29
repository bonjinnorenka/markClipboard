// Content script for markClipboard extension
// turndownを使用してHTMLをMarkdownに変換

// Turndownサービスの初期化（turndown.jsがグローバルにTurndownServiceを提供）
const turndownService = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
    emDelimiter: '*',
    bulletListMarker: '-',
    hr: '---'
});

// GFMプラグインを使用（テーブル、取り消し線、タスクリスト等をサポート）
// turndownPluginGfmはturndown-plugin-gfm.jsがグローバルに提供
turndownService.use(turndownPluginGfm.gfm);

// 通知を表示する関数
function showNotification(message, isSuccess = true) {
    const notification = document.createElement('div');
    notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 16px 24px;
    background: ${isSuccess ? '#4CAF50' : '#f44336'};
    color: white;
    border-radius: 8px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 14px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 2147483647;
    animation: markClipboardSlideIn 0.3s ease-out;
  `;
    notification.textContent = message;

    // アニメーション用のスタイルを追加
    const style = document.createElement('style');
    style.textContent = `
    @keyframes markClipboardSlideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `;
    document.head.appendChild(style);

    document.body.appendChild(notification);

    // 3秒後に自動で消える
    setTimeout(() => {
        notification.style.animation = 'markClipboardSlideIn 0.3s ease-out reverse';
        setTimeout(() => {
            notification.remove();
            style.remove();
        }, 300);
    }, 3000);
}

// HTMLをMarkdownに変換する関数
function convertToMarkdown(hasSelection) {
    let html;
    const title = document.title;
    const url = window.location.href;

    if (hasSelection) {
        // 選択範囲がある場合はその部分のみ変換
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const container = document.createElement('div');
            container.appendChild(range.cloneContents());
            html = container.innerHTML;
        }
    } else {
        // ページ全体を変換
        // 不要な要素を除外したクローンを作成
        const clone = document.body.cloneNode(true);

        // スクリプト、スタイル、その他の不要な要素を削除
        const elementsToRemove = clone.querySelectorAll('script, style, noscript, iframe, svg, nav, footer, header');
        elementsToRemove.forEach(el => el.remove());

        html = clone.innerHTML;
    }

    // Markdownに変換
    let markdown = turndownService.turndown(html);

    // メタ情報を先頭に追加
    const header = `# ${title}\n\n> Source: ${url}\n\n---\n\n`;
    markdown = header + markdown;

    return markdown;
}

// クリップボードにコピーする関数
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        console.error('クリップボードへのコピーに失敗:', err);
        return false;
    }
}

// メッセージリスナー
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'convertToMarkdown') {
        const markdown = convertToMarkdown(message.hasSelection);

        copyToClipboard(markdown).then(success => {
            if (success) {
                showNotification('✓ Markdownをクリップボードにコピーしました');
            } else {
                showNotification('✕ コピーに失敗しました', false);
            }
        });
    }
});
