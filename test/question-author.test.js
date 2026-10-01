const assert = require('node:assert/strict');
const test = require('node:test');
const { element, loadUserscript } = require('../test-support/userscript-harness');

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
