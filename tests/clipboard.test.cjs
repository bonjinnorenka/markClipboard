const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const contentScript = fs.readFileSync(path.join(__dirname, '..', 'content.js'), 'utf8');

function loadCopyFunction({ clipboard, execCommand = () => true } = {}) {
    const calls = [];
    const selectedRange = { cloneRange() { return this; } };
    const selection = {
        rangeCount: 1,
        getRangeAt() { return selectedRange; },
        removeAllRanges() { calls.push('clearSelection'); },
        addRange(range) {
            assert.equal(range, selectedRange);
            calls.push('restoreSelection');
        }
    };
    const textarea = {
        value: '',
        style: {},
        setAttribute() {},
        focus() { calls.push('focusTextarea'); },
        select() { calls.push('selectTextarea'); },
        remove() { calls.push('removeTextarea'); }
    };
    const document = {
        activeElement: { focus() { calls.push('restoreFocus'); } },
        body: {
            appendChild(element) {
                assert.equal(element, textarea);
                calls.push('appendTextarea');
            }
        },
        createElement(tag) {
            assert.equal(tag, 'textarea');
            return textarea;
        },
        execCommand(command) {
            calls.push('execCommand');
            assert.equal(command, 'copy');
            return execCommand();
        }
    };
    const context = {
        navigator: clipboard === undefined ? {} : { clipboard },
        document,
        window: { getSelection: () => selection },
        console: { warn() {}, error() {} },
        chrome: { runtime: { onMessage: { addListener() {} } } },
        TurndownService: class { use() {} },
        turndownPluginGfm: { gfm: {} }
    };
    vm.runInNewContext(contentScript, context, { filename: 'content.js' });
    return { copyToClipboard: context.copyToClipboard, calls, textarea };
}

test('uses modern Clipboard API when available', async () => {
    const copied = [];
    const { copyToClipboard, calls } = loadCopyFunction({
        clipboard: { writeText: async text => copied.push(text) }
    });
    assert.equal(await copyToClipboard('hello'), true);
    assert.deepEqual(copied, ['hello']);
    assert.deepEqual(calls, []);
});

test('falls back to execCommand on HTTP pages without navigator.clipboard', async () => {
    const { copyToClipboard, calls, textarea } = loadCopyFunction();
    assert.equal(await copyToClipboard('markdown'), true);
    assert.equal(textarea.value, 'markdown');
    assert.deepEqual(calls, [
        'appendTextarea', 'focusTextarea', 'selectTextarea', 'execCommand',
        'removeTextarea', 'restoreFocus', 'clearSelection', 'restoreSelection'
    ]);
});

test('falls back if Clipboard API rejects', async () => {
    const { copyToClipboard, calls } = loadCopyFunction({
        clipboard: { writeText: async () => { throw new Error('Denied'); } }
    });
    assert.equal(await copyToClipboard('markdown'), true);
    assert.ok(calls.includes('execCommand'));
});

test('reports copy failure when fallback returns false', async () => {
    const { copyToClipboard, calls } = loadCopyFunction({
        execCommand: () => false
    });
    assert.equal(await copyToClipboard('markdown'), false);
    assert.ok(calls.includes('restoreSelection'));
});

test('reports copy failure and cleans up when fallback throws', async () => {
    const { copyToClipboard, calls } = loadCopyFunction({
        execCommand: () => { throw new Error('Copy blocked'); }
    });
    assert.equal(await copyToClipboard('markdown'), false);
    assert.ok(calls.includes('removeTextarea'));
    assert.ok(calls.includes('restoreFocus'));
});
