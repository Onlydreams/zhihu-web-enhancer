const assert = require('node:assert/strict');
const test = require('node:test');
const { element, loadUserscript } = require('../test-support/userscript-harness');

test('搜索框或角落按钮缺失时，完整启动仍注册 waiting 监听', () => {
    const harness = loadUserscript({ settings: { menu_cleanSearch: true } });
    harness.start();
    assert.ok(harness.state.observers.some(observer => observer.target === harness.document.body));
    assert.equal(harness.state.errors.length, 0);
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

test('初始化错误日志区分同一函数的场景并保留原始错误', () => {
    const harness = loadUserscript();
    const error = new Error('keyword probe');
    harness.context.blockKeywords = () => { throw error; };
    harness.start();
    assert.deepEqual(harness.state.errors.map(entry => entry[0]), [
        '[Zhihu Web Enhancer] 功能失败：blockKeywords(comment)',
        '[Zhihu Web Enhancer] 功能失败：blockKeywords(waiting)',
    ]);
    assert.ok(harness.state.errors.every(entry => entry[1] === error));
});
