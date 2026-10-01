const assert = require('node:assert/strict');
const test = require('node:test');
const { element, loadUserscript } = require('../test-support/userscript-harness');

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

test('长回答分支遇到已收起父节点后继续处理后续回答', () => {
    const harness = loadUserscript();
    const oldParent = element(), nextParent = element(); oldParent.setAttribute('script-collapsed', '');
    const old = oldParent.appendChild(element()), next = nextParent.appendChild(element());
    let clicks = 0; next.querySelector = () => ({ click() { clicks++; } });
    harness.context.getCollapsedAnswerObserver().callback([{ target: old, addedNodes: [] }, { target: next, addedNodes: [] }]);
    assert.equal(clicks, 1);
    assert.equal(nextParent.hasAttribute('script-collapsed'), true);
});
