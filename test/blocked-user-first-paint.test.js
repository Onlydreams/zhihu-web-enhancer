const assert = require('node:assert/strict');
const test = require('node:test');

const { source, createContext } = require('../test-support/userscript-harness');

test('屏蔽用户样式在页面首次绘制前生效', () => {
    assert.match(source, /@run-at\s+document-start/);

    const context = createContext();

    const css = context.buildEarlyBlockedUserCss(['卜算子', "O'Brien", '', '   ']);
    assert.match(css, /\.List-item:has\(/);
    assert.match(css, /\.Card\.AnswerCard:has\(/);
    assert.match(css, /authorName":"卜算子",/);
    assert.match(css, /O\\'Brien/);
    assert.doesNotMatch(css, /authorName":"",/);
});

test('首帧样式先安装，常规增强在 document-end 等价时机初始化', () => {
    const earlyStyleCall = source.indexOf('installEarlyBlockedUserStyle();');
    const menuRegistration = source.indexOf('registerMenuCommand();', earlyStyleCall);
    const regularInitialization = source.indexOf("document.addEventListener('readystatechange', initializeWhenDocumentReady)");

    assert.notEqual(earlyStyleCall, -1);
    assert.ok(earlyStyleCall < menuRegistration);
    assert.ok(earlyStyleCall < regularInitialization);
    assert.match(source, /if \(document\.readyState === 'loading'\)/);
    assert.match(source, /if \(document\.readyState === 'loading'\) return/);
    assert.doesNotMatch(source, /document\.addEventListener\('DOMContentLoaded', initializeAfterDomReady/);
});
