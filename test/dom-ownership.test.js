const assert = require('node:assert/strict');
const test = require('node:test');
const { element, loadUserscript } = require('../test-support/userscript-harness');

const highlightSelector = 'span > a[data-za-not-track-link][href^="https://zhida.zhihu.com/search?"]';
const navigationSelector = 'header.AppHeader nav a[href], div.Card.ViewAll > a[href]';

test('HTML 赋值断开原子节点，outerHTML 自赋值也替换原节点', () => {
    const parent = element(), original = parent.appendChild(element('nav'));
    const child = original.appendChild(element('a'));
    original.innerHTML = '新的内容';
    assert.equal(child.parentElement, null);
    original.outerHTML = original.outerHTML;
    assert.equal(original.parentElement, null);
    assert.notEqual(parent.firstChild, original);
});

test('高亮清理保留链接与 React 子节点，动态链接及修饰点击仍被拦截', () => {
    const harness = loadUserscript();
    const span = harness.document.body.appendChild(element('span'));
    const link = span.appendChild(element('a', [highlightSelector]));
    link.href = 'https://zhida.zhihu.com/search?q=alpha';
    const child = link.appendChild(element('strong')); child.textContent = 'alpha';
    let nativeClicks = 0; link.onclick = () => nativeClicks++;
    harness.context.cleanHighlightLink();
    assert.equal(link.parentElement, span);
    assert.equal(link.firstChild, child);
    for (const [type, properties] of [['click', {}], ['click', { ctrlKey: true }], ['click', { metaKey: true }], ['auxclick', { button: 1 }]]) {
        const event = harness.dispatch(child, type, properties);
        assert.equal(event.defaultPrevented, true);
    }
    assert.equal(nativeClicks, 0);
    const dynamic = span.appendChild(element('a', [highlightSelector]));
    assert.equal(harness.dispatch(dynamic).defaultPrevented, true);
    harness.setMenu('menu_cleanHighlightLink', false);
    assert.equal(harness.dispatch(link).defaultPrevented, false);
    assert.equal(nativeClicks, 1);
});

test('静态导航保留 nav，捕获阶段阻止 SPA 并保留修饰键及中键原生行为', () => {
    const harness = loadUserscript({ location: { pathname: '/hot', href: 'https://www.zhihu.com/hot' } });
    const nav = harness.document.body.appendChild(element('nav', ['header.AppHeader nav']));
    const link = nav.appendChild(element('a', [navigationSelector, 'header.AppHeader nav>a:not([target])[href="https://www.zhihu.com/"]']));
    link.href = 'https://www.zhihu.com/';
    const child = link.appendChild(element('span'));
    let pageClicks = 0; link.onclick = () => pageClicks++;
    harness.context.switchHome(); harness.context.switchHome();
    assert.equal(nav.parentElement, harness.document.body);
    assert.equal(nav.firstChild, link);
    for (const [type, properties] of [['click', { ctrlKey: true }], ['click', { metaKey: true }], ['click', { shiftKey: true }], ['auxclick', { button: 1 }]]) {
        harness.document.cookie = 'tst=f;';
        const event = harness.dispatch(child, type, properties);
        assert.equal(event.defaultPrevented, false);
        assert.equal(event.stopped, true);
        assert.equal(harness.context.location.href, 'https://www.zhihu.com/hot');
        assert.match(harness.document.cookie, /^tst=r;/);
    }
    assert.equal(harness.dispatch(child).defaultPrevented, true);
    assert.equal(harness.context.location.href, link.href);
    assert.match(harness.document.cookie, /^tst=r;/);
    assert.equal(pageClicks, 0);
});

test('静态导航保留 target/download 默认行为，其他协议与非回答页 ViewAll 不接管', () => {
    const harness = loadUserscript();
    harness.context.switchHome();
    const link = harness.document.body.appendChild(element('a', [navigationSelector])); link.href = 'https://www.zhihu.com/hot';
    for (const [name, value] of [['target', '_blank'], ['download', '']]) {
        link.setAttribute(name, value);
        const event = harness.dispatch(link);
        assert.equal(event.defaultPrevented, false);
        assert.equal(event.stopped, true);
        link.removeAttribute(name);
    }
    link.href = 'javascript:void(0)';
    assert.equal(harness.dispatch(link).stopped, false);
    link.href = 'https://www.zhihu.com/question/123';
    link.selectors.add('div.Card.ViewAll > a[href]');
    assert.equal(harness.dispatch(link).stopped, false);
});

test('回答页完整启动保留查看全部回答链接，动态链接沿用静态导航', () => {
    const harness = loadUserscript({ location: { pathname: '/question/123/answer/456', href: 'https://www.zhihu.com/question/123/answer/456' } });
    const card = harness.document.body.appendChild(element());
    const link = card.appendChild(element('a', ['div.Card.ViewAll>a', navigationSelector, 'div.Card.ViewAll > a[href]']));
    link.href = 'https://www.zhihu.com/question/123';
    harness.start();
    assert.equal(card.firstChild, link);
    assert.equal(harness.dispatch(link).defaultPrevented, true);
    const dynamic = card.appendChild(element('a', [navigationSelector, 'div.Card.ViewAll > a[href]'])); dynamic.href = link.href;
    assert.equal(harness.dispatch(dynamic).defaultPrevented, true);
    assert.equal(harness.state.errors.length, 0);
});

test('登录清理保留普通包装节点及原按钮，仅隐藏具体提示', () => {
    const harness = loadUserscript();
    const wrapper = harness.document.body.appendChild(element('main'));
    const ordinary = wrapper.appendChild(element('section')); ordinary.textContent = '正常内容';
    const button = wrapper.appendChild(element('button')); button.textContent = '立即登录/注册';
    harness.document.evaluate = (xpath, target) => ({ singleNodeValue: xpath.includes('立即登录') && target?.contains(button) ? button : null });
    harness.context.removeLogin();
    harness.deliver([{ type: 'childList', target: harness.document.body, addedNodes: [wrapper] }]);
    assert.equal(wrapper.parentElement, harness.document.body);
    assert.equal(ordinary.parentElement, wrapper);
    assert.equal(button.parentElement, wrapper);
    assert.equal(button.hidden, true);
    assert.equal(button.style.display, 'none');
    assert.equal(button.style.getPropertyPriority('display'), 'important');
    assert.equal(ordinary.hidden, false);
});

test('登录入口保留页面按钮及其子节点，拦截原弹窗并打开登录页', () => {
    const harness = loadUserscript();
    const button = harness.document.body.appendChild(element('button', ['button.AppHeader-login']));
    const child = button.appendChild(element('span')); child.textContent = '登录/注册';
    harness.document.evaluate = xpath => ({ singleNodeValue: xpath.includes('登录/注册') ? button : null });
    let popup = 0, opened;
    button.onclick = () => popup++;
    harness.context.GM_openInTab = (...args) => { opened = args; };
    harness.context.removeLogin();
    assert.equal(button.parentElement, harness.document.body);
    assert.equal(button.firstChild, child);
    assert.equal(harness.dispatch(child).defaultPrevented, true);
    assert.equal(popup, 0);
    assert.equal(opened[0], 'https://www.zhihu.com/signin');
});

function commentFixture(harness) {
    const wrapper = harness.document.body.appendChild(element()); wrapper.className = 'css-comment';
    const meta = wrapper.appendChild(element()).appendChild(element());
    const author = meta.appendChild(element('a'));
    const avatar = author.appendChild(element('img')); avatar.alt = '作者';
    wrapper.querySelector = selector => selector.startsWith('a[href') ? avatar : elementQuery.call(wrapper, selector);
    const content = wrapper.appendChild(element('div', ['.CommentContent']));
    const link = content.appendChild(element('a')); link.textContent = 'alpha beta';
    return { wrapper, content, link };
}
const elementQuery = element().querySelector;

test('评论占位与点击恢复保留原链接、正文事件以及 display 优先级', () => {
    const harness = loadUserscript({ settings: { menu_customBlockKeywords: ['alpha', 'beta'] } });
    const { wrapper, content, link } = commentFixture(harness);
    content.style.setProperty('display', 'inline', 'important');
    const nativeClick = () => {}; content.onclick = nativeClick;
    harness.context.blockKeywords('comment');
    const mutation = { type: 'childList', target: harness.document.body, addedNodes: [wrapper] };
    harness.deliver([mutation]); harness.deliver([mutation]);
    assert.equal(content.firstChild, link);
    assert.equal(content.onclick, nativeClick);
    assert.equal(content.style.display, 'none');
    const placeholder = wrapper.querySelector('button.zhihuE_BlockedComment');
    assert.ok(placeholder);
    assert.equal(wrapper.querySelectorAll('button.zhihuE_BlockedComment').length, 1);
    placeholder.click();
    assert.equal(content.firstChild, link);
    assert.equal(content.textContent, 'alpha beta');
    assert.equal(content.style.display, 'inline');
    assert.equal(content.style.getPropertyPriority('display'), 'important');
    assert.equal(placeholder.parentElement, null);
});

test('评论正文单独移除、包装移除或搬移后清理占位，重新加入可再次过滤', () => {
    for (const operation of ['content', 'wrapper', 'move']) {
        const harness = loadUserscript({ settings: { menu_customBlockKeywords: ['alpha'] } });
        const { wrapper, content, link } = commentFixture(harness);
        content.style.setProperty('display', 'inline', 'important');
        harness.context.blockKeywords('comment');
        harness.deliver([{ type: 'childList', target: harness.document.body, addedNodes: [wrapper] }]);
        const placeholder = wrapper.querySelector('button.zhihuE_BlockedComment');
        assert.ok(placeholder);
        const removed = operation === 'wrapper' ? wrapper : content;
        const parent = removed.parentElement;
        removed.remove();
        if (operation === 'move') harness.document.body.appendChild(content);
        harness.deliver([{ type: 'childList', target: parent, removedNodes: [removed], addedNodes: [] }]);
        assert.equal(placeholder.parentElement, null);
        assert.equal(content.firstChild, link);
        assert.equal(content.style.display, 'inline');
        assert.equal(content.style.getPropertyPriority('display'), 'important');
        if (operation === 'move') content.remove();
        if (operation === 'wrapper') harness.document.body.appendChild(wrapper); else wrapper.appendChild(content);
        harness.deliver([{ type: 'childList', target: harness.document.body, addedNodes: [wrapper] }]);
        assert.equal(content.style.display, 'none');
        assert.ok(wrapper.querySelector('button.zhihuE_BlockedComment'));
    }
});

test('直达问题按钮保留标题子节点和英文问号', () => {
    const harness = loadUserscript({ location: { pathname: '/' } });
    const card = harness.document.body.appendChild(element());
    const heading = card.appendChild(element('h2'));
    const link = heading.appendChild(element('a', ['h2.ContentItem-title a:not(.zhihu_e_tips)'])); link.href = 'https://www.zhihu.com/question/123/answer/456';
    const title = link.appendChild(element('span')); title.textContent = '问题?';
    const meta = card.appendChild(element('meta', ['meta[itemprop="url"]'])); meta.content = 'https://www.zhihu.com/question/123';
    harness.context.addToQuestion();
    assert.equal(link.firstChild, title);
    assert.equal(link.textContent, '问题?');
    assert.equal(link.htmlWrites.length, 1);
    assert.equal(link.htmlWrites[0].position, 'afterend');
});

test('邀请折叠保留标题子节点和原事件，脚本按钮可展开和折叠', () => {
    const harness = loadUserscript({ location: { pathname: '/question/123' } });
    const topbar = harness.document.body.appendChild(element('div', ['.Topbar']));
    const title = topbar.appendChild(element('div', ['.QuestionInvitation-title']));
    const original = title.appendChild(element('strong')); original.textContent = '邀请回答';
    const content = harness.document.body.appendChild(element('div', ['.QuestionInvitation-content']));
    const nativeClick = () => {}; topbar.onclick = nativeClick;
    harness.context.questionInvitation(); harness.tick();
    assert.equal(original.parentElement, title);
    assert.equal(topbar.onclick, nativeClick);
    const toggle = title.querySelector('button.zhihuE_InvitationToggle');
    assert.ok(toggle);
    assert.equal(content.style.display, 'none');
    toggle.click(); assert.equal(content.style.display, '');
    toggle.click(); assert.equal(content.style.display, 'none');
});

test('时间和排名的叶文本更新保留 Text 身份，复杂子结构不变', () => {
    const harness = loadUserscript();
    const leaf = element('a'); leaf.textContent = '昨天';
    const original = leaf.firstChild;
    assert.equal(harness.context.setLeafText(leaf, '完整时间'), true);
    assert.equal(leaf.firstChild, original);
    assert.equal(leaf.textContent, '完整时间');
    const complex = element('a'); const child = complex.appendChild(element('span')); child.textContent = '原时间';
    assert.equal(harness.context.setLeafText(complex, '完整时间'), false);
    assert.equal(complex.firstChild, child);
    assert.equal(complex.textContent, '原时间');
});

test('完整时间入口只更新叶文本，复杂时间仍标记已处理以避免反复置顶', () => {
    const harness = loadUserscript();
    for (const complex of [false, true]) {
        const time = element(); const link = time.appendChild(element('a', ['a'])); link.dataset.tooltip = '发布于 2026-01-01';
        if (complex) link.appendChild(element('span')).textContent = '发布于昨天';
        else link.textContent = '发布于昨天';
        const original = link.firstChild;
        harness.context.topTime_allTime(time);
        assert.equal(link.firstChild, original);
        assert.equal(link.textContent, complex ? '发布于昨天' : '发布于 2026-01-01');
        assert.equal(time.classList.contains('full'), true);
    }
});

test('热榜入口保留隐藏项及排名 Text 身份，跳过复杂排名', () => {
    const harness = loadUserscript({ location: { pathname: '/hot' } });
    const cards = [];
    for (const [href, complex] of [['https://zhuanlan.zhihu.com/p/123', false], ['https://www.zhihu.com/question/123', false], ['https://www.zhihu.com/question/456', true]]) {
        const card = harness.document.body.appendChild(element('section', ['.HotList-list .HotItem', '.HotItem'])); card.className = 'HotItem';
        const link = card.appendChild(element('a', ['.HotItem-content a'])); link.href = href;
        const rank = card.appendChild(element('div', ['.HotItem-index .HotItem-rank']));
        if (complex) rank.appendChild(element('span')).textContent = '原排名'; else rank.textContent = '99';
        cards.push({ card, rank, original: rank.firstChild });
    }
    harness.document.querySelectorAll = selector => selector === '.HotList-list .HotItem:not([hidden])' ? cards.filter(item => !item.card.hidden).map(item => item.card) : selector === '.HotList-list .HotItem' ? cards.map(item => item.card) : [];
    harness.context.blockHotOther();
    assert.equal(cards[0].card.hidden, true);
    assert.equal(cards[0].card.style.display, 'none');
    assert.equal(cards[0].card.style.getPropertyPriority('display'), 'important');
    for (const item of cards) {
        assert.equal(item.card.parentElement, harness.document.body);
        assert.equal(item.rank.firstChild, item.original);
    }
    assert.equal(cards[1].rank.textContent, '1');
    assert.equal(cards[2].rank.textContent, '原排名');
    harness.state.observers.at(-1).callback([{ addedNodes: [cards[1].card] }]);
    assert.equal(cards[1].rank.firstChild, cards[1].original);
});

test('文章时间入口只合并叶文本，复杂子节点不触发改写或原生点击', () => {
    for (const complex of [false, true]) {
        const harness = loadUserscript({ settings: { menu_publishTop: false } });
        const time = harness.document.body.appendChild(element('div', ['.ContentItem-time:not(.xiu-time)']));
        if (complex) time.appendChild(element('span')).textContent = '编辑于昨天'; else time.textContent = '编辑于昨天';
        const original = time.firstChild;
        let clicks = 0; time.onclick = () => { clicks++; if (!complex) original.nodeValue = '发布于今天'; };
        harness.context.topTime_post();
        assert.equal(time.firstChild, original);
        assert.equal(clicks, complex ? 0 : 1);
        assert.equal(time.textContent, complex ? '编辑于昨天' : '发布于今天 ，编辑于昨天');
        assert.equal(time.classList.contains('xiu-time'), true);
    }
});
