const assert = require('node:assert/strict');
const test = require('node:test');
const { element, loadUserscript } = require('../test-support/userscript-harness');
const { waitingTree } = require('../test-support/waiting-question-fixture');

test('waiting 实际观察器处理后填标题、文本节点修改和新卡片，关闭后不再过滤', () => {
    const harness = loadUserscript({ settings: { menu_customBlockKeywords: ['alpha'] } });
    const tree = waitingTree(); harness.document.body.appendChild(tree.root);
    harness.context.blockKeywords('waiting');
    const observer = harness.state.observers.find(observer => observer.target === tree.root);
    assert.equal(observer.options.characterData, true);
    tree.title.textContent = '普通问题 alpha';
    observer.callback([{ target: tree.title, addedNodes: [{ nodeType: 3, parentElement: tree.title }] }]);
    assert.equal(tree.card.hidden, true);
    tree.title.textContent = '普通问题';
    observer.callback([{ type: 'characterData', target: { nodeType: 3, parentElement: tree.title } }]);
    assert.equal(tree.card.hidden, false);
    const next = waitingTree('alpha 动态').card; tree.list.appendChild(next);
    observer.callback([{ target: tree.list, addedNodes: [next] }]);
    assert.equal(next.hidden, true);
    harness.setMenu('menu_blockKeywords', false);
    const untouched = waitingTree('alpha 关闭后').card; tree.list.appendChild(untouched);
    observer.callback([{ target: tree.list, addedNodes: [untouched] }]);
    assert.equal(untouched.hidden, false);
});

test('waiting 根及其主区域在 URL 不变时重挂后重新连接，退出路由断开', () => {
    const harness = loadUserscript({ settings: { menu_customBlockKeywords: ['alpha'] } });
    let main = harness.document.body.appendChild(element('main', ['.App-main']));
    let tree = waitingTree('alpha 初始'); main.appendChild(tree.root);
    harness.context.blockKeywords('waiting');
    const firstObserver = harness.state.observers.find(observer => observer.target === tree.root);
    let watcher = harness.state.observers.at(-1);
    const oldRoot = tree.root; oldRoot.remove();
    tree = waitingTree('alpha 新根'); main.appendChild(tree.root);
    watcher.callback([{ target: main, removedNodes: [oldRoot], addedNodes: [tree.root] }]);
    assert.equal(tree.card.hidden, true);
    assert.equal(firstObserver.active, false);
    watcher = harness.state.observers.at(-1);
    const oldMain = main; oldMain.remove();
    watcher.callback([{ target: harness.document.body, removedNodes: [oldMain], addedNodes: [] }]);
    const discovery = harness.state.observers.find(observer => observer.active && observer.target === harness.document.body && observer.options.subtree);
    main = harness.document.body.appendChild(element('main', ['.App-main']));
    tree = waitingTree('alpha 新主区域'); main.appendChild(tree.root);
    discovery.callback([{ target: harness.document.body, addedNodes: [main], removedNodes: [] }]);
    assert.equal(tree.card.hidden, true);
    harness.changeUrl('/question/123');
    assert.equal(harness.state.observers.filter(observer => observer.active).length, 0);
    assert.equal(tree.card.hidden, false);
});

test('SPA 首次进入 waiting 后四个分类沿用同一词表，发现范围限定在主区域', () => {
    const harness = loadUserscript({ location: { pathname: '/other' } });
    const main = harness.document.body.appendChild(element('main', ['.App-main']));
    harness.context.blockKeywords('waiting');
    assert.equal(harness.state.observers.length, 0);
    harness.changeUrl('/question/waiting');
    const discovery = harness.state.observers.find(observer => observer.active && observer.target === main && observer.options.subtree);
    assert.equal(discovery.target, main);
    harness.setMenu('menu_customBlockKeywords', ['alpha']);
    let tree = waitingTree('ALPHA 推荐'); main.appendChild(tree.root);
    discovery.callback([{ target: main, addedNodes: [tree.root], removedNodes: [] }]);
    assert.equal(tree.card.hidden, true);
    const observer = harness.state.observers.find(observer => observer.target === tree.root);
    for (const category of ['invite', 'newest', 'hot']) {
        const next = waitingTree('alpha ' + category);
        tree.list.remove(); tree.root.appendChild(next.list);
        observer.callback([{ target: tree.root, addedNodes: [next.list], removedNodes: [tree.list] }]);
        assert.equal(next.card.hidden, true);
        tree.list = next.list;
    }
});

test('waiting 解除过滤保留原有 hidden 和带优先级的 display', () => {
    const harness = loadUserscript();
    const tree = waitingTree('alpha');
    tree.card.hidden = true; tree.card.style.setProperty('display', 'flex', 'important');
    harness.context.filterWaitingQuestionCard(tree.card, ['alpha'], true);
    harness.context.filterWaitingQuestionCard(tree.card, [], true);
    assert.equal(tree.card.hidden, true);
    assert.equal(tree.card.style.display, 'flex');
    assert.equal(tree.card.style.getPropertyPriority('display'), 'important');
});

test('waiting 发现阶段主区域或空根重挂仍能发现列表，按真实订阅范围派发', () => {
    for (const replaceMain of [false, true]) {
        const harness = loadUserscript({ settings: { menu_customBlockKeywords: ['alpha'] } });
        const main = harness.document.body.appendChild(element('main', ['.App-main']));
        const empty = main.appendChild(element('div', ['.QuestionWaiting']));
        harness.context.blockKeywords('waiting');
        const replacement = waitingTree('alpha 延迟列表');
        const parent = replaceMain ? harness.document.body : main;
        const removed = replaceMain ? main : empty;
        removed.remove();
        const added = replaceMain ? element('main', ['.App-main']) : replacement.root;
        if (replaceMain) added.appendChild(replacement.root);
        parent.appendChild(added);
        harness.deliver([{ type: 'childList', target: parent, removedNodes: [removed], addedNodes: [added] }]);
        assert.equal(replacement.card.hidden, true);
        assert.ok(!harness.state.observers.some(observer => observer.active && observer.target === removed && observer.options.subtree));
    }
});

test('waiting 追加一张卡只过滤该卡，不重扫已有列表', () => {
    const harness = loadUserscript({ settings: { menu_customBlockKeywords: ['alpha'] } });
    const tree = waitingTree(); harness.document.body.appendChild(tree.root);
    for (let i = 0; i < 100; i++) tree.list.appendChild(waitingTree('旧问题 ' + i).card);
    let filters = 0;
    for (const card of tree.list.children) {
        const query = card.querySelectorAll;
        card.querySelectorAll = function(selector) { if (selector === 'a[href*="/question/"]') filters++; return query.call(this, selector); };
    }
    harness.context.blockKeywords('waiting'); filters = 0;
    const next = waitingTree('alpha 新卡').card;
    const query = next.querySelectorAll;
    next.querySelectorAll = function(selector) { if (selector === 'a[href*="/question/"]') filters++; return query.call(this, selector); };
    tree.list.appendChild(next);
    harness.deliver([{ type: 'childList', target: tree.list, removedNodes: [], addedNodes: [next] }]);
    assert.equal(next.hidden, true);
    assert.equal(filters, 1);
});

test('waiting 复用原根迁入新主区域后，祖先监听随之更新', () => {
    const harness = loadUserscript({ settings: { menu_customBlockKeywords: ['alpha'] } });
    const main = harness.document.body.appendChild(element('main', ['.App-main']));
    const tree = waitingTree(); main.appendChild(tree.root);
    harness.context.blockKeywords('waiting');
    main.remove(); tree.root.remove();
    const nextMain = harness.document.body.appendChild(element('main', ['.App-main']));
    nextMain.appendChild(tree.root);
    harness.deliver([
        { type: 'childList', target: main, removedNodes: [tree.root], addedNodes: [] },
        { type: 'childList', target: harness.document.body, removedNodes: [main], addedNodes: [nextMain] },
        { type: 'childList', target: nextMain, removedNodes: [], addedNodes: [tree.root] },
    ]);
    assert.ok(harness.state.observers.some(observer => observer.active && observer.targets.has(nextMain)));
    tree.root.remove();
    const replacement = waitingTree('alpha 新根'); nextMain.appendChild(replacement.root);
    harness.deliver([{ type: 'childList', target: nextMain, removedNodes: [tree.root], addedNodes: [replacement.root] }]);
    assert.equal(replacement.card.hidden, true);
    harness.changeUrl('/question/123');
    assert.equal(harness.state.observers.filter(observer => observer.active).length, 0);
});

test('waiting 换根但复用原列表后，继续过滤新卡片和标题更新', () => {
    const harness = loadUserscript({ settings: { menu_customBlockKeywords: ['alpha'] } });
    const main = harness.document.body.appendChild(element('main', ['.App-main']));
    const tree = waitingTree(); main.appendChild(tree.root);
    harness.context.blockKeywords('waiting');
    tree.root.remove(); tree.list.remove();
    const nextRoot = main.appendChild(element('div', ['.QuestionWaiting'])); nextRoot.appendChild(tree.list);
    harness.deliver([
        { type: 'childList', target: tree.root, removedNodes: [tree.list], addedNodes: [] },
        { type: 'childList', target: main, removedNodes: [tree.root], addedNodes: [nextRoot] },
    ]);
    const next = waitingTree('alpha 新卡').card; next.remove(); tree.list.appendChild(next);
    harness.deliver([{ type: 'childList', target: tree.list, removedNodes: [], addedNodes: [next] }]);
    assert.equal(next.hidden, true);
    tree.title.textContent = '';
    const titleText = tree.title.appendChild({ nodeType: 3, textContent: 'alpha 后填标题' });
    harness.deliver([{ type: 'childList', target: tree.title, removedNodes: [], addedNodes: [titleText] }]);
    assert.equal(tree.card.hidden, true);
    assert.ok(!harness.state.observers.some(observer => observer.active && observer.target === tree.root));
});

test('waiting 保留旧空根并迁移原列表时，按最终所在根重新订阅', () => {
    for (const reverseDelivery of [false, true]) {
        const harness = loadUserscript({ settings: { menu_customBlockKeywords: ['alpha'] } });
        const main = harness.document.body.appendChild(element('main', ['.App-main']));
        const tree = waitingTree(); main.appendChild(tree.root);
        harness.context.blockKeywords('waiting');
        const nextRoot = main.appendChild(element('div', ['.QuestionWaiting']));
        tree.list.remove(); nextRoot.appendChild(tree.list);
        if (reverseDelivery) harness.state.observers.reverse();
        harness.deliver([
            { type: 'childList', target: main, removedNodes: [], addedNodes: [nextRoot] },
            { type: 'childList', target: tree.root, removedNodes: [tree.list], addedNodes: [] },
            { type: 'childList', target: nextRoot, removedNodes: [], addedNodes: [tree.list] },
        ]);
        assert.equal(harness.document.contains(tree.root), true);
        assert.ok(harness.state.observers.some(observer => observer.active && observer.targets.has(nextRoot)));
        assert.ok(!harness.state.observers.some(observer => observer.active && observer.targets.has(tree.root)));
        const next = waitingTree('alpha 搬移后追加').card; next.remove(); tree.list.appendChild(next);
        harness.deliver([{ type: 'childList', target: tree.list, removedNodes: [], addedNodes: [next] }]);
        assert.equal(next.hidden, true);
        assert.equal(tree.card.hidden, false);
        assert.equal(harness.state.observers.filter(observer => observer.active).length, 2);
    }
});

test('waiting 仅移除列表但保留旧根时，回到发现阶段并处理延迟重建', () => {
    const harness = loadUserscript({ settings: { menu_customBlockKeywords: ['alpha'] } });
    const main = harness.document.body.appendChild(element('main', ['.App-main']));
    const tree = waitingTree(); main.appendChild(tree.root);
    harness.context.blockKeywords('waiting');
    tree.list.remove();
    harness.deliver([{ type: 'childList', target: tree.root, removedNodes: [tree.list], addedNodes: [] }]);
    assert.ok(harness.state.observers.some(observer => observer.active && observer.target === main && observer.options.subtree));
    const replacement = waitingTree('alpha 延迟重建'); harness.document.body.appendChild(replacement.root);
    harness.deliver([{ type: 'childList', target: harness.document.body, removedNodes: [], addedNodes: [replacement.root] }]);
    assert.equal(replacement.card.hidden, true);
    assert.ok(!harness.state.observers.some(observer => observer.active && observer.targets.has(tree.root)));
});

test('waiting 同批多次替换列表时跳过已脱离的过渡节点，只连接最终列表', () => {
    const harness = loadUserscript({ settings: { menu_customBlockKeywords: ['alpha'] } });
    const tree = waitingTree(); harness.document.body.appendChild(tree.root);
    harness.context.blockKeywords('waiting');
    const temporary = waitingTree('alpha 临时'), current = waitingTree('alpha 当前');
    tree.list.remove(); temporary.list.remove(); tree.root.appendChild(temporary.list);
    temporary.list.remove(); current.list.remove(); tree.root.appendChild(current.list);
    harness.deliver([
        { type: 'childList', target: tree.root, removedNodes: [tree.list], addedNodes: [temporary.list] },
        { type: 'childList', target: tree.root, removedNodes: [temporary.list], addedNodes: [current.list] },
    ]);
    assert.equal(current.card.hidden, true);
    assert.equal(temporary.card.hidden, false);
    assert.ok(!harness.state.observers.some(observer => observer.active && observer.targets.has(temporary.list)));
    const next = waitingTree('alpha 后续').card; next.remove(); current.list.appendChild(next);
    harness.deliver([{ type: 'childList', target: current.list, removedNodes: [], addedNodes: [next] }]);
    assert.equal(next.hidden, true);
});

test('waiting 首次发现也忽略同批已移除的过渡列表', () => {
    const harness = loadUserscript({ settings: { menu_customBlockKeywords: ['alpha'] } });
    const main = harness.document.body.appendChild(element('main', ['.App-main']));
    harness.context.blockKeywords('waiting');
    const temporary = waitingTree('alpha 临时'), current = waitingTree('alpha 当前');
    main.appendChild(temporary.root); temporary.root.remove(); main.appendChild(current.root);
    harness.deliver([
        { type: 'childList', target: main, removedNodes: [], addedNodes: [temporary.root] },
        { type: 'childList', target: main, removedNodes: [temporary.root], addedNodes: [current.root] },
    ]);
    assert.equal(current.card.hidden, true);
    assert.ok(!harness.state.observers.some(observer => observer.active && observer.targets.has(temporary.root)));
});

test('waiting 列表晚到并追加在主区域的祖先下时，现有祖先监听能够发现', () => {
    for (const wrapped of [false, true]) {
        const harness = loadUserscript({ settings: { menu_customBlockKeywords: ['alpha'] } });
        const main = harness.document.body.appendChild(element('main', ['.App-main']));
        harness.context.blockKeywords('waiting');
        const tree = waitingTree('alpha 主区域外');
        const added = wrapped ? element() : tree.root;
        if (wrapped) added.appendChild(tree.root);
        harness.document.body.appendChild(added);
        harness.deliver([{ type: 'childList', target: harness.document.body, removedNodes: [], addedNodes: [added] }]);
        assert.equal(tree.card.hidden, true);
        assert.ok(!harness.state.observers.some(observer => observer.active && observer.targets.get(harness.document.body)?.subtree));
        assert.ok(!harness.state.observers.some(observer => observer.active && observer.target === main));
    }
});
