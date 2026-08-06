const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const scriptPath = path.join(__dirname, '..', 'Zhihu-Enhanced.user.js');
const source = fs.readFileSync(scriptPath, 'utf8');

function extractFunction(name) {
    const start = source.indexOf(`function ${name}(`);
    assert.notEqual(start, -1, `未找到函数 ${name}`);

    const bodyStart = source.indexOf('{', start);
    let depth = 0;
    for (let index = bodyStart; index < source.length; index += 1) {
        if (source[index] === '{') depth += 1;
        if (source[index] === '}') depth -= 1;
        if (depth === 0) return source.slice(start, index + 1);
    }
    throw new Error(`函数 ${name} 缺少结束括号`);
}

test('屏蔽用户样式在页面首次绘制前生效', () => {
    assert.match(source, /@run-at\s+document-start/);

    const context = {};
    vm.runInNewContext([
        extractFunction('escapeCssAttributeValue'),
        extractFunction('buildEarlyBlockedUserCss'),
        'this.buildEarlyBlockedUserCss = buildEarlyBlockedUserCss;',
    ].join('\n'), context);

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
