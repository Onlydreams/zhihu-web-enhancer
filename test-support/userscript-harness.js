const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '..', 'Zhihu-Enhanced.user.js'), 'utf8');

function textNode(value) {
    return {
        nodeType: 3, textContent: String(value), parentElement: null,
        get nodeValue() { return this.textContent; },
        set nodeValue(value) { this.textContent = String(value); },
    };
}

function dispatch(target, type, properties = {}, document) {
    const event = {
        type, target, button: 0, defaultPrevented: false, stopped: false, immediateStopped: false,
        preventDefault() { this.defaultPrevented = true; },
        stopPropagation() { this.stopped = true; },
        stopImmediatePropagation() { this.stopped = this.immediateStopped = true; },
        ...properties,
    };
    const path = [];
    for (let node = target; node; node = node.parentElement) path.push(node);
    if (document) path.push(document);
    function invoke(node, capture) {
        event.currentTarget = node;
        for (const [callback, options] of node.listeners?.get(type) || []) {
            if ((options === true || options?.capture === true) !== capture) continue;
            callback.call(node, event);
            if (event.immediateStopped) return;
        }
        if (!capture) node['on' + type]?.call(node, event);
    }
    for (const node of [...path].reverse()) { invoke(node, true); if (event.stopped) return event; }
    for (const node of path) { invoke(node, false); if (event.stopped) break; }
    return event;
}

// 只实现测试需要的 DOM 操作；选择器由各场景显式提供，不模拟浏览器 CSS 引擎。
function element(tagName = 'div', selectors = []) {
    const node = {
        nodeType: 1, tagName: tagName.toUpperCase(), children: [], parentElement: null,
        dataset: {}, className: '', attributes: new Map(), selectors: new Set(selectors), htmlWrites: [],
        hidden: false, listeners: new Map(),
        style: { display: '', cssText: '', removeProperty(name) { this[name] = ''; this[name + 'Priority'] = ''; }, getPropertyValue(name) { return this[name] || ''; }, getPropertyPriority(name) { return this[name + 'Priority'] || ''; }, setProperty(name, value, priority) { this[name] = value; this[name + 'Priority'] = priority; } },
        classList: {
            contains(name) { return node.className.split(/\s+/).includes(name); },
            add(...names) { node.className = [...new Set([...node.className.split(/\s+/).filter(Boolean), ...names])].join(' '); },
            remove(...names) { node.className = node.className.split(/\s+/).filter(name => !names.includes(name)).join(' '); },
        },
        matches(selector) {
            const classSelector = /^([a-z]+)?\.([\w-]+)$/.exec(selector);
            return this.selectors.has(selector) ||
                (classSelector && (!classSelector[1] || this.tagName === classSelector[1].toUpperCase()) && this.classList.contains(classSelector[2])) ||
                (selector === 'button[data-name][data-userid]' && this.tagName === 'BUTTON' && this.dataset.name !== undefined && this.dataset.userid !== undefined);
        },
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
        getAttribute(name) { return this.attributes.get(name) ?? null; },
        hasAttribute(name) { return this.attributes.has(name); },
        removeAttribute(name) { this.attributes.delete(name); if (name === 'data-text') delete this.dataset.text; },
        addEventListener(name, callback, options) { if (!this.listeners.has(name)) this.listeners.set(name, new Map()); this.listeners.get(name).set(callback, options); },
        removeEventListener(name, callback) { this.listeners.get(name)?.delete(callback); },
        click() { return dispatch(this, 'click'); },
    };
    Object.defineProperties(node, {
        textContent: { get() { return (this.text || '') + this.children.map(child => child.textContent).join(''); }, set(value) { delete this.html; delete this.text; this.children.forEach(child => { child.parentElement = null; }); this.children = []; if (String(value) !== '') this.appendChild(textNode(value)); } },
        // 不解析 HTML，但必须模拟赋值导致原子节点断开，才能检测所有权破坏。
        innerHTML: { get() { return this.html ?? this.textContent; }, set(value) { this.children.forEach(child => { child.parentElement = null; }); this.children = []; delete this.text; this.html = String(value); this.htmlWrites.push({ position: 'innerHTML', html: this.html }); } },
        outerHTML: { get() { return `<${this.tagName.toLowerCase()}>${this.innerHTML}</${this.tagName.toLowerCase()}>`; }, set(value) { const replacement = element(this.tagName); replacement.innerHTML = value; this.replaceWith(replacement); } },
        innerText: { get() { return this.textContent; }, set(value) { this.textContent = value; } },
        childNodes: { get() { return this.children; } },
        childElementCount: { get() { return this.children.filter(child => child.nodeType === 1).length; } },
        parentNode: { get() { return this.parentElement; } },
        nextElementSibling: { get() { return this.parentElement?.children.slice(this.parentElement.children.indexOf(this) + 1).find(child => child.nodeType === 1) || null; } },
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
    function addListener(listeners, name, callback, options) { if (!listeners.has(name)) listeners.set(name, new Map()); listeners.get(name).set(callback, options); }
    function emit(listeners, name) { for (const callback of [...(listeners.get(name)?.keys() || [])]) callback({ type: name }); }
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
        listeners: documentListeners,
        addEventListener: (name, callback, options) => addListener(documentListeners, name, callback, options),
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
        dispatch(target, type = 'click', properties) { return dispatch(target, type, properties, document); },
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
