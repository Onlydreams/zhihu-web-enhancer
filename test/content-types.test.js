const assert = require('node:assert/strict');
const test = require('node:test');
const { element, loadUserscript } = require('../test-support/userscript-harness');

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
