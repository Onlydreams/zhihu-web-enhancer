const assert = require('node:assert/strict');
const test = require('node:test');
const { element, loadUserscript } = require('../test-support/userscript-harness');

function hoverCard(harness, name, blocked = false) {
    const wrapper = element(); wrapper.className = 'css-probe';
    const buttons = wrapper.appendChild(element('div', ['.MemberButtonGroup.ProfileButtonGroup.HoverCard-buttons']));
    // 旧实现的 HTML sink 只记录输入并提供事件目标；无需模拟 HTML 解析器。
    buttons.insertAdjacentHTML = function(position, html) {
        this.htmlWrites.push({ position, html });
        const button = element('button');
        button.dataset.name = /data-name="([^"]*)"/.exec(html)?.[1];
        button.dataset.userid = /data-userid="([^"]*)"/.exec(html)?.[1];
        this.insertAdjacentElement(position, button);
    };
    const user = wrapper.appendChild(element('a', ['img.Avatar+div span.UserLink>a.UserLink-link[data-za-detail-view-element_name=User]']));
    user.textContent = name; user.href = 'https://www.zhihu.com/people/probe';
    harness.context.blockUsers();
    const observer = harness.state.observers.at(-1);
    observer.callback([{ addedNodes: [wrapper] }]);
    const button = blocked ? buttons.firstElementChild : buttons.lastElementChild;
    return { buttons, button };
}

test('昵称的引号和 HTML 保持为按钮数据，不进入 HTML 解析', () => {
    const harness = loadUserscript({ settings: { menu_customBlockUsers: ['known'] } });
    const name = 'X"><img src=x onerror="probe()">';
    const { buttons, button } = hoverCard(harness, name);
    assert.ok(button, '应创建本地屏蔽按钮');
    assert.equal(buttons.htmlWrites.length, 0);
    assert.equal(button.dataset.name, name);
    assert.equal(button.dataset.userid, 'probe');
    assert.ok(button.htmlWrites.every(write => !write.html.includes(name)));
});

test('编辑与按钮删除名单会同步首帧 CSS，不产生重复样式', () => {
    const harness = loadUserscript({ settings: { menu_customBlockUsers: ['alice'] } });
    assert.match(harness.document.getElementById('zhihuE_EarlyBlockedUsers').textContent, /alice/);
    harness.context.prompt = () => '';
    harness.context.customBlockUsers();
    assert.equal(harness.document.getElementById('zhihuE_EarlyBlockedUsers'), null);
    harness.setMenu('menu_customBlockUsers', ['alice']);
    const { button } = hoverCard(harness, 'alice', true);
    button.click();
    assert.equal(harness.document.getElementById('zhihuE_EarlyBlockedUsers'), null);
    assert.deepEqual(harness.state.settings.get('menu_customBlockUsers'), []);
});

test('账号屏蔽失败保留本地名单并明确报告，不提前宣称成功', () => {
    const harness = loadUserscript({ settings: { menu_customBlockUsers: ['known'] } });
    const { button } = hoverCard(harness, 'alice');
    button.click();
    assert.deepEqual(harness.state.settings.get('menu_customBlockUsers'), ['known', 'alice']);
    assert.equal(harness.state.requests.length, 1);
    assert.equal(harness.state.notifications.length, 0);
    const request = harness.state.requests[0];
    assert.equal(typeof request.onload, 'function');
    assert.equal(typeof request.onerror, 'function');
    assert.equal(typeof request.ontimeout, 'function');
    request.onload({ status: 403 });
    assert.match(harness.state.notifications[0].text, /本地.*屏蔽/);
    assert.match(harness.state.notifications[0].text, /账号.*失败/);
    request.ontimeout();
    assert.equal(harness.state.notifications.length, 1);
});

test('动态热榜自身和包装卡片使用当前关键词过滤', () => {
    const initial = element('section'); initial.className = 'HotItem';
    initial.appendChild(element('h2', ['h2.HotItem-title'])).textContent = 'alpha 初始';
    const cards = [initial];
    const harness = loadUserscript({ settings: { menu_customBlockKeywords: ['alpha'] }, location: { pathname: '/hot' }, document: { querySelectorAll: selector => selector === '.HotItem' ? cards : [] } });
    harness.context.blockKeywords('index');
    assert.equal(initial.hidden, true);
    const later = element('section', ['.HotItem']); later.className = 'HotItem';
    later.appendChild(element('h2', ['h2.HotItem-title'])).textContent = 'alpha 动态';
    const unrelated = element('section', ['.HotItem']);
    unrelated.appendChild(element('h2', ['h2.HotItem-title'])).textContent = '普通标题';
    unrelated.appendChild(element('span')).textContent = 'alpha 状态文字';
    const wrapper = element(); wrapper.appendChild(later); wrapper.appendChild(unrelated);
    const observer = harness.state.observers.at(-1);
    observer.callback([{ addedNodes: [{ nodeType: 3 }, later, wrapper] }]);
    assert.equal(later.hidden, true);
    assert.equal(unrelated.hidden, false);
});

test('空词表启动的标题与评论监听在添加首词后过滤新内容', () => {
    const harness = loadUserscript();
    harness.context.blockKeywords('index');
    harness.context.blockKeywords('comment');
    const observers = harness.state.observers.filter(observer => observer.active);
    assert.equal(observers.length, 2);
    harness.context.getSelectedBlockKeywordText = () => 'alpha';
    harness.context.addSelectedKeywordToBlocklist();
    const card = element('div', ['.Card.TopstoryItem.TopstoryItem-isRecommend']); card.className = 'Card TopstoryItem TopstoryItem-isRecommend';
    card.appendChild(element('meta', ['h2.ContentItem-title meta[itemprop="name"], meta[itemprop="headline"]'])).content = 'alpha 标题';
    observers[0].callback([{ addedNodes: [card] }]);
    assert.equal(card.hidden, true);
    const content = element(); content.textContent = 'alpha 评论';
    const comment = element(); comment.querySelector = selector => { assert.equal(selector, '.CommentContent'); return content; };
    const avatar = { parentElement: { parentElement: { parentElement: { parentElement: comment } } } };
    const wrapper = element(); wrapper.className = 'css-test'; wrapper.querySelector = selector => { assert.equal(selector, 'a[href^="https://www.zhihu.com/people/"]>img.Avatar[alt][loading]'); return avatar; };
    observers[1].callback([{ addedNodes: [wrapper] }]);
    assert.equal(content.textContent, '[该评论已屏蔽，可点击显示]');
});

test('已收起与新长回答同批通知时，所有新回答仍会收起', () => {
    const harness = loadUserscript();
    const observer = harness.context.getCollapsedAnswerObserver();
    const old = element(); old.setAttribute('script-collapsed', '');
    let clicks = 0;
    const first = element(), second = element();
    for (const target of [first, second]) { target.className = 'RichContent'; target.querySelector = () => ({ click() { clicks++; } }); }
    observer.callback([{ target: old, addedNodes: [] }, ...[first, second].map(target => ({ target, addedNodes: [{ nodeType: 1, className: 'RichContent-inner', offsetHeight: 600 }] }))]);
    assert.equal(clicks, 2);
});

test('搜索框或角落按钮缺失时，完整启动仍注册 waiting 监听', () => {
    const harness = loadUserscript({ settings: { menu_cleanSearch: true } });
    harness.start();
    assert.ok(harness.state.observers.some(observer => observer.target === harness.document.body));
    assert.equal(harness.state.errors.length, 0);
});

test('缺少用户主页节点不阻止评论和悬浮卡监听', () => {
    const harness = loadUserscript();
    harness.context.blockUsers('people');
    assert.equal(harness.state.observers.filter(observer => observer.active).length, 0);
    harness.setMenu('menu_customBlockUsers', ['alice']);
    assert.doesNotThrow(() => harness.context.blockUsers('people'));
    assert.equal(harness.state.observers.filter(observer => observer.active).length, 2);
});

test('高亮清理只替换链接，保留父 span 的前后文字', () => {
    const harness = loadUserscript();
    const span = element('span'); span.appendChild({ nodeType: 3, textContent: '前置文字' });
    const link = span.appendChild(element('a', ['span > a[data-za-not-track-link][href^="https://zhida.zhihu.com/search?"]'])); link.textContent = '高亮';
    span.appendChild({ nodeType: 3, textContent: '后置文字' });
    harness.document.body.appendChild(span);
    harness.context.cleanHighlightLink();
    assert.equal(span.textContent, '前置文字高亮后置文字');
    assert.equal(harness.document.body.textContent, '前置文字高亮后置文字');
    assert.ok(harness.document.body.children.includes(span));
});

test('菜单重注册不会积累旧 ID 或注销 undefined', () => {
    const harness = loadUserscript();
    const length = harness.context.menu_ID.length;
    for (let i = 0; i < 4; i++) harness.context.registerMenuCommand();
    assert.equal(harness.context.menu_ID.length, length);
    assert.ok(harness.state.unregistered.every(id => id !== undefined && id !== null));
});

test('主页按钮的两种状态均安全赋值，重复通知不添加第二个按钮', () => {
    const name = 'X"><img src=x onerror="probe()">';
    for (const blocked of [false, true]) {
        const harness = loadUserscript({ settings: { menu_customBlockUsers: blocked ? [name] : ['known'] }, location: { pathname: '/people/probe' } });
        const buttons = harness.document.body.appendChild(element('div', ['.MemberButtonGroup.ProfileButtonGroup.ProfileHeader-buttons']));
        const header = harness.document.body.appendChild(element('span', ['.ProfileHeader-name']));
        header.appendChild({ nodeType: 3, textContent: name });
        harness.context.blockUsers('people');
        harness.context.blockUsers('people');
        assert.equal(buttons.children.length, 1);
        assert.equal(buttons.firstChild.dataset.name, name);
        assert.equal(buttons.htmlWrites.length, 0);
        const card = hoverCard(harness, name, blocked);
        assert.equal(card.button.dataset.name, name);
        assert.equal(card.buttons.htmlWrites.length, 0);
    }
});

test('问题作者的昵称、token、头像不进入 HTML，非 HTTP 头像被忽略', () => {
    for (const avatarUrl of ['https://pic.example/a" onerror="probe()', 'javascript:probe()']) {
        const harness = loadUserscript({ location: { pathname: '/question/123' } });
        const name = '<img src=x onerror="probe()">';
        const data = harness.document.body.appendChild(element('script', ['#js-initialData']));
        data.textContent = JSON.stringify({ initialState: { entities: { questions: { 123: { author: { name, urlToken: 'x"/<b>', avatarUrl } } } } } });
        const topics = harness.document.body.appendChild(element('div', ['.QuestionHeader-topics']));
        harness.context.question_author();
        const container = harness.document.body.children[harness.document.body.children.indexOf(topics) - 1];
        const link = container.firstChild;
        assert.equal(link.href, '/people/' + encodeURIComponent('x"/<b>'));
        assert.equal(link.children[1].textContent, name);
        assert.equal(topics.htmlWrites.length, 0);
        assert.ok(container.children.every(child => child.htmlWrites.length === 0));
        assert.equal(link.children[0].src, avatarUrl.startsWith('https:') ? new URL(avatarUrl).href : undefined);
    }
});

test('账号请求成功、网络失败、超时、取消及同步抛错只报告一次结果', () => {
    for (const outcome of ['success', 'error', 'timeout', 'abort', 'throw']) {
        const harness = loadUserscript({ settings: { menu_customBlockUsers: ['known'] } });
        if (outcome === 'throw') harness.context.GM_xmlhttpRequest = () => { throw new Error('network unavailable'); };
        hoverCard(harness, 'alice').button.click();
        if (outcome !== 'throw') {
            const request = harness.state.requests[0];
            if (outcome === 'success') request.onload({ status: 204 });
            else request['on' + outcome]();
            request.onabort();
        }
        assert.equal(harness.state.notifications.length, 1);
        assert.match(harness.state.notifications[0].text, outcome === 'success' ? /账号屏蔽已同步/ : /账号屏蔽失败/);
        assert.deepEqual(harness.state.settings.get('menu_customBlockUsers'), ['known', 'alice']);
    }
});

test('主页取消屏蔽在请求结果后才刷新，失败也保留本地删除', () => {
    const harness = loadUserscript({ settings: { menu_customBlockUsers: ['alice'] }, location: { pathname: '/people/probe' } });
    const buttons = harness.document.body.appendChild(element('div', ['.MemberButtonGroup.ProfileButtonGroup.ProfileHeader-buttons']));
    const header = harness.document.body.appendChild(element('span', ['.ProfileHeader-name']));
    header.appendChild({ nodeType: 3, textContent: 'alice' });
    harness.context.blockUsers('people');
    buttons.firstChild.click();
    harness.tick();
    assert.equal(harness.state.reloaded, undefined);
    assert.equal(harness.state.requests[0].method, 'DELETE');
    harness.state.requests[0].ontimeout();
    assert.deepEqual(harness.state.settings.get('menu_customBlockUsers'), []);
    assert.match(harness.state.notifications[0].text, /账号取消屏蔽失败/);
    harness.tick();
    assert.equal(harness.state.reloaded, true);
});

test('功能初始化异常可定位且不阻止 waiting 注册，正常缺失 DOM 不报错', () => {
    const harness = loadUserscript();
    harness.context.cleanHighlightLink = () => { throw new Error('probe'); };
    harness.start();
    assert.equal(harness.state.errors.length, 1);
    assert.match(harness.state.errors[0][0], /cleanHighlightLink/);
    assert.equal(harness.state.errors[0][1].message, 'probe');
    assert.ok(harness.state.observers.some(observer => observer.target === harness.document.body));
    harness.tick();
    assert.equal(harness.state.errors.length, 1);
});

test('URL 查询串包含 org 不会误入用户主页分支', () => {
    const harness = loadUserscript({ location: { pathname: '/other', href: 'https://www.zhihu.com/other?name=org' } });
    const calls = [];
    harness.context.blockUsers = type => calls.push(type);
    harness.start();
    assert.deepEqual(calls, []);
});

test('登录按钮在其他子树时不删除普通新增节点，局部登录提示仍移除', () => {
    const harness = loadUserscript();
    const outside = element('button'); outside.textContent = '立即登录/注册';
    const ordinary = element(), login = element();
    login.appendChild(outside);
    harness.document.body.appendChild(ordinary);
    harness.document.body.appendChild(login);
    const expressions = [];
    harness.document.evaluate = (xpath, context) => {
        expressions.push(xpath);
        return { singleNodeValue: xpath.startsWith('//') || context.contains(outside) ? outside : null };
    };
    harness.context.removeLogin();
    harness.state.observers.at(-1).callback([{ addedNodes: [{ nodeType: 3 }, ordinary, login] }]);
    assert.ok(harness.document.body.children.includes(ordinary));
    assert.ok(!harness.document.body.children.includes(login));
    assert.ok(expressions.filter(xpath => xpath.includes('立即')).every(xpath => !xpath.startsWith('//')));
});

function waitingTree(titleText = '普通问题') {
    const root = element('div', ['.QuestionWaiting']);
    const list = root.appendChild(element('div', ['.QuestionWaiting-questions[role="list"]']));
    const card = list.appendChild(element('div', ['.jsNavigable'])); card.className = 'jsNavigable';
    const title = card.appendChild(element('a', ['a[href*="/question/"]']));
    title.href = 'https://www.zhihu.com/question/123'; title.textContent = titleText;
    return { root, list, card, title };
}

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

test('首页、waiting 和评论均保留空白字面语义，添加选区不改写旧词表', () => {
    const harness = loadUserscript({ settings: { menu_customBlockKeywords: ['牢   A'] } });
    harness.context.getSelectedBlockKeywordText = () => 'beta';
    harness.context.addSelectedKeywordToBlocklist();
    assert.deepEqual(harness.state.settings.get('menu_customBlockKeywords'), ['牢   A', 'beta']);
    assert.equal(harness.context.getMatchedBlockKeyword('牢 A', ['牢   A']), null);
    const tree = waitingTree('牢 A');
    harness.context.filterWaitingQuestionCard(tree.card, ['牢   A'], true);
    assert.equal(tree.card.hidden, false);
    harness.context.blockKeywords('index');
    const titleObserver = harness.state.observers.at(-1);
    const card = element('div', ['.Card.TopstoryItem.TopstoryItem-isRecommend']);
    const title = card.appendChild(element('meta', ['h2.ContentItem-title meta[itemprop="name"], meta[itemprop="headline"]']));
    title.content = '牢 A';
    titleObserver.callback([{ addedNodes: [card] }]);
    assert.equal(card.hidden, false);
    harness.context.blockKeywords('comment');
    const content = element(); content.textContent = '牢 A';
    const comment = element(); comment.querySelector = selector => { assert.equal(selector, '.CommentContent'); return content; };
    const avatar = { parentElement: { parentElement: { parentElement: { parentElement: comment } } } };
    const wrapper = element(); wrapper.className = 'css-test'; wrapper.querySelector = selector => { assert.equal(selector, 'a[href^="https://www.zhihu.com/people/"]>img.Avatar[alt][loading]'); return avatar; };
    harness.state.observers.at(-1).callback([{ addedNodes: [wrapper] }]);
    assert.equal(content.textContent, '牢 A');
    content.textContent = '牢   A';
    harness.state.observers.at(-1).callback([{ addedNodes: [wrapper] }]);
    assert.equal(content.textContent, '[该评论已屏蔽，可点击显示]');
    harness.setMenu('menu_blockKeywords', false);
    title.content = 'beta';
    titleObserver.callback([{ addedNodes: [card] }]);
    assert.equal(card.hidden, false);
});

test('长回答分支遇到已收起父节点后继续处理后续回答', () => {
    const harness = loadUserscript();
    const oldParent = element(), nextParent = element(); oldParent.setAttribute('script-collapsed', '');
    const old = oldParent.appendChild(element()), next = nextParent.appendChild(element());
    let clicks = 0; next.querySelector = () => ({ click() { clicks++; } });
    harness.context.getCollapsedAnswerObserver().callback([{ target: old, addedNodes: [] }, { target: next, addedNodes: [] }]);
    assert.equal(clicks, 1);
    assert.equal(nextParent.hasAttribute('script-collapsed'), true);
});

test('首帧样式原位重建，关闭时清除，延迟安装读取最新名单', () => {
    const harness = loadUserscript({ settings: { menu_customBlockUsers: ['alice'] } });
    const firstStyle = harness.document.getElementById('zhihuE_EarlyBlockedUsers');
    harness.setMenu('menu_customBlockUsers', ['bob']);
    assert.equal(harness.document.getElementById('zhihuE_EarlyBlockedUsers'), firstStyle);
    assert.match(firstStyle.textContent, /bob/); assert.doesNotMatch(firstStyle.textContent, /alice/);
    assert.equal(harness.document.head.children.filter(node => node.id === firstStyle.id).length, 1);
    harness.setMenu('menu_blockUsers', false);
    assert.equal(harness.document.getElementById('zhihuE_EarlyBlockedUsers'), null);
    const delayed = loadUserscript({ settings: { menu_customBlockUsers: ['alice'] }, document: { head: null, documentElement: null } });
    assert.equal(delayed.state.observers.length, 1);
    const discovery = delayed.state.observers[0];
    delayed.state.settings.set('menu_customBlockUsers', ['bob']);
    delayed.document.documentElement = element('html');
    discovery.callback([]);
    assert.match(delayed.document.documentElement.firstChild.textContent, /bob/);
    assert.doesNotMatch(delayed.document.documentElement.firstChild.textContent, /alice/);
    assert.equal(discovery.active, false);
});

test('首批等待超时后，直达问题和类别过滤仍处理锚点自身及包装节点', () => {
    const harness = loadUserscript({ location: { pathname: '/search', search: '?type=content' } });
    harness.context.addToQuestion();
    const questionObserver = harness.state.observers.at(-1);
    harness.context.blockType('search');
    const typeObserver = harness.state.observers.at(-1);
    for (let i = 0; i < 50; i++) harness.tick();
    assert.equal(harness.state.timers.size, 0);
    function title(href, selectors) {
        const card = element(); card.className = 'Card SearchResult-Card';
        const heading = card.appendChild(element('h2'));
        const anchor = heading.appendChild(element('a', selectors)); anchor.href = href; anchor.textContent = '标题';
        const meta = card.appendChild(element('meta', ['meta[itemprop="url"]'])); meta.content = 'https://www.zhihu.com/question/123';
        anchor.insertAdjacentHTML = function(position, html) {
            this.htmlWrites.push({ position, html });
            this.insertAdjacentElement(position, element('a', ['a.zhihu_e_toQuestion']));
        };
        return { card, anchor };
    }
    const first = title('https://www.zhihu.com/question/123/answer/456', ['h2.ContentItem-title a:not(.zhihu_e_tips)']);
    const second = title(first.anchor.href, ['h2.ContentItem-title a:not(.zhihu_e_tips)']);
    const wrapper = element(); wrapper.appendChild(second.card);
    questionObserver.callback([{ addedNodes: [{ nodeType: 3 }, first.anchor, wrapper] }]);
    assert.equal(first.anchor.htmlWrites.length, 1);
    assert.equal(second.anchor.htmlWrites.length, 1);
    const selector = 'h2.ContentItem-title a:not(.zhihu_e_toQuestion), a.KfeCollection-PcCollegeCard-link, h2.SearchTopicHeader-Title a';
    const video = title('https://www.zhihu.com/zvideo/123', [selector]);
    const video2 = title(video.anchor.href, [selector]);
    harness.document.body.appendChild(video.card);
    const videoWrapper = element(); videoWrapper.appendChild(video2.card); harness.document.body.appendChild(videoWrapper);
    typeObserver.callback([{ addedNodes: [{ nodeType: 3 }, video.anchor, videoWrapper] }]);
    assert.equal(video.card.parentElement, null);
    assert.equal(video2.card.parentElement, null);
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

test('类别过滤忽略缺少卡片祖先的节点，同批合法搜索卡片仍被处理', () => {
    for (const href of ['https://www.zhihu.com/zvideo/123', 'https://zhuanlan.zhihu.com/p/123', 'https://www.zhihu.com/topic/123', 'https://www.zhihu.com/market/123']) {
        const harness = loadUserscript({ settings: { menu_blockTypeArticle: true, menu_blockTypeTopic: true, menu_blockTypeSearch: true }, location: { pathname: '/search', search: '?type=content' } });
        harness.context.blockType('search');
        const observer = harness.state.observers.at(-1);
        const selector = 'h2.ContentItem-title a:not(.zhihu_e_toQuestion), a.KfeCollection-PcCollegeCard-link, h2.SearchTopicHeader-Title a';
        const orphan = harness.document.body.appendChild(element('h2'));
        const orphanLink = orphan.appendChild(element('a', [selector])); orphanLink.href = href;
        const card = harness.document.body.appendChild(element()); card.className = 'Card SearchResult-Card';
        const title = card.appendChild(element('h2'));
        const link = title.appendChild(element('a', [selector])); link.href = href;
        assert.doesNotThrow(() => observer.callback([{ target: harness.document.body, addedNodes: [{ nodeType: 3 }, orphan, title] }]));
        assert.equal(orphan.parentElement, harness.document.body);
        assert.ok(href.includes('/zvideo/') ? card.parentElement === null : card.hidden);
        assert.equal(harness.state.errors.length, 0);
    }
});

test('首页视频回答缺少卡片或回答祖先时保持原样，并处理同批合法回答', () => {
    const harness = loadUserscript({ location: { pathname: '/' } });
    harness.context.blockType();
    const observer = harness.state.observers.at(-1);
    const selector = 'h2.ContentItem-title a:not(.zhihu_e_toQuestion)';
    function answer(parent, withAnswer) {
        const content = withAnswer ? parent.appendChild(element()) : parent;
        if (withAnswer) content.className = 'ContentItem AnswerItem';
        content.appendChild(element('div', ['.VideoAnswerPlayer']));
        const title = content.appendChild(element('h2'));
        const link = title.appendChild(element('a', [selector])); link.href = 'https://www.zhihu.com/question/123/answer/456';
        return { title, content };
    }
    const orphan = answer(harness.document.body, false);
    const partial = answer(harness.document.body, true);
    const card = harness.document.body.appendChild(element()); card.className = 'Card TopstoryItem TopstoryItem-isRecommend';
    const valid = answer(card, true);
    assert.doesNotThrow(() => observer.callback([{ target: harness.document.body, addedNodes: [orphan.title, partial.title, valid.title] }]));
    assert.equal(partial.content.parentElement, harness.document.body);
    assert.equal(card.hidden, true);
    assert.equal(valid.content.parentElement, null);
});

test('作者头像解析相对 HTTP 地址，拒绝空值、畸形地址和其他协议', () => {
    const base = 'https://www.zhihu.com/question/123';
    const accepted = ['https://pic.example/a.png', 'http://pic.example/a.png', '//pic.example/a.png', '/a.png', 'a.png'];
    const rejected = ['', ' \t ', undefined, null, 'javascript:probe()', 'data:image/png;base64,AA==', 'ftp://pic.example/a.png', 'https://[invalid'];
    for (const avatarUrl of [...accepted, ...rejected]) {
        const harness = loadUserscript({ location: { pathname: '/question/123', href: base } });
        const data = harness.document.body.appendChild(element('script', ['#js-initialData']));
        data.textContent = JSON.stringify({ initialState: { entities: { questions: { 123: { author: { name: 'alice', urlToken: 'alice', avatarUrl } } } } } });
        const topics = harness.document.body.appendChild(element('div', ['.QuestionHeader-topics']));
        assert.doesNotThrow(() => harness.context.question_author());
        const author = topics.parentElement.children[topics.parentElement.children.indexOf(topics) - 1];
        assert.equal(author.firstChild.firstChild.src, accepted.includes(avatarUrl) ? new URL(avatarUrl, base).href : undefined);
        assert.equal(topics.htmlWrites.length, 0);
    }
});
