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

const context = {};
vm.runInNewContext([
    extractFunction('normalizeBlockKeywordText'),
    extractFunction('getMatchedBlockKeyword'),
    extractFunction('isWaitingQuestionView'),
    'this.helpers = { getMatchedBlockKeyword, isWaitingQuestionView };',
].join('\n'), context);

test('关键词匹配不区分大小写并规范化空白', () => {
    assert.equal(context.helpers.getMatchedBlockKeyword('关于 牢   A 的讨论', ['牢 A']), '牢 A');
    assert.equal(context.helpers.getMatchedBlockKeyword('Claude OPUS 发布', ['opus']), 'opus');
    assert.equal(context.helpers.getMatchedBlockKeyword('普通问题', ['', '   ']), null);
});

test('等你来答的四个分类共用页面级过滤范围', () => {
    assert.equal(context.helpers.isWaitingQuestionView('/question/waiting'), true);
    assert.equal(context.helpers.isWaitingQuestionView('/question/123'), false);
});

test('Adapter 使用稳定的列表和卡片语义，不依赖分类 type', () => {
    assert.match(source, /\.QuestionWaiting-questions\[role="list"\]/);
    assert.match(source, /card\.classList\.contains\('jsNavigable'\)/);
    assert.doesNotMatch(source, /\[role="tab"\]\[aria-selected="true"\]/);
});

test('Userscript 使用独立身份并保留上游来源', () => {
    assert.match(source, /@name:zh-CN\s+知乎网页增强（Onlydreams 维护版）/);
    assert.match(source, /@author\s+X\.I\.U \(original\), Onlydreams \(fork maintainer\)/);
    assert.match(source, /@namespace\s+https:\/\/github\.com\/Onlydreams\/zhihu-web-enhancer/);
    assert.match(source, /Upstream baseline: v2\.3\.32 @ 77b9f742b2c291b2908bd092a1805783e78747d7/);
    assert.doesNotMatch(source, /@namespace\s+https:\/\/greasyfork\.org\/scripts\/4122051/);
});
