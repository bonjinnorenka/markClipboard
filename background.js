// Service Worker for markClipboard extension
// コンテキストメニューの登録と処理

const MENU_ID = 'markClipboard';

// 拡張機能インストール時にコンテキストメニューを作成
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: MENU_ID,
        title: 'markClipboard - Markdownにコピー',
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
    }
});
