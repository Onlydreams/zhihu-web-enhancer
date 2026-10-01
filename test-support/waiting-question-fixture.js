const { element } = require('./userscript-harness');

function waitingTree(titleText = '普通问题') {
    const root = element('div', ['.QuestionWaiting']);
    const list = root.appendChild(element('div', ['.QuestionWaiting-questions[role="list"]']));
    const card = list.appendChild(element('div', ['.jsNavigable'])); card.className = 'jsNavigable';
    const title = card.appendChild(element('a', ['a[href*="/question/"]']));
    title.href = 'https://www.zhihu.com/question/123'; title.textContent = titleText;
    return { root, list, card, title };
}

module.exports = { waitingTree };
