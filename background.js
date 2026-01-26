// Service Worker for markClipboard extension
// コンテキストメニューの登録と処理

const MENU_ID = 'markClipboard';
const MENU_ID_READABILITY = 'markClipboardReadability';

// 拡張機能インストール時にコンテキストメニューを作成
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: MENU_ID,
        title: 'markClipboard - Markdownにコピー',
        contexts: ['page', 'selection']
    });
    chrome.contextMenus.create({
        id: MENU_ID_READABILITY,
        title: 'markClipboard - 本文のみMarkdownにコピー',
        contexts: ['page', 'selection']
    });
});

// コンテキストメニュークリック時の処理
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === MENU_ID) {
        // content scriptにメッセージを送信
        chrome.tabs.sendMessage(tab.id, {
            action: 'convertToMarkdown',
            hasSelection: !!info.selectionText
        });
    } else if (info.menuItemId === MENU_ID_READABILITY) {
        // Readabilityを使用した変換
        chrome.tabs.sendMessage(tab.id, {
            action: 'convertToMarkdownReadability',
            hasSelection: !!info.selectionText
        });
    }
});
