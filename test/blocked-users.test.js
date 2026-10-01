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

test('缺少用户主页节点不阻止评论和悬浮卡监听', () => {
    const harness = loadUserscript();
    harness.context.blockUsers('people');
    assert.equal(harness.state.observers.filter(observer => observer.active).length, 0);
    harness.setMenu('menu_customBlockUsers', ['alice']);
    assert.doesNotThrow(() => harness.context.blockUsers('people'));
    assert.equal(harness.state.observers.filter(observer => observer.active).length, 2);
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
