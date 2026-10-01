const assert = require('node:assert/strict');
const test = require('node:test');

const { source, createContext } = require('../test-support/userscript-harness');

const context = createContext();

function createQuestionCard(titleText, href = 'https://www.zhihu.com/question/123456') {
    const title = { href, textContent: titleText };
    return {
        dataset: {},
        hidden: false,
        querySelectorAll(selector) { assert.equal(selector, 'a[href*="/question/"]'); return [title]; },
        style: {
            display: '',
            getPropertyValue(name) { return this[name] || ''; },
            getPropertyPriority() { return ''; },
            setProperty(name, value) { this[name] = value; },
            removeProperty(property) {
                if (property === 'display') this.display = '';
            },
        },
    };
}

test('关键词匹配不区分大小写且保留字面空白', () => {
    assert.equal(context.getMatchedBlockKeyword('关于 牢   A 的讨论', ['牢 A']), null);
    assert.equal(context.getMatchedBlockKeyword('Claude OPUS 发布', ['opus']), 'opus');
    assert.equal(context.getMatchedBlockKeyword('普通问题', ['', '   ']), null);
});

test('等你来答的四个分类共用页面级过滤范围', () => {
    assert.equal(context.isWaitingQuestionView('/question/waiting'), true);
    assert.equal(context.isWaitingQuestionView('/question/123'), false);
});


test('问题卡命中关键词后隐藏，关闭过滤后恢复', () => {
    const card = createQuestionCard('关于 Claude Opus 的问题');

    assert.equal(context.filterWaitingQuestionCard(card, ['opus'], true), 'opus');
    assert.equal(card.hidden, true);
    assert.equal(card.style.display, 'none');
    assert.equal(card.dataset.zhihuEBlockedKeywordWaiting, 'true');

    assert.equal(context.filterWaitingQuestionCard(card, ['opus'], false), null);
    assert.equal(card.hidden, false);
    assert.equal(card.style.display, '');
    assert.equal(card.dataset.zhihuEBlockedKeywordWaiting, undefined);
});

test('动态新增问题卡沿用当前关键词匹配语义', () => {
    const matchedCard = createQuestionCard('牢 A 相关讨论');
    const untouchedCard = createQuestionCard('普通问题');

    context.filterWaitingQuestionCard(matchedCard, ['牢 A'], true);
    context.filterWaitingQuestionCard(untouchedCard, ['牢 A'], true);

    assert.equal(matchedCard.hidden, true);
    assert.equal(untouchedCard.hidden, false);
});

test('Userscript 使用独立身份并保留上游来源', () => {
    assert.match(source, /@name:zh-CN\s+知乎网页增强（Onlydreams 维护版）/);
    assert.match(source, /@author\s+X\.I\.U \(original\), Onlydreams \(fork maintainer\)/);
    assert.match(source, /@namespace\s+https:\/\/github\.com\/Onlydreams\/zhihu-web-enhancer/);
    assert.match(source, /Upstream baseline: v2\.3\.32 @ 77b9f742b2c291b2908bd092a1805783e78747d7/);
    assert.match(source, /GM_openInTab\('https:\/\/github\.com\/Onlydreams\/zhihu-web-enhancer\/issues'/);
    assert.doesNotMatch(source, /GM_openInTab\('https:\/\/github\.com\/XIU2\//);
    assert.doesNotMatch(source, /@namespace\s+https:\/\/greasyfork\.org\/scripts\/4122051/);
});
