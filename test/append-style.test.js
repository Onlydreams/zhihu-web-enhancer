const assert = require('node:assert/strict');
const test = require('node:test');
const { loadUserscript } = require('../test-support/userscript-harness');

test('普通样式入口保留挂载位置、字面内容和追加顺序', () => {
    const { context, document } = loadUserscript();
    const css = '.Card { display: none; }';
    const first = context.appendStyle(css);
    const second = context.appendStyle('span { color: red; }');
    const headStyle = context.appendStyle('.CornerButton { margin: 0; }', document.head);
    const bodyStyle = context.appendStyle('/* </style><img onerror="probe()"> */', document.body);
    assert.equal(first.parentElement, document.documentElement);
    assert.equal(document.documentElement.children.indexOf(second), document.documentElement.children.indexOf(first) + 1);
    assert.equal(first.textContent, css);
    assert.equal(headStyle.parentElement, document.head);
    assert.equal(bodyStyle.parentElement, document.body);
    assert.equal(bodyStyle.textContent, '/* </style><img onerror="probe()"> */');
    assert.equal(bodyStyle.tagName, 'STYLE');
    assert.deepEqual(bodyStyle.htmlWrites, []);
});

for (const blockVideo of [false, true]) {
    test(`首页真实初始化保留样式内容、挂载顺序和视频开关（${blockVideo ? '开启' : '关闭'}）`, () => {
        const harness = loadUserscript({
            location: { pathname: '/', href: 'https://www.zhihu.com/' },
            settings: { menu_blockTypeVideo: blockVideo, menu_typeTips: false, menu_toQuestion: false }
        });

        harness.start();

        const { document, state } = harness;
        const styles = document.documentElement.children.filter(node => node.tagName === 'STYLE');
        const expectedCss = [
            '.Question-mainColumnLogin, button.AppHeader-login {display: none !important;}',
            '.Topstory-container {min-height: 1500px;}'
        ];
        if (blockVideo) {
            expectedCss.push(
                '.Card .ZVideoItem-video, nav.TopstoryTabs > a[aria-controls="Topstory-zvideo"] {display: none !important;}',
                '.Card .ZVideoItem-video, .VideoAnswerPlayer video, nav.TopstoryTabs > a[aria-controls="Topstory-zvideo"] {display: none !important;}'
            );
        }
        assert.deepEqual(state.errors, []);
        assert.deepEqual(styles.map(style => style.textContent), expectedCss);
        for (const style of styles) assert.equal(style.parentElement, document.documentElement);
        assert.equal(document.head.children.filter(node => node.tagName === 'STYLE').length, 0);
        assert.equal(document.body.children.filter(node => node.tagName === 'STYLE').length, 0);
    });
}
