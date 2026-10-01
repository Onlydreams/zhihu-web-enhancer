const assert = require('node:assert/strict');
const test = require('node:test');
const { element, loadUserscript } = require('../test-support/userscript-harness');

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
