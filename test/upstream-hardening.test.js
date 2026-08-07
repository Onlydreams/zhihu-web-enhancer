const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const scriptPath = path.join(__dirname, '..', 'Zhihu-Enhanced.user.js');
const source = fs.readFileSync(scriptPath, 'utf8');

function extractFunction(name) {
    const match = new RegExp(`function\\s+${name}\\s*\\(`).exec(source);
    assert.ok(match, `未找到函数 ${name}`);
    const start = match.index;

    const bodyStart = source.indexOf('{', start);
    let depth = 0;
    for (let index = bodyStart; index < source.length; index += 1) {
        if (source[index] === '{') depth += 1;
        if (source[index] === '}') depth -= 1;
        if (depth === 0) return source.slice(start, index + 1);
    }
    throw new Error(`函数 ${name} 缺少结束括号`);
}

function loadElementWaiter(querySelectorAll) {
    const state = { callback: null, delay: null, clearedTimers: [] };
    const context = {
        document: { querySelectorAll },
        setInterval(callback, delay) {
            state.callback = callback;
            state.delay = delay;
            return 17;
        },
        clearInterval(timer) {
            state.clearedTimers.push(timer);
        },
    };
    vm.runInNewContext([
        extractFunction('processElementsWhenAvailable'),
        'this.processElementsWhenAvailable = processElementsWhenAvailable;',
    ].join('\n'), context);
    return { context, state };
}

test('首批元素等待使用明确间隔，并在找到元素后停止', () => {
    const elements = [{ id: 1 }];
    let queryCount = 0;
    const { context, state } = loadElementWaiter(() => {
        queryCount += 1;
        return queryCount === 3 ? elements : [];
    });
    let processed = null;

    const timer = context.processElementsWhenAvailable('.target', (items) => { processed = items; }, 25, 5);
    assert.equal(timer, 17);
    assert.equal(state.delay, 25);

    state.callback();
    state.callback();
    assert.deepEqual(state.clearedTimers, []);
    state.callback();

    assert.deepEqual(state.clearedTimers, [17]);
    assert.equal(processed, elements);
});

test('首批元素等待达到尝试上限后停止', () => {
    const { context, state } = loadElementWaiter(() => []);
    let processed = false;

    context.processElementsWhenAvailable('.missing', () => { processed = true; }, 100, 2);
    state.callback();
    state.callback();

    assert.deepEqual(state.clearedTimers, [17]);
    assert.equal(processed, false);
});

test('收起回答观察器断开后可以重新启动', () => {
    class FakeMutationObserver {
        constructor() {
            this.observeCalls = 0;
            this.disconnectCalls = 0;
        }
        observe() {
            this.observeCalls += 1;
        }
        disconnect() {
            this.disconnectCalls += 1;
        }
    }

    const context = {
        MutationObserver: FakeMutationObserver,
        Node: { ELEMENT_NODE: 1 },
        document: {},
        location: { href: 'https://www.zhihu.com/question/1' },
        window: { addEventListener() {} },
    };
    vm.runInNewContext([
        extractFunction('getCollapsedAnswerObserver'),
        'this.getCollapsedAnswerObserver = getCollapsedAnswerObserver;',
    ].join('\n'), context);

    const observer = context.getCollapsedAnswerObserver();
    observer.start();
    observer.end();
    observer.start();

    assert.equal(observer.observeCalls, 2);
    assert.equal(observer.disconnectCalls, 1);
    assert.equal(observer._active, true);
});

test('MutationObserver 批次中的非元素节点不会终止后续处理', () => {
    assert.doesNotMatch(source, /if \(target\.nodeType != 1\) return/);
    assert.ok((source.match(/if \(target\.nodeType != 1\) continue/g) || []).length >= 16);
});

test('代表性 MutationObserver 会跳过文本节点并处理同批次后续卡片', () => {
    let observerCallback = null;
    class FakeMutationObserver {
        constructor(callback) {
            observerCallback = callback;
        }
        observe() {}
    }

    const contentItem = {
        dataset: {
            zaExtraModule: JSON.stringify({
                card: { content: { upvote_num: 0, comment_num: 0 } },
            }),
        },
        classList: { contains() { return true; } },
    };
    const card = {
        nodeType: 1,
        className: 'Card TopstoryItem TopstoryItem-isRecommend',
        hidden: false,
        style: { display: '' },
        querySelector(selector) {
            assert.equal(selector, '.ContentItem');
            return contentItem;
        },
    };
    const context = {
        console: { log() {} },
        document: { querySelectorAll() { return []; } },
        window: { addEventListener() {} },
        MutationObserver: FakeMutationObserver,
        GM_getValue() { return 1; },
    };
    vm.runInNewContext([
        extractFunction('blockLowCount'),
        'this.blockLowCount = blockLowCount;',
    ].join('\n'), context);

    context.blockLowCount('index');
    assert.equal(typeof observerCallback, 'function');
    observerCallback([{ addedNodes: [{ nodeType: 3 }, card] }]);

    assert.equal(card.hidden, true);
    assert.equal(card.style.display, 'none');
});

test('站外直链只接受有效的 HTTP 和 HTTPS 地址', () => {
    const links = [
        { href: 'https://link.zhihu.com/?target=%E0%A4%A' },
        { href: 'https://link.zhihu.com/?target=https%3A%2F%2Fexample.com%2Farticle%3Fx%3D1' },
        { href: 'https://link.zhihu.com/?target=javascript%3Aalert%281%29' },
    ];
    const context = {
        URL,
        document: { querySelectorAll() { return links; } },
    };
    vm.runInNewContext([
        extractFunction('getDirectExternalUrl'),
        extractFunction('directLink'),
        'this.directLink = directLink;',
    ].join('\n'), context);

    assert.doesNotThrow(() => context.directLink());
    assert.equal(links[0].href, 'https://link.zhihu.com/?target=%E0%A4%A');
    assert.equal(links[1].href, 'https://example.com/article?x=1');
    assert.equal(links[2].href, 'https://link.zhihu.com/?target=javascript%3Aalert%281%29');
});
