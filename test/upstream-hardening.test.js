const assert = require('node:assert/strict');
const test = require('node:test');

const { createContext } = require('../test-support/userscript-harness');

function loadObserverFunction(name, overrides = {}) {
    const state = { callback: null };
    const context = createContext({
        console: { log() {} },
        menu_value: () => true,
        document: { querySelectorAll: () => [] },
        MutationObserver: class {
            constructor(callback) { state.callback = callback; }
            observe() {}
        },
        ...overrides,
    });

    return { context, state };
}

test('热榜批量新增自身或子树卡片时过滤一次，忽略文本及无关变化', () => {
    let scans = 0;
    let removed = 0;
    const card = { querySelector: () => null, remove() { removed += 1; } };
    const { context, state } = loadObserverFunction('blockHotOther', {
        document: { querySelectorAll(selector) { scans += 1; return selector.includes(':not') ? [] : [card]; } },
    });
    context.blockHotOther();
    scans = 0; removed = 0;
    const item = { nodeType: 1, classList: { contains: (name) => name === 'HotItem' }, querySelector: () => null };
    const wrapper = { nodeType: 1, classList: { contains: () => false }, querySelector: () => item };
    state.callback([{ addedNodes: [{ nodeType: 3 }, item, wrapper] }]);
    assert.equal(removed, 1);
    assert.equal(scans, 2);
    scans = 0; removed = 0;
    state.callback([{ addedNodes: [wrapper] }]);
    assert.equal(removed, 1);
    assert.equal(scans, 2);
    scans = 0;
    state.callback([{ addedNodes: [{ nodeType: 3 }, { ...wrapper, querySelector: () => null }] }]);
    assert.equal(scans, 0);
});

test('高亮链接清理覆盖混合批次与包装节点，普通链接不变', () => {
    let replaced = 0;
    const link = { nodeType: 1, matches: () => true, querySelectorAll: () => [], textContent: '标题', parentElement: {}, replaceWith(text) { assert.equal(text, '标题'); replaced += 1; } };
    const wrapper = { nodeType: 1, matches: () => false, querySelectorAll: () => [link] };
    const { context, state } = loadObserverFunction('cleanHighlightLink');
    context.cleanHighlightLink();
    state.callback([{ addedNodes: [{ nodeType: 3 }, link, wrapper, { ...wrapper, querySelectorAll: () => [] }] }]);
    assert.equal(replaced, 2);
});

test('评论多词命中及重复通知后仍能恢复原文，缺少正文不报错', () => {
    let html = 'alpha beta';
    const content = {
        dataset: {},
        get textContent() { return html; }, set textContent(value) { html = value; },
        get innerHTML() { return html; }, set innerHTML(value) { html = value; },
        querySelectorAll: () => [],
        removeAttribute() { delete this.dataset.text; },
    };
    let currentContent = content;
    const avatar = { parentElement: { parentElement: { parentElement: { parentElement: { querySelector: () => currentContent } } } } };
    const { context, state } = loadObserverFunction('blockKeywords', {
        menu_value: (name) => name === 'menu_customBlockKeywords' ? ['alpha', 'beta'] : true,
    });
    context.blockKeywords('comment');
    const mutations = [{ addedNodes: [{ nodeType: 1, tagName: 'DIV', className: 'css-test', dataset: {}, querySelector: () => avatar }] }];
    state.callback(mutations);
    state.callback(mutations);
    assert.equal(content.dataset.text, 'alpha beta');
    content.onclick({ target: content });
    assert.equal(html, 'alpha beta');
    currentContent = null;
    assert.doesNotThrow(() => state.callback(mutations));
});

function loadInvitation(pathname = '/question/1') {
    const state = { callback: null, delay: null, cleared: [], listener: null, removed: 0, content: null };
    const context = createContext({
        location: { pathname },
        document: { querySelector: () => state.content },
        window: {
            addEventListener(name, callback) { state.listener = callback; },
            removeEventListener() { state.removed += 1; },
        },
        setInterval(callback, delay) { state.callback = callback; state.delay = delay; return 42; },
        clearInterval(timer) { state.cleared.push(timer); },
    });

    context.questionInvitation();
    return { context, state };
}

test('邀请等待有间隔和上限，且不在等你来答启动', () => {
    const { state } = loadInvitation();
    assert.equal(state.delay, 100);
    for (let i = 0; i < 50; i += 1) state.callback();
    assert.deepEqual(state.cleared, [42]);
    assert.equal(state.removed, 1);
    assert.equal(loadInvitation('/question/waiting').state.callback, null);
});

test('邀请等待在路由变化时取消', () => {
    const { context, state } = loadInvitation();
    context.location.pathname = '/question/2';
    assert.equal(typeof state.listener, 'function');
    state.listener();
    assert.deepEqual(state.cleared, [42]);
    assert.equal(state.removed, 1);
});

test('邀请区及依赖节点就绪后停止等待，保留折叠与展开', () => {
    const { context, state } = loadInvitation();
    const content = { style: { display: '' } };
    const title = { innerText: '邀请回答', insertAdjacentHTML() {} };
    const topbar = {};
    let ready = false;
    context.document.querySelector = (selector) => {
        if (selector === '.QuestionInvitation-content') return content;
        if (!ready) return null;
        return selector === '.QuestionInvitation-title' ? title : topbar;
    };
    state.callback();
    assert.deepEqual(state.cleared, []);
    ready = true;
    state.callback();
    assert.deepEqual(state.cleared, [42]);
    assert.equal(state.removed, 1);
    assert.equal(content.style.display, 'none');
    topbar.onclick();
    assert.equal(content.style.display, '');
    topbar.onclick();
    assert.equal(content.style.display, 'none');
});

test('悬浮评论观察器每批只查询一次，纯文本批次不查询', () => {
    let queries = 0;
    const { context, state } = loadObserverFunction('closeFloatingComments', {
        document: { querySelector() { queries += 1; return null; } },
    });
    context.closeFloatingComments();
    state.callback([{ addedNodes: [{ nodeType: 3 }, { nodeType: 1 }, { nodeType: 1 }] }]);
    assert.equal(queries, 1);
    state.callback([{ addedNodes: [{ nodeType: 3 }] }]);
    assert.equal(queries, 1);
});

function loadElementWaiter(querySelectorAll) {
    const state = { callback: null, delay: null, clearedTimers: [] };
    const context = createContext({
        document: { querySelectorAll },
        setInterval(callback, delay) {
            state.callback = callback;
            state.delay = delay;
            return 17;
        },
        clearInterval(timer) {
            state.clearedTimers.push(timer);
        },
    });

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

    const context = createContext({
        MutationObserver: FakeMutationObserver,
        Node: { ELEMENT_NODE: 1 },
        document: {},
        location: { href: 'https://www.zhihu.com/question/1' },
        window: { addEventListener() {} },
    });

    const observer = context.getCollapsedAnswerObserver();
    observer.start();
    observer.end();
    observer.start();

    assert.equal(observer.observeCalls, 2);
    assert.equal(observer.disconnectCalls, 1);
    assert.equal(observer._active, true);
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
    const context = createContext({
        console: { log() {} },
        document: { querySelectorAll() { return []; } },
        window: { addEventListener() {} },
        MutationObserver: FakeMutationObserver,
        GM_getValue() { return 1; },
    });

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
    const context = createContext({
        URL,
        document: { querySelectorAll() { return links; } },
    });

    assert.doesNotThrow(() => context.directLink());
    assert.equal(links[0].href, 'https://link.zhihu.com/?target=%E0%A4%A');
    assert.equal(links[1].href, 'https://example.com/article?x=1');
    assert.equal(links[2].href, 'https://link.zhihu.com/?target=javascript%3Aalert%281%29');
});
