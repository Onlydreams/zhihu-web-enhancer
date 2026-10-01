const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '..', 'Zhihu-Enhanced.user.js'), 'utf8');

// 只实现测试需要的 DOM 操作；选择器由各场景显式提供，不模拟浏览器 CSS 引擎。
function element(tagName = 'div', selectors = []) {
    const node = {
        nodeType: 1, tagName: tagName.toUpperCase(), children: [], parentElement: null,
        dataset: {}, className: '', attributes: new Map(), selectors: new Set(selectors), htmlWrites: [],
        hidden: false,
        style: { display: '', cssText: '', removeProperty(name) { this[name] = ''; this[name + 'Priority'] = ''; }, getPropertyValue(name) { return this[name] || ''; }, getPropertyPriority(name) { return this[name + 'Priority'] || ''; }, setProperty(name, value, priority) { this[name] = value; this[name + 'Priority'] = priority; } },
        classList: { contains(name) { return node.className.split(/\s+/).includes(name); } },
        matches(selector) { return this.selectors.has(selector) || (selector === 'button[data-name][data-userid]' && this.tagName === 'BUTTON' && this.dataset.name !== undefined && this.dataset.userid !== undefined); },
        closest(selector) { return this.matches(selector) ? this : this.parentElement?.closest(selector) || null; },
        contains(target) { return target === this || this.children.some(child => child === target || (child.nodeType === 1 && child.contains(target))); },
        querySelectorAll(selector) {
            return this.children.flatMap(child => child.nodeType === 1 ? [
                ...(child.matches(selector) ? [child] : []), ...child.querySelectorAll(selector),
            ] : []);
        },
        querySelector(selector) { return this.querySelectorAll(selector)[0] || null; },
        appendChild(child) { child.parentElement = this; this.children.push(child); return child; },
        prepend(child) { child.parentElement = this; this.children.unshift(child); },
        insertAdjacentElement(position, child) {
            if (position === 'beforebegin' || position === 'afterend') {
                const parent = this.parentElement;
                if (!parent) return null;
                child.parentElement = parent;
                parent.children.splice(parent.children.indexOf(this) + (position === 'afterend' ? 1 : 0), 0, child);
                return child;
            }
            return position === 'afterbegin' ? (this.prepend(child), child) : this.appendChild(child);
        },
        insertAdjacentHTML(position, html) { this.htmlWrites.push({ position, html }); },
        remove() { if (this.parentElement) this.parentElement.children.splice(this.parentElement.children.indexOf(this), 1); this.parentElement = null; },
        replaceWith(value) {
            const parent = this.parentElement;
            if (!parent) return;
            const replacement = typeof value === 'string' ? { nodeType: 3, textContent: value, parentElement: parent } : value;
            replacement.parentElement = parent;
            parent.children.splice(parent.children.indexOf(this), 1, replacement);
            this.parentElement = null;
        },
        setAttribute(name, value) { this.attributes.set(name, String(value)); },
        hasAttribute(name) { return this.attributes.has(name); },
        removeAttribute(name) { this.attributes.delete(name); if (name === 'data-text') delete this.dataset.text; },
        addEventListener(name, callback) { this['on' + name] = callback; },
        click() { this.onclick?.call(this, { target: this }); },
    };
    Object.defineProperties(node, {
        textContent: { get() { return (this.text || '') + this.children.map(child => child.textContent).join(''); }, set(value) { this.text = String(value); this.children.forEach(child => { child.parentElement = null; }); this.children = []; } },
        innerHTML: { get() { return this.html || this.textContent; }, set(value) { this.html = String(value); this.htmlWrites.push({ position: 'innerHTML', html: this.html }); } },
        innerText: { get() { return this.textContent; }, set(value) { this.textContent = value; } },
        firstChild: { get() { return this.children[0] || null; } },
        firstElementChild: { get() { return this.children.find(child => child.nodeType === 1) || null; } },
        lastElementChild: { get() { return this.children.filter(child => child.nodeType === 1).at(-1) || null; } },
    });
    return node;
}

function loadUserscript(options = {}) {
    const state = { settings: new Map(Object.entries({ menu_customBlockUsers: [], ...options.settings })), observers: [], timers: new Map(), menus: new Map(), notifications: [], requests: [], errors: [], unregistered: [] };
    const root = element('html'), head = root.appendChild(element('head')), body = root.appendChild(element('body'));
    const windowListeners = new Map(), documentListeners = new Map();
    function addListener(listeners, name, callback) { if (!listeners.has(name)) listeners.set(name, new Set()); listeners.get(name).add(callback); }
    function emit(listeners, name) { for (const callback of [...(listeners.get(name) || [])]) callback({ type: name }); }
    let nextId = 1;
    const document = {
        nodeType: 9, head, body, documentElement: root, lastChild: root, lastElementChild: root, readyState: 'loading',
        createElement: tag => element(tag),
        querySelectorAll: selector => root.querySelectorAll(selector),
        querySelector(selector) { return this.querySelectorAll(selector)[0] || null; },
        getElementById(id) {
            function find(node) { if (node.id === id) return node; for (const child of node.children || []) { const result = find(child); if (result) return result; } return null; }
            return find(root);
        },
        evaluate: () => ({ singleNodeValue: null }),
        contains: target => root.contains(target),
        addEventListener: (name, callback) => addListener(documentListeners, name, callback),
        removeEventListener: (name, callback) => documentListeners.get(name)?.delete(callback),
        ...options.document,
    };
    const window = {
        onurlchange: null,
        addEventListener: (name, callback) => addListener(windowListeners, name, callback),
        removeEventListener: (name, callback) => windowListeners.get(name)?.delete(callback),
        getSelection: () => ({ toString: () => '' }),
        ...options.window,
    };
    const context = {
        document, window, location: { hostname: 'www.zhihu.com', pathname: '/question/waiting', href: 'https://www.zhihu.com/question/waiting', search: '', reload() { state.reloaded = true; }, ...options.location },
        console: { log() {}, error(...args) { state.errors.push(args); } },
        Node: { ELEMENT_NODE: 1 }, XPathResult: { FIRST_ORDERED_NODE_TYPE: 9 }, URL,
        GM_info: { scriptHandler: 'Probe', version: '1.0' },
        GM_getValue: name => structuredClone(state.settings.get(name)),
        GM_setValue: (name, value) => state.settings.set(name, structuredClone(value)),
        GM_registerMenuCommand(name, callback) { const id = nextId++; state.menus.set(id, { name, callback }); return id; },
        GM_unregisterMenuCommand(id) { state.unregistered.push(id); state.menus.delete(id); },
        GM_notification: notification => state.notifications.push(notification),
        GM_xmlhttpRequest: request => state.requests.push(request), GM_openInTab() {},
        prompt: () => null,
        MutationObserver: class {
            constructor(callback) { this.callback = callback; this.active = false; this.targets = new Map(); state.observers.push(this); }
            observe(target, config) { this.target = target; this.options = config; this.targets.set(target, config); this.active = true; }
            disconnect() { this.active = false; this.targets.clear(); }
        },
        setInterval(callback, delay) { const id = nextId++; state.timers.set(id, { callback, delay, interval: true }); return id; },
        clearInterval: id => state.timers.delete(id),
        setTimeout(callback, delay) { const id = nextId++; state.timers.set(id, { callback, delay, interval: false }); return id; },
        clearTimeout: id => state.timers.delete(id),
        ...options.globals,
    };
    vm.runInNewContext(source, context, { filename: 'Zhihu-Enhanced.user.js' });
    return {
        context, document, window, state,
        start() { document.readyState = 'interactive'; emit(documentListeners, 'readystatechange'); },
        changeUrl(pathname) { context.location.pathname = pathname; context.location.href = 'https://www.zhihu.com' + pathname; emit(windowListeners, 'urlchange'); },
        setMenu(name, value) { state.settings.set(name, structuredClone(value)); context.registerMenuCommand(); },
        deliver(mutations) {
            for (const observer of [...state.observers]) {
                if (!observer.active) continue;
                const records = mutations.filter(mutation => [...observer.targets].some(([target, config]) =>
                    (mutation.target === target || (config.subtree && target.contains(mutation.target))) &&
                    (mutation.type === 'characterData' ? config.characterData : config.childList)));
                if (records.length) observer.callback(records);
            }
        },
        tick() { for (const [id, timer] of [...state.timers]) { if (!state.timers.has(id)) continue; if (!timer.interval) state.timers.delete(id); timer.callback(); } },
    };
}

// 独立函数场景也加载完整脚本，随后替换其外部依赖，避免按字符提取函数源码。
function createContext(overrides = {}) {
    const { context } = loadUserscript();
    return Object.assign(context, overrides);
}

module.exports = { source, element, loadUserscript, createContext };
