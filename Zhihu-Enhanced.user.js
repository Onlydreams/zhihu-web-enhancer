// ==UserScript==
// @name         Zhihu Web Enhancer (Onlydreams fork)
// @name:zh-CN   知乎网页增强（Onlydreams 维护版）
// @name:zh-TW   知乎網頁增強（Onlydreams 維護版）
// @name:ru      Zhihu Web Enhancer (Onlydreams fork)
// @version      2.3.39
// @author       X.I.U (original), Onlydreams (fork maintainer)
// @description  Unofficial derivative of Zhihu enhancement, with keyword filtering for all Waiting for Answers categories.
// @description:zh-CN  知乎增强非官方维护版：保留上游网页增强能力，并支持“等你来答”全部分类的关键词过滤。
// @description:zh-TW  知乎增強非官方維護版：保留上游網頁增強能力，並支援「等你來答」全部分類的關鍵詞過濾。
// @description:ru  Неофициальная производная версия Zhihu enhancement с фильтрацией ключевых слов во всех категориях вопросов.
// @match        *://www.zhihu.com/*
// @match        *://zhuanlan.zhihu.com/*
// @exclude      https://www.zhihu.com/signin*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAFo0lEQVR4nJWXT4hlVxHGf9/tJyYuzJtxIziQN8RBFDEtIWB0MW+Mi4CIk4UuAtqvAxPcqAkJRNxMshDUTc8s3TjdO3c9QbIKod+o4CIuZtRFDEi3EIgEM/02jpPIPZ+LqnPv6TeB4IHLPfeeP1X11VdV54i2vewtOhaITcQDdEgdthAdINAGNkgd0IEVbwR17rAmx1TniSVil6e0V0UKgJc8pWdfG5yvwqRhs1FQIyQ3trvcpxsVGd4xf/gelO24yV0usK1VB6APOMDMKSADBShIBWNwj1WwjClAzLEL0CMc86jj9cl/LgRs8ZjCJvexH5r/xAuJa260TatG6DosIee4lHO0ZnWDXH5bgYQ8uql122Iis2Xnj4JtRH675AIHMAQKuAsdrLV3dYXTwQ7Bir1jrzJ+Wyw698yVkLmgxgVg+PGjcPw8zD6JKcgFUcD94AoNa0eXkO600lVqXOPqPrPZNT6tjylYBRZfgp0n4GgFR7dDkEieeNys6ZPCBq4MCicXdFLWdIKBHtMFfC4JY8Hf/nxEyY0jmD+IM7Cgy77gxtto+jF4+NMj8+tY84YOLd8JnZJPpiDxI7shUigimJ2Gwxf5yLb9aryvffOj5+pXKbzJDxOVoIw7REkLhedno7+6CzffgdkpmE3z+5/Nrq7JJMfejc3bNj+TnT4tTyRtmLiAlARKliK09Uis2fsTPPcqvvwNdPlxuP4mbO+P4aQObz0cG958F77+mxMJh9kDcPh0IpCcUIerqycYuc8FGX7zczB/CI6O4cofAA9GjuRjUFhN2I0hmISlNFCUzCGMSkxqfFJw3XD6cXjuOt57A1YfpM/KSSEqY9zLo4w0psLsVnknyhkVYgNPMlRQh+qE63+GSsaBoK2VJcdTKTcKDLmhA/o1BDKFKzKl3aOJcoNBu3SHAAe4ahwwKgBkFRhdMMIc6Chzf+VphruT6urwZBh1aEQXjL/2fZidHoVP74/3xS8GP1IBLQ/hxuGonCLFxpZKjtTpDpRrSjYwYa2p4GcvoPm59ZFU5L54apvP4MZhY2XJMh1u+DB0Qk7ybaIR2EGHl34LV1/HGU5CsP8MbH4Gnvw1vPJX7G48pGw/OiLgyoEKf4PAYH0f6VtdIOAmlwCwugOrO0mDOHRodjrG/vGv9HvyQEprRwQjPB3rWg5oXBNR0A+Vf2wtJwDZaP5ZPL0fVv+B4zto5yJjKK6R0CUPMI7K6jUEsgpKGYqTwXpneGiExKnR4iuZ6d6Ggx/C7FNwdBuu/C6ROBmiUU/6PDuWhh9tEssQHxFQVlmP3wKfPY23Hotfe3+Eq8tYf/kJmE2jdK8pIPWJTDmJAFmq1We57iNnDQol9HWFDbr8rfg8eg+Wb8KV19DyrQjLa08hNal4/hD4l3D+LNr/HvhncPhC49+Ev5475DHfeUjjGrPt4jHY+upgvZOAPL0XRJ2fgwdPNS7IdvADuPgF7m15UDEDOhaXXKQT6RyAzTNw8DxMPxHWn/1p6ObMjc8+DjvfhVMvwOr9EcLjnwc6V38PL78Gq7vYG8PBxAqTzUbInJwoGtlbfA3tfCeEL/8G23sZEaAMIV99HW2egdW/m9Is/Mpf0O4bsPw7tY4os+OAbuUXHZKe8W3gVDLeEjr/uTgRHb0Hy7fyf0PUQd2YH4eZesrRmMBqDhF5gRFiIxSRQoGJxS0Kc8XNRSasHlqStOZ3Nf1aKVQzIKkMzeHTGZaRoEzWmyxIyw6zW6FRQ6c2NapC5pCjuAl5+Od7Tru41vxagEpTOeN0LAq7oe0lH0DeC6uVH0Lito03kbVUnmSrp+yE/967Y8dNfqEvdwD+L09a3BrgbqA/IZS4H4osLE3mHlDzYB30iUJ7XwwklrzPhXWk4ZIXdGxROM//g0ZbQrKXVza0EQcQiWNvcIuOXXbG6/n/AAwhLDO9HaqBAAAAAElFTkSuQmCC
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_openInTab
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_notification
// @grant        GM_info
// @grant        window.onurlchange
// @sandbox      JavaScript
// @license      GPL-3.0 License
// @run-at       document-start
// @namespace    https://github.com/Onlydreams/zhihu-web-enhancer
// @supportURL   https://github.com/Onlydreams/zhihu-web-enhancer/issues
// @homepageURL  https://github.com/Onlydreams/zhihu-web-enhancer
// ==/UserScript==

// Derived from XIU2/UserScript Zhihu-Enhanced.user.js by X.I.U.
// Upstream baseline: v2.3.32 @ 77b9f742b2c291b2908bd092a1805783e78747d7.
// Modified by Onlydreams on 2026-08-06: added /question/waiting keyword filtering and pre-paint blocked-user hiding.

'use strict';
var menu_ALL = [
    ['menu_defaultCollapsedAnswer', '默认收起回答', '默认收起回答', true],
    ['menu_collapsedAnswer', '一键收起回答/评论', '一键收起回答/评论', true],
    ['menu_collapsedNowAnswer', '快捷收起回答/评论 (点击两侧空白处)', '快捷收起回答/评论', true],
    ['menu_backToTop', '快捷回到顶部 (右键两侧空白处)', '快捷回到顶部', true],
    ['menu_blockLowCount', '屏蔽低赞低评', '设置要屏蔽 低于多少赞同/评价 的回答/文章（默认不需要留空即可）<br/>（例如设置 0 则无人赞同/评价的回答/文章会被屏蔽<br/>（例如设置 20 则赞同/评价数量低于 20 的回答/文章会被屏蔽<br/>（修改后，后续加载的回答/文章会立即生效，但不影响当前网页已有内容', ''],
    ['menu_blockLowUpvoteCount', '最低赞同数 [首页]', '最低赞同数（首页）', ''],
    ['menu_blockLowCommentCount', '最低评价数 [首页]', '最低评价数（首页）', ''],
    ['menu_blockLowUpvoteCountQuestion', '最低赞同数 [问题页]', '最低赞同数（问题页）', ''],
    ['menu_blockLowCommentCountQuestion', '最低评价数 [问题页]', '最低评价数（问题页）', ''],
    ['menu_blockLowUpvoteCountFollow', '最低赞同数 [关注页]', '最低赞同数（关注页）', ''],
    ['menu_blockLowCommentCountFollow', '最低评价数 [关注页]', '最低评价数（关注页）', ''],
    ['menu_blockUsers', '屏蔽指定用户', '屏蔽指定用户', true],
    ['menu_customBlockUsers', '自定义屏蔽用户', '自定义屏蔽用户', ['故事档案局', '盐选推荐', '盐选科普', '盐选成长计划', '知乎盐选会员', '知乎盐选创作者', '盐选心理', '盐选健康必修课', '盐选奇妙物语', '盐选生活馆', '盐选职场', '盐选文学甄选', '盐选作者小管家', '盐选博物馆', '盐选点金', '盐选测评室', '盐选科技前沿', '盐选会员精品']],
    ['menu_blockKeywords', '屏蔽指定关键词', '屏蔽指定关键词', true],
    ['menu_blockKeywordsComment', '屏蔽关键词 - 评论区', '屏蔽关键词 - 评论区', true],
    ['menu_customBlockKeywords', '自定义屏蔽关键词', '自定义屏蔽关键词', []],
    ['menu_addSelectedBlockKeywords', '添加选中文字到屏蔽词 ↑', '添加选中文字到屏蔽词', []],
    ['menu_blockType', '屏蔽指定类别 (视频/文章等)', '勾选 = 屏蔽该类别的信息流', ''],
    ['menu_blockTypeVideo', '视频 [首页、搜索页、问题页、关注页]', '视频（首页、搜索页、问题页、关注页）', true],
    ['menu_blockTypeArticle', '文章 [首页、搜索页、关注页]', '文章（首页、搜索页、关注页）', false],
    ['menu_blockTypePin', '想法 [首页、关注页]', '想法（首页、关注页）', false],
    ['menu_blockTypeFollowAgree', '赞同了XX [关注页]', '赞同了XX（关注页）', false],
    ['menu_blockTypeFollowQuestion', '关注了XX [关注页]', '关注了XX（关注页）', false],
    ['menu_blockTypeTopic', '话题 [搜索页]', '话题（搜索页）', false],
    ['menu_blockTypeSearch', '杂志文章、盐选专栏、相关搜索等 [搜索页]', '相关搜索、杂志、盐选等（搜索页）', false],
    ['menu_blockYanXuan', '盐选内容 [问题页]', '盐选内容（问题页）', false],
    ['menu_blockTypeLiveHot', '热榜文章、直播、广告等 [热榜]', '热榜文章、直播、广告等 [热榜]', true],
    ['menu_cleanHighlightLink', '移除高亮链接 (高亮的文字链接)', '移除高亮链接', true],
    ['menu_cleanSearch', '净化搜索热门 (默认搜索词及热门搜索)', '净化搜索热门', false],
    ['menu_cleanTitles', '净化标题消息 (标题中的私信/消息)', '净化标题提醒', false],
    ['menu_questionRichTextMore', '展开问题描述', '展开问题描述', false],
    ['menu_publishTop', '置顶显示时间', '置顶显示时间', true],
    ['menu_typeTips', '区分问题文章', '区分问题文章', true],
    ['menu_toQuestion', '直达问题按钮', '直达问题按钮', true]
], menu_ID = [];
for (let i=0;i<menu_ALL.length;i++){ // 如果读取到的值为 null 就写入默认值
    if (GM_getValue(menu_ALL[i][0]) == null){GM_setValue(menu_ALL[i][0], menu_ALL[i][3])};
}
var earlyBlockedUserStyleObserver = null;
installEarlyBlockedUserStyle(); // 在知乎首次绘制回答前隐藏已屏蔽用户，避免先显示再移除
registerMenuCommand();


// 转义 CSS 单引号字符串中的特殊字符
function escapeCssAttributeValue(value) {
    return String(value)
        .replace(/\\/g, '\\\\')
        .replace(/'/g, "\\'")
        .replace(/\0/g, '\\fffd ')
        .replace(/\r/g, '\\d ')
        .replace(/\n/g, '\\a ')
        .replace(/\f/g, '\\c ');
}


// 根据现有用户黑名单生成首帧 CSS；原有 JavaScript 过滤继续作为兼容回退
function buildEarlyBlockedUserCss(users) {
    const selectors = [];
    for (const user of users || []) {
        const name = String(user || '').trim();
        if (name === '') continue
        const authorData = escapeCssAttributeValue(`authorName":"${name}",`);
        const answer = `.ContentItem.AnswerItem[data-zop*='${authorData}']`;
        selectors.push(`.List-item:has(${answer})`, `.Card.AnswerCard:has(${answer})`);
    }
    if (selectors.length === 0) return ''
    return `${selectors.join(',\n')} {display: none !important;}`;
}


function installEarlyBlockedUserStyle() {
    const css = GM_getValue('menu_blockUsers') ? buildEarlyBlockedUserCss(GM_getValue('menu_customBlockUsers') || []) : '';
    const existingStyle = document.getElementById('zhihuE_EarlyBlockedUsers');
    if (css === '') {
        if (existingStyle) existingStyle.remove();
        if (earlyBlockedUserStyleObserver) earlyBlockedUserStyleObserver.disconnect();
        earlyBlockedUserStyleObserver = null;
        return
    }
    const root = document.head || document.documentElement;
    if (root) {
        const style = existingStyle || document.createElement('style');
        style.id = 'zhihuE_EarlyBlockedUsers';
        style.textContent = css;
        if (!existingStyle) root.appendChild(style);
        if (earlyBlockedUserStyleObserver) earlyBlockedUserStyleObserver.disconnect();
        earlyBlockedUserStyleObserver = null;
    } else if (!earlyBlockedUserStyleObserver) {
        // document-start 时根节点尚未出现；回调读取最新名单，避免延迟安装旧样式。
        earlyBlockedUserStyleObserver = new MutationObserver(installEarlyBlockedUserStyle);
        earlyBlockedUserStyleObserver.observe(document, { childList: true, subtree: true });
    }
}

// 注册脚本菜单
function registerMenuCommand() {
    for (const id of menu_ID) {
        if (id != null) GM_unregisterMenuCommand(id);
    }
    menu_ID = [];
    for (let i=0;i<menu_ALL.length;i++){ // 循环注册脚本菜单
        menu_ALL[i][3] = GM_getValue(menu_ALL[i][0]);
        if (menu_ALL[i][0] === 'menu_blockLowCount') {
            menu_ID[i] = GM_registerMenuCommand(`#️⃣ ${menu_ALL[i][1]}`, function(){menu_setting('checkbox', menu_ALL[i][1], menu_ALL[i][2], true, [menu_ALL[i+1], menu_ALL[i+2], menu_ALL[i+3], menu_ALL[i+4], menu_ALL[i+5], menu_ALL[i+6]])});
            //menu_ID[i] = GM_registerMenuCommand(`#️⃣ ${menu_ALL[i][1]}`, function(){customBlockLowCount(menu_ALL[i][0],'设置要屏蔽 低于多少赞同 的回答？\n（例如设置 50 则赞同数低于 50 的回答会被屏蔽\n（目前该功能适用于 首页信息流、问题页\n（点击 [确定] 修改后，后续加载的回答会立即生效，不影响当前已有\n（如不需要请留空并直接点击 [确定] 即可')});
        //} else if (menu_ALL[i][0] === 'menu_blockLowCommentCount') {
            //menu_ID[i] = GM_registerMenuCommand(`#️⃣ ${menu_ALL[i][1]}`, function(){customBlockLowCount(menu_ALL[i][0],'设置要屏蔽 低于多少评价 的回答？\n（例如设置 20 则评价数低于 20 的回答会被屏蔽\n（目前该功能适用于 首页信息流、问题页\n（点击 [确定] 修改后，后续加载的回答会立即生效，不影响当前已有\n（如不需要请留空并直接点击 [确定] 即可')});
        } else if (menu_ALL[i][0] === 'menu_customBlockUsers') { // 只有 [屏蔽指定用户] 启用时，才注册菜单 [自定义屏蔽用户]
            if (menu_value('menu_blockUsers')) menu_ID[i] = GM_registerMenuCommand(`#️⃣ ${menu_ALL[i][1]}`, function(){customBlockUsers()});
        } else if (menu_ALL[i][0] === 'menu_blockKeywordsComment') { // 只有 [屏蔽指定关键词] 启用时，才注册菜单 [屏蔽关键词 - 评论区]
            if (menu_value('menu_blockKeywords')) menu_ID[i] = GM_registerMenuCommand(`${menu_ALL[i][3]?'✅':'❌'} ${menu_ALL[i][1]}`, function(){menu_switch(`${menu_ALL[i][3]}`,`${menu_ALL[i][0]}`,`${menu_ALL[i][2]}`)});
        } else if (menu_ALL[i][0] === 'menu_customBlockKeywords') { // 只有 [屏蔽指定关键词] 启用时，才注册菜单 [自定义屏蔽关键词]
            if (menu_value('menu_blockKeywords')) menu_ID[i] = GM_registerMenuCommand(`#️⃣ ${menu_ALL[i][1]}`, function(){customBlockKeywords()});
        } else if (menu_ALL[i][0] === 'menu_addSelectedBlockKeywords') { // 只有 [屏蔽指定关键词] 启用时，才注册菜单 [添加选中文字到屏蔽词]
            if (menu_value('menu_blockKeywords')) menu_ID[i] = GM_registerMenuCommand(`#️⃣ ${menu_ALL[i][1]}`, function(){addSelectedKeywordToBlocklist()});
        } else if (menu_ALL[i][0] === 'menu_blockType') { // 屏蔽指定类别 使用单独的设置界面
            menu_ID[i] = GM_registerMenuCommand(`#️⃣ ${menu_ALL[i][1]}`, function(){menu_setting('checkbox', menu_ALL[i][1], menu_ALL[i][2], true, [menu_ALL[i+1], menu_ALL[i+2], menu_ALL[i+3], menu_ALL[i+4], menu_ALL[i+5], menu_ALL[i+6], menu_ALL[i+7], menu_ALL[i+8], menu_ALL[i+9]])});
        } else if (menu_ALL[i][0].indexOf('menu_blockType') == -1 && menu_ALL[i][0] != 'menu_blockYanXuan' && menu_ALL[i][0].indexOf('menu_blockLow') == -1) { // 排除使用单独设置界面的 屏蔽指定类别 项
            menu_ID[i] = GM_registerMenuCommand(`${menu_ALL[i][3]?'✅':'❌'} ${menu_ALL[i][1]}`, function(){menu_switch(`${menu_ALL[i][3]}`,`${menu_ALL[i][0]}`,`${menu_ALL[i][2]}`)});
        }
    }
    installEarlyBlockedUserStyle();
    menu_ID[menu_ID.length] = GM_registerMenuCommand('💬 反馈 & 建议', function () {window.GM_openInTab('https://github.com/Onlydreams/zhihu-web-enhancer/issues', {active: true,insert: true,setParent: true});});
}


// 菜单开关
function menu_switch(menu_status, Name, Tips) {
    if (menu_status == 'true'){
        GM_setValue(`${Name}`, false);
        GM_notification({text: `已关闭 [${Tips}] 功能\n（点击刷新网页后生效）`, timeout: 3500, onclick: function(){location.reload();}});
    }else{
        GM_setValue(`${Name}`, true);
        GM_notification({text: `已开启 [${Tips}] 功能\n（点击刷新网页后生效）`, timeout: 3500, onclick: function(){location.reload();}});
    }
    registerMenuCommand(); // 重新注册脚本菜单
};


// 返回菜单值
function menu_value(menuName) {
    for (let menu of menu_ALL) {
        if (menu[0] == menuName) {
            return menu[3]
        }
    }
}


// 脚本设置
function menu_setting(type, title, tips, line, menu) {
    let _br = '', _html = `<style class="zhihuE_SettingStyle">.zhihuE_SettingRoot {position: absolute;top: 50%;left: 50%;-webkit-transform: translate(-50%, -50%);-moz-transform: translate(-50%, -50%);-ms-transform: translate(-50%, -50%);-o-transform: translate(-50%, -50%);transform: translate(-50%, -50%);width: auto;min-width: 400px;max-width: 600px;height: auto;min-height: 150px;max-height: 400px;color: #535353;background-color: #fff;border-radius: 3px;}
.zhihuE_SettingBackdrop_1 {position: fixed;top: 0;right: 0;bottom: 0;left: 0;z-index: 203;display: -webkit-box;display: -ms-flexbox;display: flex;-webkit-box-orient: vertical;-webkit-box-direction: normal;-ms-flex-direction: column;flex-direction: column;-webkit-box-pack: center;-ms-flex-pack: center;justify-content: center;overflow-x: hidden;overflow-y: auto;-webkit-transition: opacity .3s ease-out;transition: opacity .3s ease-out;}
.zhihuE_SettingBackdrop_2 {position: absolute;top: 0;right: 0;bottom: 0;left: 0;z-index: 0;background-color: rgba(18,18,18,.65);-webkit-transition: background-color .3s ease-out;transition: background-color .3s ease-out;}
.zhihuE_SettingRoot .zhihuE_SettingHeader {padding: 10px 20px;color: #fff;font-weight: bold;background-color: #3994ff;border-radius: 3px 3px 0 0;}
.zhihuE_SettingRoot .zhihuE_SettingMain {padding: 10px 20px;border-radius: 0 0 3px 3px;}
.zhihuE_SettingHeader span {float: right;cursor: pointer;}
.zhihuE_SettingMain input {margin: 10px 6px 10px 0;vertical-align:middle;}
.zhihuE_SettingMain input[type=text] {margin: 5px 6px 5px 0;padding-block: 0;}
.zhihuE_SettingMain input[name=zhihuE_Setting_Checkbox] {cursor: pointer;}
.zhihuE_SettingMain label {margin-right: 20px;user-select: none;cursor: pointer;vertical-align:middle;}
.zhihuE_SettingMain hr {border: 0.5px solid #f4f4f4;}
[data-theme="dark"] .zhihuE_SettingRoot {color: #adbac7;background-color: #343A44;}
[data-theme="dark"] .zhihuE_SettingHeader {color: #d0d0d0;background-color: #2D333B;}
[data-theme="dark"] .zhihuE_SettingMain hr {border: 0.5px solid #2d333b;}</style>
        <div class="zhihuE_SettingBackdrop_1"><div class="zhihuE_SettingBackdrop_2"></div><div class="zhihuE_SettingRoot">
            <div class="zhihuE_SettingHeader">${title}<span class="zhihuE_SettingClose" title="点击关闭"><svg class="Zi Zi--Close Modal-closeIcon" fill="currentColor" viewBox="0 0 24 24" width="24" height="24"><path d="M13.486 12l5.208-5.207a1.048 1.048 0 0 0-.006-1.483 1.046 1.046 0 0 0-1.482-.005L12 10.514 6.793 5.305a1.048 1.048 0 0 0-1.483.005 1.046 1.046 0 0 0-.005 1.483L10.514 12l-5.208 5.207a1.048 1.048 0 0 0 .006 1.483 1.046 1.046 0 0 0 1.482.005L12 13.486l5.207 5.208a1.048 1.048 0 0 0 1.483-.006 1.046 1.046 0 0 0 .005-1.482L13.486 12z" fill-rule="evenodd"></path></svg></span></div>
            <div class="zhihuE_SettingMain"><p>${tips}</p><hr>`
    if (line) _br = '<br>'
    for (let i=0; i<menu.length; i++) {
        if (menu[i][0].indexOf('menu_blockLow') === 0) {
            _html += `<label>${menu[i][1]}：<input name="${menu[i][0]}" type="text" oninput="value=value.replace(/[^\\d]/g,'')" value="${GM_getValue(menu[i][0])}" style="width: 50px;"></label>${_br}`
        } else if (GM_getValue(menu[i][0])) {
            _html += `<label><input name="zhihuE_Setting_Checkbox" type="checkbox" value="${menu[i][0]}" checked="checked">${menu[i][1]}</label>${_br}`
        } else {
            _html += `<label><input name="zhihuE_Setting_Checkbox" type="checkbox" value="${menu[i][0]}">${menu[i][1]}</label>${_br}`
        }
    }
    _html += `</div></div></div>`
    document.body.insertAdjacentHTML('beforeend', _html); // 插入网页末尾
    setTimeout(function() { // 延迟 100 毫秒，避免太快
        const doc = document.querySelector('.zhihuE_SettingBackdrop_1');
        if (!doc) return
        // 关闭按钮 点击事件
        doc.querySelector('.zhihuE_SettingClose').onclick = function(){this.parentElement.parentElement.parentElement.remove();document.querySelector('.zhihuE_SettingStyle').remove();}
        // 点击周围空白处 = 点击关闭按钮
        doc.querySelector('.zhihuE_SettingBackdrop_2').onclick = function(event){if (event.target == this) {document.querySelector('.zhihuE_SettingClose').click();};}
        // 复选框 点击事件
        doc.querySelectorAll('input[name=zhihuE_Setting_Checkbox]').forEach(function (checkBox) {
            checkBox.addEventListener('click', function(){if (this.checked) {console.log('this.value',true);GM_setValue(this.value, true);} else {console.log('this.value',false);GM_setValue(this.value, false);}});
        })
        // 输入框 变化事件
        doc.querySelectorAll('input[type=text]').forEach(function (checkBox) {
            checkBox.onchange = function(){GM_setValue(this.name, this.value);};
        })
    }, 100)
}


// 添加收起回答观察器
function getCollapsedAnswerObserver() {
    if (!window._collapsedAnswerObserver) {
        const observer = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                if (mutation.target.nodeType !== 1 || mutation.target.hasAttribute('script-collapsed')) continue
                // 短的回答
                if (mutation.target.classList.contains('RichContent')) {
                    for (const addedNode of mutation.addedNodes) {
                        if (addedNode.nodeType != Node.ELEMENT_NODE) continue
                        if (addedNode.className != 'RichContent-inner') continue
                        if (addedNode.offsetHeight < 400) break
                        //console.log('111',addedNode, addedNode.classList, addedNode.classList.contains('RichContent-inner'), addedNode.offsetHeight, addedNode.textContent.length)
                        const button = mutation.target.querySelector('.ContentItem-actions.Sticky [data-zop-retract-question]');
                        if (button) {
                            mutation.target.setAttribute('script-collapsed', '');
                            button.click();
                            break
                        }
                    }
                // 长的回答
                } else if (mutation.target.tagName === 'DIV' && !mutation.target.style.cssText && !mutation.target.className) {
                    if (!mutation.target.parentElement || mutation.target.parentElement.hasAttribute('script-collapsed')) continue
                    //console.log('222',mutation.target, mutation.target.querySelector('.ContentItem-actions.Sticky [data-zop-retract-question]'))
                    const button = mutation.target.querySelector('.ContentItem-actions.Sticky [data-zop-retract-question]');
                    if (button) {
                        mutation.target.parentElement.setAttribute('script-collapsed', '');
                        button.click();
                        continue
                    }
                }
            }
        })

        observer.start = function() {
            if (!this._active) {
                this.observe(document, { childList: true, subtree: true });
                this._active = true;
            }
        }
        observer.end = function() {
            if (this._active) {
                this.disconnect();
                this._active = false;
            }
        }

        window.addEventListener('urlchange', function() {
            observer[location.href.indexOf('/answer/') === -1 ? 'start' : 'end']();
        })
        window._collapsedAnswerObserver = observer;
    }
    return window._collapsedAnswerObserver
}


// 默认收起回答
function defaultCollapsedAnswer() {
    if (!menu_value('menu_defaultCollapsedAnswer')) return
    const observer = getCollapsedAnswerObserver();
    if (location.href.indexOf('/answer/') === -1) {
        observer.start();
    }
}


// 一键收起回答+评论（全部）
function collapsedAnswer() {
    if (!menu_value('menu_collapsedAnswer')) return
    //console.log('1111', document.querySelector('.CornerAnimayedFlex'))
    if (document.querySelector('.CornerAnimayedFlex>button') && !document.getElementById('collapsed-button')) {
        // 向网页中插入收起全部回答按钮+样式+绑定点击事件
        appendStyle('.CornerButton{margin-bottom:8px !important;}.CornerButtons{bottom:25px !important;} .CornerAnimayedFlex {height: auto;}', document.head);
        document.querySelector('.CornerAnimayedFlex').insertAdjacentHTML('afterBegin', '<button id="collapsed-button" data-tooltip="收起全部回答/评论" data-tooltip-position="left" data-tooltip-will-hide-on-click="false" aria-label="收起全部回答/评论" type="button" class="' + document.querySelector('.CornerAnimayedFlex>button').className + '"><svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" color="var(--MapText02A)" class="Zi Zi--ArrowUpward" fill="currentColor" style="-webkit-transform: rotate(180deg);transform: rotate(180deg);"><path d="M4.336 10.07a.875.875 0 0 1 .094-1.234l7-6 .003-.002a.87.87 0 0 1 .12-.085l.01-.007a.873.873 0 0 1 .131-.061l.012-.004a.874.874 0 0 1 .586 0l.011.004a.872.872 0 0 1 .262.153l.004.002 7 6a.875.875 0 0 1-1.139 1.328l-5.555-4.761V20.5a.875.875 0 0 1-1.75 0V5.403l-5.556 4.761a.875.875 0 0 1-1.233-.095Z"></path></svg></button>');
        document.getElementById('collapsed-button').onclick = function () {

            // 收起所有评论（悬浮的 [收起评论]）
            document.querySelectorAll('.Comments-container').forEach(function (el) {
                let commentCollapseButton = getXpath('.//button[text()="收起评论"]', el)
                if (commentCollapseButton) commentCollapseButton.click();
            });
            // 收起所有评论（固定的 [收起评论]）
            document.querySelectorAll('.RichContent >.ContentItem-actions>button:first-of-type').forEach(function (el) {
                if (el.textContent.indexOf('收起评论') > -1) el.click()
            });

            if (location.pathname === '/' || location.pathname === '/hot' || location.pathname === '/follow') {// 对于首页的关注、推荐、热榜
                document.querySelectorAll('.ContentItem-rightButton').forEach(function (el) {if (el.hasAttribute('data-zop-retract-question')) {el.click();};});
            } else {
                // 被 getCollapsedAnswerObserver 函数收起过的，固定 [收起] 按钮
                document.querySelectorAll('[script-collapsed]').forEach(function(scriptCollapsed) {scriptCollapsed.querySelectorAll('.ContentItem-actions [data-zop-retract-question], .ContentItem-actions.Sticky [data-zop-retract-question]').forEach(function(button) {button.click();});})
                // 被 getCollapsedAnswerObserver 函数收起过的，悬浮 [收起] 按钮（悬浮底部的横栏）
                document.querySelectorAll('.RichContent:not([script-collapsed]) .ContentItem-actions.Sticky [data-zop-retract-question]').forEach(function(button) {
                    let el = button.parentElement;
                    while (!el.classList.contains('RichContent')) {el = el.parentElement;}
                    if (el) el.setAttribute('script-collapsed', '');
                    button.click();
                })

                const observer = getCollapsedAnswerObserver();
                observer.start();

                if (!menu_value('menu_defaultCollapsedAnswer') && !observer._disconnectListener) {
                    window.addEventListener('urlchange', function() {
                        observer.end();
                        window._collapsedAnswerObserver = null;
                    })
                    observer._disconnectListener = true;
                }
            }
        }
    }
}


// 收起当前回答、评论（监听点击事件，点击网页两侧空白处）
function collapsedNowAnswer(selectors) {
    backToTop(selectors) // 快捷回到顶部
    if (!menu_value('menu_collapsedNowAnswer')) return
    let element = document.querySelector(selectors)
    if (element) {
        element.onclick = function(event){
            if (event.target == this) {
                // 下面这段主要是 [收起回答]，顺便 [收起评论]（如果展开了的话）
                let rightButton = document.querySelector('.ContentItem-actions.Sticky.RichContent-actions.is-fixed.is-bottom')
                if (rightButton) { // 悬浮在底部的 [收起回答]（此时正在浏览回答内容 [中间区域]）
                    // 固定的 [收起评论]（先看看是否展开评论）
                    let commentCollapseButton = rightButton.querySelector('button.Button.ContentItem-action.Button--plain.Button--withIcon.Button--withLabel:first-of-type')
                    //console.log('111')
                    if (commentCollapseButton && commentCollapseButton.textContent.indexOf('收起评论') > -1) commentCollapseButton.click();
                    // 再去收起回答
                    rightButton = rightButton.querySelector('.ContentItem-rightButton[data-zop-retract-question]')
                    //console.log('222')
                    if (rightButton) rightButton.click();

                } else { // 固定在回答底部的 [收起回答]（此时正在浏览回答内容 [尾部区域]）

                    // 悬浮的 [收起评论]（此时正在浏览评论内容 [中间区域]）
                    //if (getXpath('//button[text()="收起评论"]',document.querySelector('.Comments-container'))) {getXpath('//button[text()="收起评论"]',document.querySelector('.Comments-container')).click();console.log('asfaf')}

                    let answerCollapseButton_ = false;
                    for (let el of document.querySelectorAll('.ContentItem-rightButton[data-zop-retract-question]')) { // 遍历所有回答底部的 [收起] 按钮
                        if (isElementInViewport(el)) { // 判断该 [收起] 按钮是否在可视区域内
                            // 固定的 [收起评论]（先看看是否展开评论，即存在 [收起评论] 按钮）
                            let commentCollapseButton = el.parentNode.querySelector('button.Button.ContentItem-action.Button--plain.Button--withIcon.Button--withLabel:first-of-type')
                            // 如果展开了评论，就收起评论
                            //console.log('333')
                            //if (commentCollapseButton && commentCollapseButton.textContent.indexOf('收起评论') > -1) commentCollapseButton.click();
                            if (commentCollapseButton && commentCollapseButton.textContent.indexOf('收起评论') > -1) {
                                commentCollapseButton.click();
                                if (!isElementInViewport(commentCollapseButton)) scrollTo(0,el.offsetTop+50)
                            }
                            //console.log('444')
                            el.click() // 再去收起回答
                            answerCollapseButton_ = true; // 如果找到并点击收起了，就没必要执行下面的代码了（可视区域中没有 [收起回答] 时）
                            break
                        }
                    }
                    // 针对完全看不到 [收起回答] 按钮时（如 [头部区域]，以及部分明明很长却不显示悬浮横条的回答）
                    if (!answerCollapseButton_) {
                        for (let el of document.querySelectorAll('.List-item, .Card.AnswerCard, .Card.TopstoryItem')) { // 遍历所有回答主体元素
                            if (isElementInViewport_(el)) { // 判断该回答是否在可视区域内
                                // 固定的 [收起评论]（先看看是否展开评论，即存在 [收起评论] 按钮）
                                let commentCollapseButton = el.querySelector('button.Button.ContentItem-action.Button--plain.Button--withIcon.Button--withLabel:first-of-type')
                                // 如果展开了评论，就收起评论
                                //console.log('555',commentCollapseButton)
                                if (commentCollapseButton && commentCollapseButton.textContent.indexOf('收起评论') > -1) {
                                    commentCollapseButton.click();
                                    if (!isElementInViewport(commentCollapseButton)) scrollTo(0,el.offsetTop+50)
                                }
                                let answerCollapseButton__ = el.querySelector('.ContentItem-rightButton[data-zop-retract-question]');
                                //console.log('666')
                                if (answerCollapseButton__) answerCollapseButton__.click() // 再去收起回答
                                break
                            }
                        }
                    }
                }

                // 下面这段只针对 [收起评论]（如果展开了的话）
                let commentCollapseButton_ = false, commentCollapseButton__ = false;
                // 悬浮的 [收起评论]（此时正在浏览评论内容 [中间区域]）
                let commentCollapseButton = getXpath('//button[text()="收起评论"]',document.querySelector('.Comments-container'))
                if (commentCollapseButton) {
                    //console.log('777', commentCollapseButton)
                    commentCollapseButton.click();
                } else { // 固定的 [收起评论]（此时正在浏览评论内容 [头部区域]）
                    let commentCollapseButton_1 = document.querySelectorAll('.ContentItem-actions > button.Button.ContentItem-action.Button--plain.Button--withIcon.Button--withLabel:first-of-type, .ContentItem-action > button.Button.Button--plain.Button--withIcon.Button--withLabel:first-of-type')
                    if (commentCollapseButton_1.length > 0) {
                        for (let el of commentCollapseButton_1) {
                            if (el.textContent.indexOf('收起评论') > -1) {
                                if (isElementInViewport(el)) {
                                    //console.log('888')
                                    el.click()
                                    commentCollapseButton_ = true // 如果找到并点击了，就没必要执行下面的代码了（可视区域中没有 [收起评论] 时）
                                    break
                                }
                            }
                        }
                    }
                    if (commentCollapseButton_ == false) { // 可视区域中没有 [收起评论] 时（此时正在浏览评论内容 [头部区域] + [尾部区域](不上不下的，既看不到固定的 [收起评论] 又看不到悬浮的 [收起评论])），需要判断可视区域中是否存在评论元素
                        let commentCollapseButton_1 = document.querySelectorAll('.Comments-container')
                        if (commentCollapseButton_1.length > 0) {
                            for (let el of commentCollapseButton_1) {
                                if (isElementInViewport(el)) {
                                    let parentElement = findParentElement(el, 'List-item') || findParentElement(el, 'Card '),
                                        commentCollapseButton = parentElement.querySelector('.ContentItem-actions > button.Button.ContentItem-action.Button--plain.Button--withIcon.Button--withLabel:first-of-type')
                                    if (commentCollapseButton.textContent.indexOf('收起评论') > -1) {
                                        //console.log('999')
                                        commentCollapseButton.click()
                                        if (!isElementInViewport(commentCollapseButton)) {console.log(parentElement,parentElement.offsetTop,parentElement.offsetHeight);scrollTo(0,parentElement.offsetTop+parentElement.offsetHeight-50)}
                                        commentCollapseButton__ = true // 如果找到并点击了，就没必要执行下面的代码了（可视区域中没有 评论元素 时）
                                        break
                                    }
                                }
                            }
                        }
                        if (commentCollapseButton__ == false) { // 如果上面的都没找到，那么就尝试寻找评论末尾的 [评论回复框]
                            let commentCollapseButton_2 = document.querySelectorAll('.Editable-content')
                            if (commentCollapseButton_2.length > 0) {
                                for (let el of commentCollapseButton_2) {
                                    if (isElementInViewport(el)) {
                                        let parentElement = findParentElement(el, 'List-item') || findParentElement(el, 'Card '),
                                            commentCollapseButton = parentElement.querySelector('.ContentItem-actions > button.Button.ContentItem-action.Button--plain.Button--withIcon.Button--withLabel:first-of-type')
                                        //console.log(commentCollapseButton)
                                        if (commentCollapseButton.textContent.indexOf('收起评论') > -1) {
                                            //console.log('101010')
                                            commentCollapseButton.click()
                                            if (!isElementInViewport(commentCollapseButton)) {console.log(parentElement,parentElement.offsetTop,parentElement.offsetHeight);scrollTo(0,parentElement.offsetTop+parentElement.offsetHeight-50)}
                                            break
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}


// 回到顶部（监听点击事件，鼠标右键点击网页两侧空白处）
function backToTop(selectors) {
    if (!menu_value('menu_backToTop')) return
    let element = document.querySelector(selectors)
    if (element) {
        element.oncontextmenu = function(event){
            if (event.target == this) {
                event.preventDefault();
                window.scrollTo(0,0)
            }
        }
    }
}


//获取元素是否在可视区域（完全可见）
function isElementInViewport(el) {
    let rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}
//获取元素是否在可视区域（部分可见）
function isElementInViewport_(el) {
    let rect = el.getBoundingClientRect();
    return (
    rect.top < (window.innerHeight || document.documentElement.clientHeight) &&
    rect.bottom > 0
  );
}


// 屏蔽低赞/低评回答/文章
function blockLowCount(type) {
    switch(type) {
        case 'index':
            blockLowCount_('.Card.TopstoryItem.TopstoryItem-isRecommend', 'Card TopstoryItem TopstoryItem-isRecommend', 'menu_blockLowUpvoteCount', 'menu_blockLowCommentCount');
            break;
        case 'follow':
            blockLowCount_('.Card.TopstoryItem.TopstoryItem-isFollow', 'Card TopstoryItem TopstoryItem-isFollow', 'menu_blockLowUpvoteCountFollow', 'menu_blockLowCommentCountFollow');
            break;
        case 'question':
            blockLowCount_('.List-item', 'List-item', 'menu_blockLowUpvoteCountQuestion', 'menu_blockLowCommentCountQuestion');
            break;
    }
    console.log(type)


    function blockLowCount_(className1, className2, menuUpvote, menuComment) {
        // 前几条因为是直接加载的，而不是动态插入网页的，所以需要单独判断
        function blockLowCount_now() {
            document.querySelectorAll(className1).forEach(function(item1){
                console.log(item1)
                blockLowCount_1(item1,menuUpvote,'upvote_num');
                blockLowCount_1(item1,menuComment,'comment_num');
            })
        }

        blockLowCount_now();
        window.addEventListener('urlchange', function(){
            setTimeout(blockLowCount_now, 1000); // 网页 URL 变化后再次执行
        })

        // 这个是监听网页插入事件，用来判断后续网页动态插入的元素
        const callback = (mutationsList, observer) => {
            for (const mutation of mutationsList) {
                for (const target of mutation.addedNodes) {
                    if (target.nodeType != 1) continue
                    if (target.className === className2) {
                        blockLowCount_1(target,menuUpvote,'upvote_num');
                        blockLowCount_1(target,menuComment,'comment_num');
                    }
                }
            }
        };
        const observer = new MutationObserver(callback);
        observer.observe(document, { childList: true, subtree: true });
    }


    function blockLowCount_1(item, menu, type) {
        if (GM_getValue(menu)) {
            let item_ContentItem = item.querySelector('.ContentItem')
            if (item_ContentItem && item_ContentItem.dataset.zaExtraModule) {
                let item2 = JSON.parse(item_ContentItem.dataset.zaExtraModule);
                //console.log(item2)
                if (item2 && item2.card.content && Number(item2.card.content[type]) < Number(GM_getValue(menu))) {
                    console.log('已屏蔽' + (type === 'upvote_num' ? '低赞':'低评') + (item_ContentItem.classList.contains('AnswerItem') ? '回答':'文章') + '：', item2.card.content[type] + '<' + GM_getValue(menu), item);
                    item.hidden = true;
                    item.style.display = 'none';
                }
            }
        }
    }
}



// 自定义屏蔽用户
function customBlockUsers() {
    let nowBlockUsers = '';
    menu_value('menu_customBlockUsers').forEach(function(item){nowBlockUsers += '|' + item})
    //console.log(nowBlockUsers.replace('|',''))
    let newBlockUsers = prompt('编辑 [自定义屏蔽用户]\n（不同用户名之间使用 "|" 分隔，例如：用户A|用户B|用户C ）', nowBlockUsers.replace('|',''));
    if (newBlockUsers === '') {
        GM_setValue('menu_customBlockUsers', []);
        registerMenuCommand(); // 重新注册脚本菜单
    } else if (newBlockUsers != null) {
        GM_setValue('menu_customBlockUsers', newBlockUsers.split('|'));
        registerMenuCommand(); // 重新注册脚本菜单
    }
};


// 屏蔽指定用户
function blockUsers(type) {
    if (!menu_value('menu_blockUsers')) return
    if (!menu_value('menu_customBlockUsers') || menu_value('menu_customBlockUsers').length < 1) return
    switch(type) {
        case 'index':
            blockUsers_('.Card.TopstoryItem.TopstoryItem-isRecommend', 'Card TopstoryItem TopstoryItem-isRecommend');
            break;
        case 'follow':
            blockUsers_('.Card.TopstoryItem.TopstoryItem-isFollow', 'Card TopstoryItem TopstoryItem-isFollow');
            break;
        case 'question':
            blockUsers_question();
            break;
        case 'search':
            blockUsers_search();
            break;
        case 'topic':
            blockUsers_('.List-item.TopicFeedItem', 'List-item TopicFeedItem');
            break;
        case 'people':
            runFeature('blockUsers_button_people', blockUsers_button_people); // 添加屏蔽用户按钮（用户主页）
            break;
    }
    blockUsers_comment(); //       评论区
    blockUsers_button(); //        加入黑名单按钮（用户信息悬浮框中）

    function blockUsers_(className1, className2) {
        // 前几条因为是直接加载的，而不是动态插入网页的，所以需要单独判断
        function blockKeywords_now() {
            document.querySelectorAll(className1).forEach(function(item1){
                let item = item1.querySelector('.ContentItem.AnswerItem, .ContentItem.ArticleItem'); // 用户名所在元素
                if (item) {
                    for (const keyword of menu_value('menu_customBlockUsers')) { // 遍历用户名黑名单
                        if (keyword != '' && item.dataset.zop.indexOf('authorName":"' + keyword + '",') > -1) { // 找到就删除该信息流
                            console.log('已屏蔽：' + item.dataset.zop);
                            item1.hidden = true;
                            break;
                        }
                    }
                }
            })
        }

        blockKeywords_now();
        window.addEventListener('urlchange', function(){
            setTimeout(blockKeywords_now, 1000); // 网页 URL 变化后再次执行
        })

        // 这个是监听网页插入事件，用来判断后续网页动态插入的元素
        const callback = (mutationsList, observer) => {
            for (const mutation of mutationsList) {
                for (const target of mutation.addedNodes) {
                    if (target.nodeType != 1) continue
                    if (target.className === className2) {
                        let item = target.querySelector('.ContentItem.AnswerItem, .ContentItem.ArticleItem'); // 用户名所在元素
                        if (item) {
                            for (const keyword of menu_value('menu_customBlockUsers')) { // 遍历用户名黑名单
                                if (keyword != '' && item.dataset.zop.indexOf('authorName":"' + keyword + '",') > -1) { // 找到就删除该信息流
                                    console.log('已屏蔽：' + item.dataset.zop);
                                    target.hidden = true;
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        };
        const observer = new MutationObserver(callback);
        observer.observe(document, { childList: true, subtree: true });
    }


    function blockUsers_question() {
        const blockUsers_question_ = (mutationsList, observer) => {
            for (const mutation of mutationsList) {
                for (const target of mutation.addedNodes) {
                    if (target.nodeType != 1) continue
                    if (target.className === 'List-item' || target.className === 'Card AnswerCard') {
                        let item1 = target.querySelector('.ContentItem.AnswerItem');
                        if (item1) {
                            menu_value('menu_customBlockUsers').forEach(function(item2){ // 遍历用户黑名单
                                if (item1.dataset.zop.indexOf('authorName":"' + item2 + '",') > -1) { // 找到就删除该回答
                                    console.log('已屏蔽：' + item1.dataset.zop)
                                    target.hidden = true;
                                }
                            })
                        }
                    }
                }
            }
        };

        const blockUsers_question_answer_ = (mutationsList, observer) => {
            for (const mutation of mutationsList) {
                for (const target of mutation.addedNodes) {
                    if (target.nodeType != 1) continue
                    target.querySelectorAll('.List-item, .Card.AnswerCard').forEach(function(item){
                        let item1 = item.querySelector('.ContentItem.AnswerItem');
                        if (item1) {
                            menu_value('menu_customBlockUsers').forEach(function(item2){ // 遍历用户黑名单
                                if (item1.dataset.zop.indexOf('authorName":"' + item2 + '",') > -1) { // 找到就删除该回答
                                    console.log('已屏蔽：' + item1.dataset.zop)
                                    item.hidden = true;
                                }
                            })
                        }
                    })
                }
            }
        };

        if (location.pathname.indexOf('/answer/') > -1) { // 回答页（就是只有三个回答的页面）
            const observer = new MutationObserver(blockUsers_question_answer_);
            observer.observe(document, { childList: true, subtree: true });
        } else { // 问题页（可以显示所有回答的页面）
            const observer = new MutationObserver(blockUsers_question_);
            observer.observe(document, { childList: true, subtree: true });
        }

        // 针对的是打开网页后直接加载的前面几个回答（上面哪些是针对动态加载的回答）
        document.querySelectorAll('.List-item, .Card.AnswerCard').forEach(function(item){
            let item1 = item.querySelector('.ContentItem.AnswerItem');
            if (item1) {
                menu_value('menu_customBlockUsers').forEach(function(item2){ // 遍历用户黑名单
                    if (item1.dataset.zop.indexOf('authorName":"' + item2 + '",') > -1) { // 找到就删除该回答
                        console.log('已屏蔽：' + item1.dataset.zop)
                        item.hidden = true;
                    }
                })
            }
        })
    }

    function blockUsers_search() {
        function blockUsers_now() {
            if (location.search.indexOf('type=content') === -1) return // 目前只支持搜索页的 [综合]
            document.querySelectorAll('.Card.SearchResult-Card[data-za-detail-view-path-module="AnswerItem"], .Card.SearchResult-Card[data-za-detail-view-path-module="PostItem"]').forEach(function(item1){
                let item = item1.querySelector('.RichText.ztext.CopyrightRichText-richText b'); // 用户名所在元素
                if (item) {
                    for (const keyword of menu_value('menu_customBlockUsers')) { // 遍历用户名黑名单
                        if (keyword != '' && item.textContent === keyword) { // 找到就删除该信息流
                            console.log('已屏蔽：' + item.textContent);
                            item1.hidden = true;
                            break;
                        }
                    }
                }
            })
        }

        setTimeout(blockUsers_now, 2000);
        window.addEventListener('urlchange', function(){
            setTimeout(blockUsers_now, 1000); // 网页 URL 变化后再次执行
        })

        const callback = (mutationsList, observer) => {
            if (location.search.indexOf('type=content') === -1) return // 目前只支持搜索页的 [综合]
            for (const mutation of mutationsList) {
                for (const target of mutation.addedNodes) {
                    if (target.nodeType != 1) continue
                    let item = target.querySelector('.Card.SearchResult-Card[data-za-detail-view-path-module="AnswerItem"] .RichText.ztext.CopyrightRichText-richText b, .Card.SearchResult-Card[data-za-detail-view-path-module="PostItem"] .RichText.ztext.CopyrightRichText-richText b');
                    if (item) {
                        for (const keyword of menu_value('menu_customBlockUsers')) { // 遍历用户名黑名单
                            if (keyword != '' && item.textContent === keyword) { // 找到就删除该信息流
                                console.log('已屏蔽：' + item.textContent);
                                target.hidden = true;
                                break;
                            }
                        }
                    }
                }
            }
        };
        const observer = new MutationObserver(callback);
        observer.observe(document, { childList: true, subtree: true });
    }

    function blockUsers_comment() {
        const callback = (mutationsList, observer) => {
            for (const mutation of mutationsList) {
                for (const target of mutation.addedNodes) {
                    if (target.nodeType != 1) continue
                    //console.log(target)
                    if (target.tagName == 'DIV' && target.className.indexOf('css-') == 0 && target.dataset.id == undefined) {
                        let item = target.querySelector('a[href^="https://www.zhihu.com/people/"]>img.Avatar[alt][loading]')
                        if (item) {
                            //console.log(item)
                            menu_value('menu_customBlockUsers').forEach(function(item1){ // 遍历用户黑名单
                                if (item.alt === item1) { // 找到就删除该搜索结果
                                    //console.log(item.alt,item1)
                                    item.parentElement.parentElement.parentElement.parentElement.style.display = "none";
                                }
                            })

                            // 添加屏蔽用户按钮（点赞、回复等按钮后面）
                            /*if (item) {
                            let footer = findParentElement(item, 'CommentItemV2-meta', true).parentElement.querySelector('.CommentItemV2-metaSibling > .CommentItemV2-footer'),
                                userid = item.parentElement;
                            if (userid && footer && !footer.lastElementChild.dataset.name) {
                                userid = userid.href.split('/')[4];
                                footer.insertAdjacentHTML('beforeend',`<button type="button" data-name="${item.alt}" data-userid="${userid}" class="Button CommentItemV2-hoverBtn Button--plain"><span style="display: inline-flex; align-items: center;">&#8203;<svg class="Zi Zi--Like" fill="currentColor" viewBox="0 0 24 24" width="16" height="16" style="transform: rotate(180deg); margin-right: 5px;"><path d="M18.376 5.624c-3.498-3.499-9.254-3.499-12.752 0-3.499 3.498-3.499 9.254 0 12.752 3.498 3.499 9.254 3.499 12.752 0 3.499-3.498 3.499-9.14 0-12.752zm-1.693 1.693c2.37 2.37 2.596 6.094.678 8.69l-9.367-9.48c2.708-1.919 6.32-1.58 8.69.79zm-9.48 9.48c-2.37-2.37-2.595-6.095-.676-8.69l9.48 9.48c-2.822 1.918-6.433 1.58-8.803-.79z" fill-rule="evenodd"></path></svg></span>屏蔽用户</button>`);
                                footer.lastElementChild.onclick = function(){blockUsers_button_add(this.dataset.name, this.dataset.userid, false)}
                            }
                        }*/
                        }
                    }
                }
            }
        };
        const observer = new MutationObserver(callback);
        observer.observe(document, { childList: true, subtree: true });
    }


    // 昵称来自页面数据，只能作为文本或属性值赋给 DOM，不参与 HTML 解析。
    function createBlockUserButton(name, userid, blocked, reload) {
        const button = document.createElement('button');
        button.type = 'button';
        button.dataset.name = name;
        button.dataset.userid = userid;
        button.className = 'Button FollowButton Button--primary Button--red';
        button.innerHTML = '<span style="display: inline-flex; align-items: center;">​<svg width="1.2em" height="1.2em" viewBox="0 0 24 24" class="Zi Zi--Ban" fill="currentColor"><path fill-rule="evenodd" d="M16.346 18.113a7.5 7.5 0 0 1-10.46-10.46l10.46 10.46Zm1.767-1.767L7.654 5.886a7.5 7.5 0 0 1 10.46 10.46ZM22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Z" clip-rule="evenodd"></path></svg></span>' + (blocked ? ' 已屏蔽' : ' 屏蔽用户');
        button.onclick = function() {
            this.disabled = true;
            (blocked ? blockUsers_button_del : blockUsers_button_add)(this.dataset.name, this.dataset.userid, reload);
        }
        return button;
    }

    // 添加屏蔽用户按钮（用户信息悬浮框中）
    function blockUsers_button() {
        const observer = new MutationObserver(function(mutationsList) {
            for (const mutation of mutationsList) {
                for (const target of mutation.addedNodes) {
                    if (target.nodeType != 1) continue
                    if (target.tagName !== 'DIV' || !(target.className.indexOf('css-') === 0 || target.style.cssText === 'opacity: 1;')) continue
                    const item = target.querySelector('.MemberButtonGroup.ProfileButtonGroup.HoverCard-buttons');
                    const user = target.querySelector('img.Avatar+div span.UserLink>a.UserLink-link[data-za-detail-view-element_name=User]');
                    if (!item || !user || item.querySelector('button[data-name][data-userid]')) continue
                    const blocked = menu_value('menu_customBlockUsers').includes(user.textContent);
                    const button = createBlockUserButton(user.textContent, user.href.split('/')[4], blocked, false);
                    if (blocked) {
                        target.querySelectorAll('.Button.Button--primary.Button--red').forEach(function(button){button.style.display = 'none';});
                        item.prepend(button);
                    } else {
                        button.style.cssText = 'width: 100%;margin: 7px 0 0 0;';
                        item.appendChild(button);
                    }
                }
            }
        });
        observer.observe(document, { childList: true, subtree: true });
    }

    // 添加屏蔽用户按钮（用户主页）
    function blockUsers_button_people() {
        const item = document.querySelector('.MemberButtonGroup.ProfileButtonGroup.ProfileHeader-buttons');
        const nameNode = document.querySelector('.ProfileHeader-name');
        if (!item || !nameNode || !nameNode.firstChild || item.querySelector('button[data-name][data-userid]')) return
        const name = nameNode.firstChild.textContent;
        const blocked = menu_value('menu_customBlockUsers').includes(name);
        const button = createBlockUserButton(name, location.pathname.split('/')[2], blocked, true);
        button.style.cssText = 'margin: 0 0 0 12px;';
        if (blocked) {
            item.querySelectorAll('.Button.Button--primary.Button--red').forEach(function(button){button.style.display = 'none';});
            item.prepend(button);
        } else {
            item.appendChild(button);
        }
    }

    // 本地名单先保存；账号级屏蔽仍是继承功能，失败不回滚本地设置。
    function syncAccountBlockedUser(userid, blocked, reload) {
        let completed = false;
        function finish(success, reason) {
            if (completed) return
            completed = true;
            GM_notification({text: `本地${blocked ? '屏蔽' : '取消屏蔽'}已保存。\n账号${blocked ? '屏蔽' : '取消屏蔽'}${success ? '已同步' : '失败：' + reason}。\n刷新网页后更新已有内容。`, timeout: 4000});
            if (reload) setTimeout(function(){location.reload();}, 200);
        }
        try {
            GM_xmlhttpRequest({
                url: `https://www.zhihu.com/api/v4/members/${encodeURIComponent(userid)}/actions/block`,
                method: blocked ? 'POST' : 'DELETE', timeout: 2000,
                onload: response => finish(response.status >= 200 && response.status < 300, `HTTP ${response.status}`),
                onerror: () => finish(false, '网络错误'),
                ontimeout: () => finish(false, '请求超时'),
                onabort: () => finish(false, '请求取消'),
            });
        } catch (error) {
            console.error('[Zhihu Web Enhancer] 账号屏蔽请求失败', error);
            finish(false, '请求未能发出');
        }
    }

    function blockUsers_button_add(name, userid, reload) {
        if (!name || !userid) return
        const users = menu_value('menu_customBlockUsers');
        if (users.includes(name)) {
            GM_notification({text: '该用户已经被屏蔽啦，无需重复屏蔽~', timeout: 3000});
            return
        }
        users.push(name);
        GM_setValue('menu_customBlockUsers', users);
        installEarlyBlockedUserStyle();
        syncAccountBlockedUser(userid, true, reload);
    }

    function blockUsers_button_del(name, userid, reload) {
        if (!name || !userid) return
        const users = menu_value('menu_customBlockUsers');
        const index = users.indexOf(name);
        if (index === -1) {
            GM_notification({text: '没有在屏蔽列表中找到该用户...', timeout: 3000});
            return
        }
        users.splice(index, 1);
        GM_setValue('menu_customBlockUsers', users);
        installEarlyBlockedUserStyle();
        syncAccountBlockedUser(userid, false, reload);
    }
}

// 缓存最近一次选中的文字，避免从右键脚本菜单回调中取不到当前选区
var selectedTextForBlockKeywords = '';
var waitingQuestionVisibility = new WeakMap();
// 规范化屏蔽词文本：压缩多余空白并去掉首尾空格
function normalizeBlockKeywordText(text) {
    return (text || '').replace(/\s+/g, ' ').trim();
}

// 全站匹配使用字面子串且忽略大小写；选区输入的规范化不改变已有词表。
function getMatchedBlockKeyword(text, keywords) {
    const normalizedText = String(text || '').toLowerCase();
    for (const keyword of keywords || []) {
        const normalizedKeyword = String(keyword || '').toLowerCase();
        if (normalizedKeyword !== '' && normalizedText.indexOf(normalizedKeyword) > -1) return keyword
    }
    return null
}

// “等你来答”的四个问题分类共用同一个页面路径和列表 Adapter
function isWaitingQuestionView(pathname) {
    return pathname === '/question/waiting';
}


function findWaitingQuestionTitle(card) {
    return Array.from(card.querySelectorAll('a[href*="/question/"]')).find(function(link) {
        return /\/question\/\d+(?:$|[?#])/.test(link.href);
    });
}


function filterWaitingQuestionCard(card, keywords, shouldFilter) {
    const blockedMarker = 'zhihuEBlockedKeywordWaiting';
    const title = findWaitingQuestionTitle(card);
    const matchedKeyword = shouldFilter && title ? getMatchedBlockKeyword(title.textContent, keywords) : null;
    if (matchedKeyword !== null) {
        if (!card.dataset[blockedMarker]) console.log(`已屏蔽等你来答问题 [${matchedKeyword}]：${normalizeBlockKeywordText(title.textContent)}`);
        if (!waitingQuestionVisibility.has(card)) {
            waitingQuestionVisibility.set(card, { hidden: card.hidden, display: card.style.getPropertyValue('display'), priority: card.style.getPropertyPriority('display') });
        }
        card.dataset[blockedMarker] = 'true';
        card.hidden = true;
        card.style.display = 'none';
    } else if (card.dataset[blockedMarker]) {
        delete card.dataset[blockedMarker];
        const original = waitingQuestionVisibility.get(card);
        card.hidden = original ? original.hidden : false;
        if (original && original.display) card.style.setProperty('display', original.display, original.priority);
        else card.style.removeProperty('display');
        waitingQuestionVisibility.delete(card);
    }
    return matchedKeyword;
}

// 读取当前选中的文字，兼容输入框和普通页面选区
function getSelectedBlockKeywordText() {
    let text = '';
    const activeElement = document.activeElement;
    if (activeElement && ((activeElement.tagName === 'TEXTAREA') || (activeElement.tagName === 'INPUT' && /^(?:text|search|url|tel|password)$/i.test(activeElement.type))) && typeof activeElement.selectionStart === 'number') {
        text = activeElement.value.slice(activeElement.selectionStart, activeElement.selectionEnd);
    }
    if (!text && window.getSelection) {
        text = window.getSelection().toString();
    }
    return normalizeBlockKeywordText(text);
}

// 记录最近一次选中的文字，供右键脚本菜单 [添加选中文字到屏蔽词] 使用
function rememberSelectedBlockKeyword() {
    const updateSelectedBlockKeyword = function() {
        selectedTextForBlockKeywords = getSelectedBlockKeywordText();
    }
    document.addEventListener('selectionchange', updateSelectedBlockKeyword);
    document.addEventListener('contextmenu', updateSelectedBlockKeyword, true);
    window.addEventListener('urlchange', function(){selectedTextForBlockKeywords = '';});
}

// 将当前选中的文字直接加入 [自定义屏蔽关键词] 列表
function addSelectedKeywordToBlocklist() {
    if (!menu_value('menu_blockKeywords')) {
        GM_notification({text: '请先开启 [屏蔽指定关键词] 功能~', timeout: 3000});
        return
    }

    const keyword = getSelectedBlockKeywordText() || selectedTextForBlockKeywords;
    if (!keyword) {
        GM_notification({text: '未检测到选中的文字，请先选中内容后再使用该菜单~', timeout: 3000});
        return
    }

    let keywords = GM_getValue('menu_customBlockKeywords') || [];
    if (keywords.some(function(item){return item.toLowerCase() === keyword.toLowerCase();})) {
        GM_notification({text: `屏蔽词 [${keyword}] 已存在，无需重复添加~`, timeout: 3000});
        return
    }

    keywords.push(keyword);
    GM_setValue('menu_customBlockKeywords', keywords);
    registerMenuCommand(); // 同步刷新缓存的菜单值
    GM_notification({text: `已添加屏蔽词 [${keyword}]\n后续加载的标题/评论会按该关键词过滤~`, timeout: 4000});
}


// 自定义屏蔽关键词（标题）
function customBlockKeywords() {
    let nowBlockKeywords = '';
    menu_value('menu_customBlockKeywords').forEach(function(item){nowBlockKeywords += '|' + item})
    let newBlockKeywords = prompt('编辑 [自定义屏蔽关键词]\n（不同关键词之间使用 "|" 分隔，例如：关键词A|关键词B|关键词C \n（关键词不区分大小写，支持表情如：[捂脸]|[飙泪笑]', nowBlockKeywords.replace('|',''));
    if (newBlockKeywords === '') {
        GM_setValue('menu_customBlockKeywords', []);
        registerMenuCommand(); // 重新注册脚本菜单
    } else if (newBlockKeywords != null) {
        GM_setValue('menu_customBlockKeywords', newBlockKeywords.split('|'));
        registerMenuCommand(); // 重新注册脚本菜单
    }
};


// 屏蔽指定关键词
function blockKeywords(type) {
    if (!menu_value('menu_blockKeywords')) return
    // 空词表仍安装监听，添加首词后新加载的内容才能立即生效。
    switch(type) {
        case 'index':
            blockKeywords_('.Card.TopstoryItem.TopstoryItem-isRecommend');
            break;
        case 'follow':
            blockKeywords_('.Card.TopstoryItem.TopstoryItem-isFollow');
            break;
        case 'topic':
            blockKeywords_('.List-item.TopicFeedItem');
            break;
        case 'people':
            blockKeywords_('.List-item');
            break;
        case 'collection':
            blockKeywords_('.Card.CollectionDetailPageItem');
            break;
        case 'search':
            blockKeywords_search();
            break;
        case 'comment':
            if (!menu_value('menu_blockKeywordsComment')) return // 如果 [屏蔽关键词 - 评论区] 未启用则跳过
            blockKeywords_comment();
            break;
        case 'waiting':
            blockKeywords_waiting();
            break;
    }


    function blockKeywords_(className1) {
        function selectors() {
            return location.pathname === '/hot'
                ? ['.HotItem', 'h2.HotItem-title']
                : [className1, 'h2.ContentItem-title meta[itemprop="name"], meta[itemprop="headline"]'];
        }
        function blockKeywords_now() {
            const [cards, title] = selectors();
            document.querySelectorAll(cards).forEach(function(card){blockKeywords_1(card, title);});
        }
        blockKeywords_now();
        window.addEventListener('urlchange', function(){setTimeout(blockKeywords_now, 1000);});
        const observer = new MutationObserver(function(mutationsList) {
            const [selector, title] = selectors();
            const cards = new Set();
            for (const mutation of mutationsList) {
                for (const target of mutation.addedNodes) {
                    if (target.nodeType != 1) continue
                    if (target.matches(selector)) cards.add(target);
                    target.querySelectorAll(selector).forEach(function(card){cards.add(card);});
                }
            }
            cards.forEach(function(card){blockKeywords_1(card, title);});
        });
        observer.observe(document, { childList: true, subtree: true });
    }

    function blockKeywords_search() {
        const selector = '.HotLanding-contentItem, .Card.SearchResult-Card[data-za-detail-view-path-module="AnswerItem"], .Card.SearchResult-Card[data-za-detail-view-path-module="PostItem"]';
        function blockKeywords_now() {
            if (location.search.indexOf('type=content') === -1) return
            document.querySelectorAll(selector).forEach(function(card){blockKeywords_1(card, 'a[data-za-detail-view-id]');});
        }
        setTimeout(blockKeywords_now, 2000);
        window.addEventListener('urlchange', function(){setTimeout(blockKeywords_now, 1000);});
        const observer = new MutationObserver(function(mutationsList) {
            if (location.search.indexOf('type=content') === -1) return
            const cards = new Set();
            for (const mutation of mutationsList) {
                for (const target of mutation.addedNodes) {
                    if (target.nodeType != 1) continue
                    if (target.matches(selector)) cards.add(target);
                    target.querySelectorAll(selector).forEach(function(card){cards.add(card);});
                }
            }
            cards.forEach(function(card){blockKeywords_1(card, 'a[data-za-detail-view-id]');});
        });
        observer.observe(document, { childList: true, subtree: true });
    }


    function blockKeywords_comment() {
        function filterComment(comment) {
            let content = comment.querySelector('.CommentContent'); // 寻找评论文字所在元素
            if (!menu_value('menu_blockKeywords') || !menu_value('menu_blockKeywordsComment') || !content || content.dataset.text !== undefined) return
            let text = content.textContent.toLowerCase(); // 全部转为小写（用来不区分大小写）
            content.querySelectorAll('img.sticker[alt]').forEach((img)=>{text += img.alt}) // 将评论中的表情添加到待遍历的评论文字中

            if (getMatchedBlockKeyword(text, menu_value('menu_customBlockKeywords')) !== null) {
                console.log('已屏蔽评论：' + text);
                content.dataset.text = content.innerHTML;
                content.onclick = (e)=>{if (e.target.dataset.text) {e.target.innerHTML = e.target.dataset.text;e.target.removeAttribute('data-text');}};
                content.textContent = '[该评论已屏蔽，可点击显示]';
            }
        }

        const callback = (mutationsList, observer) => {
            for (const mutation of mutationsList) {
                for (const target of mutation.addedNodes) {
                    if (target.nodeType != 1) continue
                    //console.log(target);
                    if (target.tagName == 'DIV' && target.className.indexOf('css-') == 0 && target.dataset.id == undefined) {
                        let item = target.querySelector('a[href^="https://www.zhihu.com/people/"]>img.Avatar[alt][loading]')
                        if (item) {
                            //console.log(item)
                            filterComment(item.parentElement.parentElement.parentElement.parentElement)
                        }
                    }

                    /*if (target.tagName == 'DIV' && target.dataset.id !== undefined) {
                        console.log(target);
                        for (const node of target.querySelectorAll('*')) {
                            if (node.className === 'CommentItemV2-metaSibling') filterComment(node);
                        }
                    }*/
                }
            }
        };
        const observer = new MutationObserver(callback);
        observer.observe(document, { childList: true, subtree: true });
    }


    function blockKeywords_waiting() {
        let questionsContainer = null;
        let questionsRoot = null;
        let questionsObserver = null;
        let discoveryObserver = null;
        let rootObserver = null;

        function shouldFilterQuestions() {
            return menu_value('menu_blockKeywords') && isWaitingQuestionView(location.pathname);
        }

        function filterQuestionCard(card) {
            filterWaitingQuestionCard(card, menu_value('menu_customBlockKeywords') || [], shouldFilterQuestions());
        }

        function filterQuestionCards(container) {
            Array.from(container.children).filter(function(card) {
                return card.classList.contains('jsNavigable');
            }).forEach(filterQuestionCard);
        }

        function collectAffectedCards(target, cards, includeDescendants = true) {
            if (target.nodeType !== 1) target = target.parentElement;
            if (!target || !questionsContainer) return
            const parentCard = target.closest('.jsNavigable');
            if (parentCard && parentCard.parentElement === questionsContainer) cards.add(parentCard);
            if (!includeDescendants) return
            target.querySelectorAll('.jsNavigable').forEach(function(card) {
                if (card.parentElement === questionsContainer) cards.add(card);
            });
        }

        function findQuestionsContainer(target) {
            // MutationRecord 保留曾经添加的节点；同批重挂后它可能已经脱离文档。
            if (target.nodeType !== 1 || !document.contains(target)) return null
            if (target.matches('.QuestionWaiting-questions[role="list"]')) return target
            return target.querySelector('.QuestionWaiting-questions[role="list"]');
        }

        function handleQuestionsMutations(mutationsList) {
            // 旧根可留在页面上，先按批次最终 DOM 检查列表是否已移除或迁入另一根。
            if (questionsContainer && !document.contains(questionsContainer)) {
                discoverQuestionsContainer();
                return
            }
            if (questionsContainer && (questionsContainer.closest('.QuestionWaiting') || questionsContainer) !== questionsRoot) {
                connectQuestionsContainer(questionsContainer);
                return
            }
            const affectedCards = new Set();
            for (const mutation of mutationsList) {
                collectAffectedCards(mutation.target, affectedCards, false);
                for (const target of mutation.addedNodes || []) {
                    const nextContainer = findQuestionsContainer(target);
                    if (nextContainer && nextContainer !== questionsContainer) {
                        connectQuestionsContainer(nextContainer);
                        return
                    }
                    collectAffectedCards(target, affectedCards);
                }
            }
            affectedCards.forEach(filterQuestionCard);
        }

        function disconnectQuestionsObservers() {
            if (questionsObserver) questionsObserver.disconnect();
            if (discoveryObserver) discoveryObserver.disconnect();
            if (rootObserver) rootObserver.disconnect();
            rootObserver = null;
            questionsObserver = null;
            discoveryObserver = null;
        }

        function watchRootRemoval(root) {
            if (rootObserver) rootObserver.disconnect();
            // 发现阶段也需要监听祖先移除，防止列表出现前空根已被重挂。
            rootObserver = new MutationObserver(function(mutationsList) {
                if (mutationsList.some(function(mutation) {
                    return Array.from(mutation.removedNodes).some(function(node){return node === root || (node.nodeType === 1 && node.contains(root));});
                })) {
                    discoverQuestionsContainer();
                    return
                }
                if (questionsContainer) return
                // 列表也可能随祖先的直接新增子树到达，不扩大为 body 全子树观察。
                for (const mutation of mutationsList) {
                    for (const target of mutation.addedNodes) {
                        const discoveredContainer = findQuestionsContainer(target);
                        if (discoveredContainer) {
                            connectQuestionsContainer(discoveredContainer);
                            return
                        }
                    }
                }
            });
            for (let parent = root.parentElement; parent; parent = parent.parentElement) {
                rootObserver.observe(parent, { childList: true });
            }
        }

        function connectQuestionsContainer(nextContainer) {
            if (!nextContainer || !document.contains(nextContainer)) return
            const containerChanged = nextContainer !== questionsContainer;
            if (discoveryObserver) discoveryObserver.disconnect();
            discoveryObserver = null;

            const nextRoot = nextContainer.closest('.QuestionWaiting') || nextContainer;
            const rootChanged = nextRoot !== questionsRoot;
            if (rootChanged) {
                if (questionsObserver) questionsObserver.disconnect();
                questionsRoot = nextRoot;
                questionsObserver = new MutationObserver(handleQuestionsMutations);
                questionsObserver.observe(questionsRoot, { childList: true, subtree: true, characterData: true });
            }
            // 列表或根可以被复用，祖先链仍需按当前位置重新订阅。
            watchRootRemoval(nextRoot);
            questionsContainer = nextContainer;
            if (containerChanged || rootChanged) filterQuestionCards(questionsContainer);
        }

        function discoverQuestionsContainer() {
            if (location.pathname !== '/question/waiting') {
                if (questionsContainer) filterQuestionCards(questionsContainer);
                disconnectQuestionsObservers();
                questionsContainer = null;
                questionsRoot = null;
                return
            }

            const nextContainer = document.querySelector('.QuestionWaiting-questions[role="list"]');
            if (nextContainer) {
                connectQuestionsContainer(nextContainer);
                return
            }

            disconnectQuestionsObservers();
            questionsContainer = null;
            questionsRoot = null;
            const discoveryRoot = document.querySelector('.App-main') || document.querySelector('.QuestionWaiting') || document.body || document.documentElement;
            if (!discoveryRoot) return
            discoveryObserver = new MutationObserver(function(mutationsList) {
                for (const mutation of mutationsList) {
                    for (const target of mutation.addedNodes) {
                        // 找到主区域后缩小发现范围，不持续观察 body 的整个子树。
                        if (discoveryRoot === document.body && document.querySelector('.App-main')) {
                            discoverQuestionsContainer();
                            return
                        }
                        const discoveredContainer = findQuestionsContainer(target);
                        if (discoveredContainer) {
                            connectQuestionsContainer(discoveredContainer);
                            return
                        }
                    }
                }
            });
            discoveryObserver.observe(discoveryRoot, { childList: true, subtree: true });
            watchRootRemoval(discoveryRoot);
        }

        discoverQuestionsContainer();
        window.addEventListener('urlchange', discoverQuestionsContainer);
    }

    function blockKeywords_1(item1, css) {
        if (!menu_value('menu_blockKeywords')) return
        const item = item1.querySelector(css);
        if (!item) return
        const text = item.content || item.textContent;
        if (getMatchedBlockKeyword(text, menu_value('menu_customBlockKeywords')) !== null) {
            console.log('已屏蔽：' + text);
            item1.hidden = true;
            item1.style.display = 'none';
        }
    }
}


// 有界等待首批元素；后续动态内容仍交给各功能现有的 MutationObserver
function processElementsWhenAvailable(selector, processElements, intervalMs = 100, maxAttempts = 50) {
    let attempts = 0;
    const timer = setInterval(function() {
        attempts += 1;
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
            clearInterval(timer);
            processElements(elements);
        } else if (attempts >= maxAttempts) {
            clearInterval(timer);
        }
    }, intervalMs);
    return timer;
}


// 屏蔽指定类别（视频/文章等）
function blockType(type) {
    let name;
    // 一开始加载的信息流 + 添加标签样式
    if (type === 'search') { // 搜索页
        if (!menu_value('menu_blockTypeVideo') && !menu_value('menu_blockTypeArticle') && !menu_value('menu_blockTypePin') && !menu_value('menu_blockTypeTopic') && !menu_value('menu_blockTypeSearch')) return
        if (menu_value('menu_blockTypeSearch') && location.pathname === '/search') setTimeout(function(){document.querySelectorAll('.RelevantQuery').forEach((r)=>{r.parentElement.parentElement.hidden = true});}, 2000)
        name = 'h2.ContentItem-title a:not(.zhihu_e_toQuestion), a.KfeCollection-PcCollegeCard-link, h2.SearchTopicHeader-Title a'
        addSetInterval_(name);
    } else if (type === 'question') { // 问题页
        if (!menu_value('menu_blockTypeVideo')) return
        appendStyle(`.VideoAnswerPlayer, .VideoAnswerPlayer video, .VideoAnswerPlayer-video, .VideoAnswerPlayer-iframe {display: none !important;}`);
        name = '.VideoAnswerPlayer'
        document.querySelectorAll(name).forEach(function(item){blockType_(item);})
    } else if (type === 'follow') { // 首页 - 关注
        if (!menu_value('menu_blockTypeFollowAgree') && !menu_value('menu_blockTypeFollowQuestion')) return
        if (menu_value('menu_blockTypeFollowAgree')) name = '.TopstoryItem-isFollow .FeedSource-byline' // 赞同了XX
        if (menu_value('menu_blockTypeFollowQuestion')) {if (name) {name += ',.ContentItem[data-za-detail-view-path-module=QuestionItem]:not(.AnswerItem):not(.PinItem)'} else {name = '.ContentItem[data-za-detail-view-path-module=QuestionItem]:not(.AnswerItem):not(.PinItem)'}} // 关注了XX
        if (!name) return
        document.querySelectorAll(name).forEach(function(item){blockType_(item);})
    } else { // 首页
        if (!menu_value('menu_blockTypeVideo') && !menu_value('menu_blockTypeArticle') && !menu_value('menu_blockTypePin')) return
        if (menu_value('menu_blockTypeVideo')) appendStyle(`.Card .ZVideoItem-video, .VideoAnswerPlayer video, nav.TopstoryTabs > a[aria-controls="Topstory-zvideo"] {display: none !important;}`);
        name = 'h2.ContentItem-title a:not(.zhihu_e_toQuestion)'
        if (menu_value('menu_blockTypePin')) name = 'h2.ContentItem-title a:not(.zhihu_e_toQuestion), .ContentItem.PinItem'
        document.querySelectorAll(name).forEach(function(item){blockType_(item);})
    }

    // 后续加载的信息流
    const observer = new MutationObserver(mutationsList => {
        for (const mutation of mutationsList) {
            for (const target of mutation.addedNodes) {
                if (target.nodeType != 1) continue
                if (target.className === "Card SearchResult-Card" && target.dataset.zaDetailViewPathModule === undefined) {
                    // 移除相关搜索
                    if (menu_value('menu_blockTypeSearch') && location.pathname === '/search' && location.search.indexOf('type=content') > -1) target.hidden = true;
                } else {
                    if (target.matches(name)) blockType_(target);
                    target.querySelectorAll(name).forEach(blockType_);
                }
            }
        }
    });
    observer.observe(document, { childList: true, subtree: true });

    window.addEventListener('urlchange', function(){
        addSetInterval_(name);
        // 移除相关搜索
        if (menu_value('menu_blockTypeSearch') && location.pathname === '/search' && location.search.indexOf('type=content') > -1) setTimeout(function(){document.querySelectorAll('.RelevantQuery').forEach((r)=>{r.parentElement.parentElement.hidden = true});}, 1500)
    })

    function hideParentCard(titleA, className) {
        const card = findParentElement(titleA, className);
        if (card) card.hidden = true;
        return card;
    }

    function blockType_(titleA) {
        if (!titleA) return // 判断是否为真
        //console.log(titleA.href)
        if (location.pathname === '/search') { // 搜索页
            if (location.search.indexOf('type=content') === -1) return //   仅限搜索页的 [综合]
            if (titleA.href.indexOf('/zvideo/') > -1 || titleA.href.indexOf('video.zhihu.com') > -1) { // 如果是视频
                const card = findParentElement(titleA, 'Card');
                if (menu_value('menu_blockTypeVideo') && card) card.remove();
            } else if (titleA.href.indexOf('zhuanlan.zhihu.com') > -1) { // 如果是文章
                if (menu_value('menu_blockTypeArticle')) hideParentCard(titleA, 'Card SearchResult-Card');
            } else if (titleA.href.indexOf('/topic/') > -1) { //            如果是话题
                if (menu_value('menu_blockTypeTopic')) hideParentCard(titleA, 'Card SearchResult-Card');
            } else if (titleA.href.indexOf('/market/') > -1) { //           如果是杂志文章等乱七八糟的
                if (menu_value('menu_blockTypeSearch')) hideParentCard(titleA, 'Card SearchResult-Card');
            }
        } else if (location.pathname.indexOf('/question/') > -1) { // 问题页
            if (menu_value('menu_blockTypeVideo')) hideParentCard(titleA, 'List-item');
        } else if (location.pathname.indexOf('/follow') > -1) { // 首页 - 关注
            if (type === 'follow') {
                if ((menu_value('menu_blockTypeFollowAgree') && titleA.className.indexOf('FeedSource-byline') != -1) || (menu_value('menu_blockTypeFollowQuestion') && titleA.dataset.zaDetailViewPathModule == 'QuestionItem')) hideParentCard(titleA, 'Card TopstoryItem TopstoryItem-isFollow'); // 赞同了XX + 关注了XX
            }
            if (titleA.className == 'ContentItem PinItem' && menu_value('menu_blockTypePin')) hideParentCard(titleA, 'Card TopstoryItem TopstoryItem-isFollow'); // 如果是想法
        } else { // 首页
            if (titleA.className == 'ContentItem PinItem') { // 如果是想法（针对无标题）
                if (menu_value('menu_blockTypePin')) hideParentCard(titleA, 'Card TopstoryItem TopstoryItem-isRecommend');
            /*} else if (titleA.href.indexOf('/pin/') > -1) { // 如果是想法
                if (menu_value('menu_blockTypePin')) findParentElement(titleA, 'Card TopstoryItem TopstoryItem-isRecommend').hidden = true;*/
            } else if (titleA.href.indexOf('/zvideo/') > -1 || titleA.href.indexOf('video.zhihu.com') > -1) { // 如果是视频
                if (menu_value('menu_blockTypeVideo')) hideParentCard(titleA, 'Card TopstoryItem TopstoryItem-isRecommend');
            } else if (titleA.href.indexOf('/answer/') > -1) { //           如果是问题（视频回答）
                const answer = findParentElement(titleA, 'ContentItem AnswerItem');
                if (answer && answer.querySelector('.VideoAnswerPlayer')) {
                    if (menu_value('menu_blockTypeVideo') && hideParentCard(titleA, 'Card TopstoryItem TopstoryItem-isRecommend')) answer.remove();
                }
            } else if (titleA.href.indexOf('/education/video-course/') > -1) { // 如果是视频课程
                if (menu_value('menu_blockTypeVideo')) hideParentCard(titleA, 'Card TopstoryItem TopstoryItem-isRecommend');
            } else if (titleA.href.indexOf('zhuanlan.zhihu.com') > -1) { // 如果是文章
                if (menu_value('menu_blockTypeArticle')) hideParentCard(titleA, 'Card TopstoryItem TopstoryItem-isRecommend');
            }
        }
    }

    function addSetInterval_(A) {
        processElementsWhenAvailable(A, function(aTag){aTag.forEach(function(item){blockType_(item);})});
    }
}


// 寻找父元素
function findParentElement(item, className, type = false) {
    if (item.parentElement) {
        //console.log(item.parentElement)
        if (type) { // true = 完全一致，false = 包含即可
            if (item.parentElement.className && item.parentElement.className === className) {
                //console.log(item.parentElement.className)
                return item.parentElement;
            } else {
                let temp = findParentElement(item.parentElement, className, true)
                if (temp) return temp
            }
        } else {
            if (item.parentElement.className && item.parentElement.className.indexOf(className) > -1) {
                return item.parentElement;
            } else {
                let temp = findParentElement(item.parentElement, className)
                if (temp) return temp
            }
        }
    }
    return
}


// 移除高亮链接
function cleanHighlightLink() {
    if (!menu_value('menu_cleanHighlightLink')) return;
    const selector = 'span > a[data-za-not-track-link][href^="https://zhida.zhihu.com/search?"]';
    function cleanLink(link) {
        if (link.parentElement) link.replaceWith(link.textContent);
    }
    const callback = (mutationsList, observer) => {
        for (const mutation of mutationsList) {
            for (const target of mutation.addedNodes) {
                if (target.nodeType != 1) continue
                if (target.matches(selector)) cleanLink(target);
                target.querySelectorAll(selector).forEach(cleanLink);
            }
        }
    };
    const observer = new MutationObserver(callback);
    observer.observe(document, { childList: true, subtree: true });

    // 针对的是打开网页后直接加载的前面几个回答（上面哪些是针对动态加载的回答）
    document.querySelectorAll(selector).forEach(cleanLink);
}


// 屏蔽盐选内容
function blockYanXuan() {
    if (!menu_value('menu_blockYanXuan')) return
    const blockYanXuan_question = (mutationsList, observer) => {
        for (const mutation of mutationsList) {
            for (const target of mutation.addedNodes) {
                if (target.nodeType != 1) continue
                if (target.className === 'List-item' || target.className === 'Card AnswerCard') {
                    if (target.querySelector('.KfeCollection-AnswerTopCard-Container, .KfeCollection-PurchaseBtn')) {
                        target.hidden = true;
                    }
                }
            }
        }
    };

    const blockYanXuan_question_answer = (mutationsList, observer) => {
        for (const mutation of mutationsList) {
            for (const target of mutation.addedNodes) {
                if (target.nodeType != 1) continue
                target.querySelectorAll('.List-item, .Card.AnswerCard').forEach(function(item){
                    if (item.querySelector('.KfeCollection-AnswerTopCard-Container, .KfeCollection-PurchaseBtn')) {
                        item.hidden = true;
                    }
                })
            }
        }
    };

    if (location.pathname.indexOf('/answer/') > -1) { // 回答页（就是只有三个回答的页面）
        const observer = new MutationObserver(blockYanXuan_question_answer);
        observer.observe(document, { childList: true, subtree: true });
    } else { // 问题页（可以显示所有回答的页面）
        const observer = new MutationObserver(blockYanXuan_question);
        observer.observe(document, { childList: true, subtree: true });
    }

    // 针对的是打开网页后直接加载的前面几个回答（上面哪些是针对动态加载的回答）
    document.querySelectorAll('.List-item, .Card.AnswerCard').forEach(function(item){
        if (item.querySelector('.KfeCollection-AnswerTopCard-Container, .KfeCollection-PurchaseBtn')) {
            item.hidden = true;
        }
    })
}


// 区分问题文章
function addTypeTips() {
    if (!menu_value('menu_typeTips')) return
    let style = `font-weight: bold;font-size: 13px;padding: 1px 4px 0;border-radius: 2px;display: inline-block;vertical-align: top;margin: ${(location.pathname === '/search') ? '2' : '4'}px 4px 0 0;`
    appendStyle(`/* 区分问题文章 */
.AnswerItem .ContentItem-title a:not(.zhihu_e_toQuestion)::before {content:'问题';color: #f68b83;background-color: #f68b8333;${style}}
/* 针对的是部分搜索词下搜索页开头的 "最新讨论" 之类的非常规元素 */
.HotLanding-contentItem .ContentItem[data-za-detail-view-path-module=Content] .ContentItem-title a:not(.zhihu_e_toQuestion)::before {content:'问题';color: #f68b83;background-color: #f68b8333;${style}}
.TopstoryQuestionAskItem .ContentItem-title a:not(.zhihu_e_toQuestion)::before {content:'问题';color: #ff5a4e;background-color: #ff5a4e33;${style}}
.ZVideoItem .ContentItem-title a::before, .ZvideoItem .ContentItem-title a::before {content:'视频';color: #00BCD4;background-color: #00BCD433;${style}}
.PinItem .ContentItem-title a::before {content:'想法';color: #4CAF50;background-color: #4CAF5033;${style}}
.ArticleItem .ContentItem-title a::before {content:'文章';color: #2196F3;background-color: #2196F333;${style}}`, document.body);
}


// 直达问题按钮
function addToQuestion() {
    if (!menu_value('menu_toQuestion')) return

    // 一开始加载的信息流 + 添加按钮样式
    if (location.pathname === '/search') {
        appendStyle(`a.zhihu_e_toQuestion {font-size: 13px !important;font-weight: normal !important;padding: 1px 6px 0 !important;border-radius: 2px !important;display: inline-block !important;vertical-align: top !important;height: 20.67px !important;line-height: 20.67px !important;margin-top: 2px !important;}`);
        addSetInterval_('h2.ContentItem-title a:not(.zhihu_e_tips)');
    } else {
        appendStyle(`a.zhihu_e_toQuestion {font-size: 13px !important;font-weight: normal !important;padding: 1px 6px 0 !important;border-radius: 2px !important;display: inline-block !important;vertical-align: top !important;margin-top: 4px !important;}`);
        document.querySelectorAll('h2.ContentItem-title a:not(.zhihu_e_tips)').forEach(function(item){addTypeTips_(item);})
    }

    // 后续加载的信息流
    const observer = new MutationObserver(mutationsList => {
        for (const mutation of mutationsList) {
            for (const target of mutation.addedNodes) {
                if (target.nodeType != 1) continue
                if (target.matches('h2.ContentItem-title a:not(.zhihu_e_tips)')) addTypeTips_(target);
                target.querySelectorAll('h2.ContentItem-title a:not(.zhihu_e_tips)').forEach(addTypeTips_);
            }
        }
    });
    observer.observe(document, { childList: true, subtree: true });

    window.addEventListener('urlchange', function(){
        addSetInterval_('h2.ContentItem-title a:not(.zhihu_e_tips)');
    })

    function addTypeTips_(titleA) {
        if (!titleA) return // 判断是否为真
        if (titleA.parentElement.querySelector('a.zhihu_e_toQuestion')) return // 判断是否已添加
        if (titleA.textContent.indexOf('?') != -1) { // 把问题末尾英文问好 [?] 的替换为中文问好 [？]，这样按钮与标题之间的间距就刚刚好~
            titleA.innerHTML = titleA.innerHTML.replace('?', "？")
        }
        if (/answer\/\d+/.test(titleA.href)) { //  如果是指向回答的问题（而非指向纯问题的链接）
            const titleA_meta = titleA.parentElement.parentElement.querySelector('meta[itemprop="url"]'); // 获取该问题页地址
            if (!titleA_meta) return // 判断元素是否存在（针对的是部分搜索词下搜索页开头的 "最新讨论" 之类的非常规元素）
            titleA.insertAdjacentHTML('afterend', `<a class="zhihu_e_toQuestion VoteButton" href="${titleA_meta.content}" target="_blank">直达问题</a>`);
        }
    }

    function addSetInterval_(A) {
        processElementsWhenAvailable(A, function(aTag){aTag.forEach(function(item){addTypeTips_(item);})});
    }
}


// 展开问题描述
function questionRichTextMore() {
    if (!menu_value('menu_questionRichTextMore')) return
    let button = document.querySelector('button.QuestionRichText-more');
    if (button) button.click()
}

// 移除登录弹窗
function removeLogin() {
    const removeLoginModal = (mutationsList, observer) => {
        for (const mutation of mutationsList) {
            for (const target of mutation.addedNodes) {
                if (target.nodeType != 1) continue
                if (target.matches('.signFlowModal') || target.querySelector('.signFlowModal')) {
                    let button = target.querySelector('.Button.Modal-closeButton.Button--plain');
                    if (button) button.click();
                } else if (getXpath('self::button[text()="立即登录/注册"] | .//button[text()="立即登录/注册"]', target)) {
                    target.remove();
                }
            }
        }
    };

    // 未登录时才会监听并移除登录弹窗
    if(location.hostname === 'zhuanlan.zhihu.com') { // 如果是文章页
        if (!document.querySelector('.ColumnPageHeader-profile>.AppHeader-menu')) { // 未登录
            const observer = new MutationObserver(removeLoginModal);
            observer.observe(document, { childList: true, subtree: true });
            if (getXpath('//button[text()="登录/注册"]')) getXpath('//button[text()="登录/注册"]').outerHTML = '<a class="Button AppHeader-login Button--blue" href="https://www.zhihu.com/signin" target="_blank">登录/注册</a>'; // [登录] 按钮跳转至登录页面
        }
    } else { // 不是文章页
        if (!document.querySelector('.AppHeader-profile>.AppHeader-menu')) { // 未登录
            const observer = new MutationObserver(removeLoginModal);
            observer.observe(document, { childList: true, subtree: true });
            appendStyle('.Question-mainColumnLogin, button.AppHeader-login {display: none !important;}'); // 屏蔽问题页中间的登录提示
            if (getXpath('//button[text()="登录/注册"]')) getXpath('//button[text()="登录/注册"]').outerHTML = '<a class="Button AppHeader-login Button--blue" href="https://www.zhihu.com/signin" target="_blank">登录/注册</a>'; // [登录] 按钮跳转至登录页面
        }
    }
}

// 净化标题消息
function cleanTitles() {
    if (!menu_value('menu_cleanTitles')) return

    // 方案一
    const elTitle = document.head.querySelector('title');
    if (!elTitle) return
    const original = elTitle.textContent;
    const observer = new MutationObserver(function() {
        if (elTitle.textContent != original) { // 避免重复执行
            elTitle.textContent = original;
        }
    });
    observer.observe(elTitle, { childList: true });

    // 方案二
    // if (Reflect.getOwnPropertyDescriptor(document, 'title')) {
    //     const elTitle = document.head.querySelector('title');
    //     const original = elTitle.textContent;
    //     const observer = new MutationObserver(function() {
    //         if (elTitle.textContent != original) { // 避免重复执行
    //             elTitle.textContent = original;
    //         }
    //     });
    //     observer.observe(elTitle, { childList: true });
    // } else {
    //     const title = document.title;
    //     Reflect.defineProperty(document, 'title', {
    //         set: () => {},
    //         get: () => title,
    //     });
    // }
}


// 净化搜索热门
function cleanSearch() {
    if (!menu_value('menu_cleanSearch')) return

    const el = document.querySelector('.SearchBar-input > input');
    if (!el) return
    const observer = new MutationObserver((mutationsList, observer) => {
        if (mutationsList[0].attributeName === 'placeholder' && mutationsList[0].target.placeholder != '') mutationsList[0].target.placeholder = '';
    });
    el.placeholder = '';
    observer.observe(el, { attributes: true });
    appendStyle('.AutoComplete-group > .SearchBar-label:not(.SearchBar-label--history), .AutoComplete-group > [id^="AutoComplete2-topSearch-"], .AutoComplete-group > [id^="AutoComplete3-topSearch-"] {display: none !important;}');
}


// 快捷关闭悬浮评论（监听点击事件，点击网页两侧空白处）
function closeFloatingComments() {
    const closeFloatingCommentsModal = (mutationsList, observer) => {
        for (const mutation of mutationsList) {
            for (const target of mutation.addedNodes) {
                if (target.nodeType != 1) continue
                let button = document.querySelector('button[aria-label="关闭"]');
                if (button) {button.parentElement.parentElement.onclick = function(event){if (event.target.parentElement == this) {button.click();}}}
                return // 同一批次共用当前弹层，避免每个新增元素都全页查询
            }
        }
    };
    const observer = new MutationObserver(closeFloatingCommentsModal);
    observer.observe(document, { childList: true, subtree: true });
}


// 监听 XMLHttpRequest 事件
/*function EventXMLHttpRequest() {
    var _send = window.XMLHttpRequest.prototype.send
    function sendReplacement(data) {
        addTypeTips();
        return _send.apply(this, arguments);
    }
    window.XMLHttpRequest.prototype.send = sendReplacement;
}*/


// 自定义 urlchange 事件（用来监听 URL 变化）
function addUrlChangeEvent() {
    history.pushState = ( f => function pushState(){
        var ret = f.apply(this, arguments);
        window.dispatchEvent(new Event('pushstate'));
        window.dispatchEvent(new Event('urlchange'));
        return ret;
    })(history.pushState);

    history.replaceState = ( f => function replaceState(){
        var ret = f.apply(this, arguments);
        window.dispatchEvent(new Event('replacestate'));
        window.dispatchEvent(new Event('urlchange'));
        return ret;
    })(history.replaceState);

    window.addEventListener('popstate',()=>{
        window.dispatchEvent(new Event('urlchange'))
    });
}


function getXpath(xpath, contextNode, doc = document) {
    contextNode = contextNode || doc;
    try {
        const result = doc.evaluate(xpath, contextNode, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        // 应该总是返回一个元素节点
        return result.singleNodeValue && result.singleNodeValue.nodeType === 1 && result.singleNodeValue;
    } catch (err) {
        throw new Error(`无效 Xpath: ${xpath}`);
    }
}


// 显示问题作者
function question_author() {
    if (document.querySelector('.BrandQuestionSymbol, .QuestionAuthor, .SpecialQuestionAuthor')) return
    const initialData = document.querySelector('#js-initialData');
    const topics = document.querySelector('.QuestionHeader-topics');
    const questionId = /^\/question\/(\d+)(?:\/|$)/.exec(location.pathname);
    if (!initialData || !topics || !questionId) return
    const author = JSON.parse(initialData.textContent).initialState?.entities?.questions?.[questionId[1]]?.author;
    if (!author) return
    const container = document.createElement('div');
    container.className = 'BrandQuestionSymbol';
    const link = container.appendChild(document.createElement('a'));
    link.className = 'BrandQuestionSymbol-brandLink';
    link.href = '/people/' + encodeURIComponent(author.urlToken || '');
    const avatar = link.appendChild(document.createElement('img'));
    avatar.setAttribute('role', 'presentation');
    if (typeof author.avatarUrl === 'string' && author.avatarUrl.trim() !== '') {
        try {
            const avatarUrl = new URL(author.avatarUrl, location.href);
            if (avatarUrl.protocol === 'http:' || avatarUrl.protocol === 'https:') avatar.src = avatarUrl.href;
        } catch (error) {
            // 畸形头像保持为空，不将页面数据退回 HTML 拼接。
        }
    }
    avatar.className = 'BrandQuestionSymbol-logo';
    avatar.alt = '';
    const name = link.appendChild(document.createElement('span'));
    name.className = 'BrandQuestionSymbol-name';
    name.textContent = author.name || '';
    const divider = container.appendChild(document.createElement('div'));
    divider.className = 'BrandQuestionSymbol-divider';
    divider.style.cssText = 'margin-left: 5px;margin-right: 10px;';
    topics.insertAdjacentElement('beforebegin', container);
}

// [完整显示时间 + 置顶显示时间] 功能修改自：https://greasyfork.org/scripts/402808（从 JQuery 改为原生 JavaScript，且精简、优化了代码）
// 完整显示时间 + 置顶显示时间
function topTime_(css, classs) {
    document.querySelectorAll(css).forEach(function(_this) {
        let t = _this.querySelector('.ContentItem-time'); if (!t) return
        if (!(t.classList.contains('full')) && t.querySelector('a') && t.querySelector('a').textContent != null) {
            // 完整显示时间
            topTime_allTime(t)
            // 发布时间置顶
            topTime_publishTop(t, _this, classs)
        }
    });
}


// 完整显示时间 + 置顶显示时间 - 文章
function topTime_post() {
    let t = document.querySelector('.ContentItem-time:not(.xiu-time)'); if (!t) return
    // 完整显示时间
    if (t.textContent.indexOf('编辑于') > -1 && !(t.classList.contains('xiu-time'))) {
        let tt = t.textContent;
        t.click();
        t.textContent = (t.textContent + ' ，' + tt)
        t.classList.add('xiu-time');
    }

    // 置顶显示时间
    if (menu_value('menu_publishTop') && !(document.querySelector('.Post-Header > .ContentItem-time')) && !(document.querySelector('.ContentItem-meta > .ContentItem-time'))) {
        let temp_time = t.cloneNode(true);
        temp_time.style.padding = '0px';
        document.querySelector('.Post-Header').insertAdjacentElement('beforeEnd', temp_time);
    }
}


// 完整显示时间
function topTime_allTime(t) {
    if (t.textContent.indexOf('发布于') > -1 && t.textContent.indexOf('编辑于') == -1) {
        t.querySelector('a').textContent = (t.querySelector('a').dataset.tooltip);
        t.classList.add('full');
    } else if (t.textContent.indexOf('发布于') == -1 && t.textContent.indexOf('编辑于') > -1) {
        t.querySelector('a').textContent = (t.querySelector('a').dataset.tooltip) + ' ，' + (t.querySelector('a').textContent);
        t.classList.add('full');
    }
}


// 置顶显示时间
function topTime_publishTop(t, _this, _class) {
    if (!menu_value('menu_publishTop')) return
    if (!t.parentNode.classList.contains(_class)) {
        let temp_time = t.cloneNode(true);
        temp_time.style.padding = '0px';
        // 对于较短的回答，隐藏回答底部的时间
        if (_this.offsetHeight < 600) t.style.display = 'none';
        _this.querySelector('.' + _class).insertAdjacentElement('beforeEnd', temp_time);
    }
}


// 问题创建时间
function question_time() {
    const side = document.querySelector('.QuestionPage .QuestionHeader-side');
    const created = document.querySelector('.QuestionPage > meta[itemprop=dateCreated]');
    const modified = document.querySelector('.QuestionPage > meta[itemprop=dateModified]');
    if (!side || !created || !modified || side.querySelector('.QuestionTime-xiu')) return
    side.insertAdjacentHTML('beforeEnd', '<div class="QuestionTime-xiu" style="color: #9098ac; margin-top: 5px; font-size: 13px; font-style: italic;"><p>创建时间：' + getUTC8(new Date(created.content)) + '</p><p>最后编辑：' + getUTC8(new Date(modified.content)) + '</p></div>');
}


// UTC 标准时转 UTC+8 北京时间，修改自：https://greasyfork.org/zh-CN/scripts/402808（精简）
function getUTC8(t) {
    return (t.getFullYear() + '-' + (((t.getMonth() + 1) < 10) ? ('0' + (t.getMonth() + 1)) : (t.getMonth() + 1)) + '-' + ((t.getDate() < 10) ? ('0' + t.getDate()) : t.getDate()) + '\xa0\xa0' + ((t.getHours() < 10) ? ('0' + t.getHours()) : t.getHours()) + ':' + ((t.getMinutes() < 10) ? ('0' + t.getMinutes()) : t.getMinutes()) + ':' + ((t.getSeconds() < 10) ? ('0' + t.getSeconds()) : t.getSeconds()));
}


// 默认高清原图（无水印）
function originalPic(){
    document.querySelectorAll('img[data-original][data-original-token][data-lazy-status]:not([data-original-xiu]):not(.comment_sticker):not(.Avatar)').forEach(function(one){one.src = 'https://' + one.dataset.original.split('/')[2] + '/' + one.dataset.originalToken + '.webp'; one.dataset.originalXiu = 'true';});
}


// 默认站外直链，修改自：https://greasyfork.org/scripts/402808（从 JQuery 改为原生 JavaScript，且精简、优化了代码）
function getDirectExternalUrl(href) {
    const marker = 'link.zhihu.com/?target=';
    const markerIndex = href.indexOf(marker);
    if (markerIndex === -1) return null
    try {
        const directUrl = new URL(decodeURIComponent(href.substring(markerIndex + marker.length)));
        if (directUrl.protocol !== 'http:' && directUrl.protocol !== 'https:') return null
        return directUrl.href;
    } catch (error) {
        return null
    }
}


function directLink () {
    document.querySelectorAll('a.external[href*="link.zhihu.com/?target="], a.LinkCard[href*="link.zhihu.com/?target="]:not(.MCNLinkCard):not(.ZVideoLinkCard):not(.ADLinkCardContainer)').forEach(function (_this) {
        const directUrl = getDirectExternalUrl(_this.href);
        if (directUrl) _this.href = directUrl;
    });
}


// 默认折叠邀请，修改自：https://greasyfork.org/scripts/402808（从 JQuery 改为原生 JavaScript，且精简、优化了代码）
function questionInvitation(){
    if (!/^\/question\/\d+(?:\/answer\/\d+)?\/?$/.test(location.pathname)) return
    let attempts = 0;
    // 邀请区可能不存在；限时等待并在路由变化时清理，避免旧页面任务常驻。
    function stopWaiting() {
        clearInterval(time);
        window.removeEventListener('urlchange', stopWaiting);
    }
    const time = setInterval(function(){
        attempts += 1;
        const q = document.querySelector('.QuestionInvitation-content');
        const title = document.querySelector('.QuestionInvitation-title');
        const topbar = document.querySelector('.Topbar');
        if (!q || !title || !topbar) {
            if (attempts >= 50) stopWaiting();
            return
        }
        stopWaiting();
        q.style.display = 'none';
        title.textContent = title.innerText;
        title.insertAdjacentHTML('beforeend', '<span style="cursor: pointer; font-size: 14px; color: #919aae;"> 展开/折叠</span>');
        // 点击事件（展开/折叠）
        topbar.onclick = function(){
            if (q.style.display == 'none') {
                q.style.display = ''
            } else {
                q.style.display = 'none'
            }
        }
    }, 100);
    window.addEventListener('urlchange', stopWaiting);
}

// 屏蔽热榜杂项
function blockHotOther() {
    if (!menu_value('menu_blockTypeLiveHot')) return;

    const isQuestionItem = (hotItem) => {
        const linkItem = hotItem.querySelector('.HotItem-content a');
        if (linkItem === null) return false;
        return /\/question\/\d+/.test(linkItem.href);
    }

    const block = () => {
        removeLiveItems();
        fixItemRank();
    };

    // 移除非问题的内容
    const removeLiveItems = () => {
        const hotItems = document.querySelectorAll('.HotList-list .HotItem');
        for (const item of hotItems) {
            if (!isQuestionItem(item)) item.remove();
        }
    }

    // 修复排行榜序号
    const fixItemRank = () => {
        const hotItems = document.querySelectorAll('.HotList-list .HotItem:not([hidden])');
        hotItems.forEach((item, index) => {
            const rank = item.querySelector('.HotItem-index .HotItem-rank');
            if (rank !== null) rank.innerText = index + 1;
        });
    }

    const blockLive_content = (mutationsList, observer) => {
        for (const mutation of mutationsList) {
            for (const target of mutation.addedNodes) {
                if (target.nodeType != 1) continue
                if (target.classList.contains('HotItem') || target.querySelector('.HotItem')) {
                    block();
                    return // block 已处理当前整个榜单，每批只需执行一次
                }
            }
        }
    }

    const observer = new MutationObserver(blockLive_content);
    observer.observe(document, { childList: true, subtree: true });

    // 初始移除
    block();
}

// 将关注/推荐/热榜/专栏的选项去掉默认的点击事件改成静态链接（针对首页互相切换（知乎这里切换是动态加载的），为了避免功能交叉混乱
// 针对所有页面
function switchHome() {
    document.querySelectorAll('header.AppHeader nav').forEach((a)=>{a.outerHTML = a.outerHTML;})
}
// 针对首页几个页面
function switchHomeRecommend() {
    document.querySelectorAll('header.AppHeader nav>a:not([target])[href="https://www.zhihu.com/"]').forEach((a)=>{a.addEventListener('click', function(e){e.preventDefault();document.cookie='tst=r; expires=Thu, 18 Dec 2099 12:00:00 GMT; domain=.zhihu.com; path=/';location.href=this.href;return false;})})
}

function appendStyle(css, parent = document.documentElement) {
    const style = parent.appendChild(document.createElement('style'));
    style.textContent = css;
    return style;
}

// 单个增强初始化失败不能阻断其他功能；异常保留函数及场景标签和原始错误供定位。
function runFeature(name, initialize) {
    try {
        return initialize();
    } catch (error) {
        console.error('[Zhihu Web Enhancer] 功能失败：' + name, error);
    }
}

(function() {
    if (window.onurlchange === undefined) {addUrlChangeEvent();} // Tampermonkey v4.11 版本添加的 onurlchange 事件 grant，可以监控 pjax 等网页的 URL 变化
    rememberSelectedBlockKeyword(); // 记录当前选中的文字，供右键脚本菜单直接加入屏蔽词

    // document-start 只负责首帧屏蔽；其余增强按原 document-end 的 DOM 就绪语义启动
    if (document.readyState === 'loading') {
        document.addEventListener('readystatechange', initializeWhenDocumentReady);
    } else {
        initializeAfterDomReady();
    }

    function initializeWhenDocumentReady() {
        if (document.readyState === 'loading') return
        document.removeEventListener('readystatechange', initializeWhenDocumentReady);
        initializeAfterDomReady();
    }

    function initializeAfterDomReady() {
        runFeature('removeLogin', function(){removeLogin();}); // 移除登录弹窗
        runFeature('cleanTitles', function(){cleanTitles();}); // 净化标题消息
        // Violentmonkey 比 Tampermonkey 加载更早，会导致一些元素还没加载，因此需要延迟一会儿
        // Tampermonkey 4.18.0 版本可能需要延迟一会执行
        if (GM_info.scriptHandler === 'Violentmonkey' || (GM_info.scriptHandler === 'Tampermonkey' && parseFloat(GM_info.version.slice(0,4)) >= 4.18)) {
            setTimeout(start, 200);
        } else {
            start();
        }
    }

    function start(){
        runFeature('switchHome', function(){switchHome();}); // 将关注/推荐/热榜/专栏的选项去掉默认的点击事件改成静态链接（针对首页互相切换（知乎这里切换是动态加载的），为了避免功能交叉混乱
        runFeature('cleanHighlightLink', function(){cleanHighlightLink();}); //                                               移除高亮链接
        runFeature('originalPic', function(){originalPic();});runFeature('directLink', function(){directLink();}); // 先立即执行一次
        setInterval(function(){runFeature('originalPic', originalPic);},500); //                                       默认高清原图（无水印）
        setInterval(function(){runFeature('directLink', directLink);}, 500); //                                       默认站外直链
        if (location.hostname != 'zhuanlan.zhihu.com') {
            if (location.pathname.indexOf('/column/') === -1) runFeature('cleanSearch', function(){cleanSearch();}); //净化搜索热门
            runFeature('collapsedAnswer', function(){collapsedAnswer();}); //                                              一键收起回答
        }
        runFeature('closeFloatingComments', function(){closeFloatingComments();}); //                                            快捷关闭悬浮评论（监听点击事件，点击网页两侧空白处）
        runFeature('blockKeywords(comment)', function(){blockKeywords('comment');}); //                                           屏蔽指定关键词（评论）
        runFeature('blockKeywords(waiting)', function(){blockKeywords('waiting');}); //                                           屏蔽等你来答问题


        if (location.pathname.indexOf('question') > -1 && location.href.indexOf('/log') == -1) { //       回答页 //
            if (location.pathname.indexOf('waiting') == -1) {
                runFeature('collapsedNowAnswer', function(){collapsedNowAnswer('.QuestionPage');}); //                        收起当前回答 + 快捷返回顶部
                runFeature('collapsedNowAnswer', function(){collapsedNowAnswer('.QuestionPage>#AnswerFormPortalContainer+div>div:first-child');}); //收起当前回答 + 快捷返回顶部
                runFeature('questionRichTextMore', function(){questionRichTextMore();}); //                                     展开问题描述
                if (location.pathname.indexOf('answer') == -1) { //  问题页而不是回答页
                    runFeature('blockLowCount(question)', function(){blockLowCount('question');}); //                              屏蔽低赞/低评回答/文章
                } else { // 将回答页的的查看全部回答选项去掉默认的点击事件改成静态链接，为了避免功能交叉混乱
                    document.querySelectorAll('div.Card.ViewAll>a').forEach((a)=>{a.outerHTML = a.outerHTML;})
                }
                runFeature('blockUsers(question)', function(){blockUsers('question');}); //                                     屏蔽指定用户
                runFeature('blockYanXuan', function(){blockYanXuan();}); //                                             屏蔽盐选内容
                runFeature('blockType(question)', function(){blockType('question');}); //                                      屏蔽指定类别（视频/文章等）
                runFeature('defaultCollapsedAnswer', function(){defaultCollapsedAnswer();}); //                                   默认收起回答
            }
            setInterval(function(){runFeature('topTime_', function(){topTime_('.ContentItem.AnswerItem', 'ContentItem-meta');})}, 300); // 置顶显示时间
            setTimeout(function(){runFeature('question_time', function(){question_time();}); runFeature('question_author', function(){question_author();})}, 100); //问题创建时间 + 显示问题作者
            runFeature('questionInvitation', function(){questionInvitation();}); //                                           默认折叠邀请

        } else if (location.pathname === '/search') { //          搜索结果页 //
            runFeature('collapsedNowAnswer', function(){collapsedNowAnswer('main div');}); //                                 收起当前回答 + 快捷返回顶部
            runFeature('collapsedNowAnswer', function(){collapsedNowAnswer('.Search-container');}); //                        收起当前回答 + 快捷返回顶部
            setInterval(function(){runFeature('topTime_', function(){topTime_('.ContentItem.AnswerItem, .ContentItem.ArticleItem', 'SearchItem-meta');})}, 300); // 置顶显示时间
            runFeature('addTypeTips', function(){addTypeTips();}); //                                                  区分问题文章
            runFeature('addToQuestion', function(){addToQuestion();}); //                                                直达问题按钮
            runFeature('blockUsers(search)', function(){blockUsers('search');}); //                                           屏蔽指定用户
            runFeature('blockKeywords(search)', function(){blockKeywords('search');}); //                                        屏蔽指定关键词
            runFeature('blockType(search)', function(){blockType('search');}); //                                            屏蔽指定类别（视频/文章等）


        } else if (location.pathname.indexOf('/topic/') > -1) { //   话题页 //
            if (location.pathname.indexOf('/hot') > -1 || location.href.indexOf('/top-answers') > -1) { // 仅限 [讨论] [精华]
                runFeature('collapsedNowAnswer', function(){collapsedNowAnswer('main.App-main');}); //                        收起当前回答 + 快捷返回顶部
                setInterval(function(){runFeature('topTime_', function(){topTime_('.ContentItem.AnswerItem, .ContentItem.ArticleItem', 'ContentItem-meta');})}, 300); // 置顶显示时间
                runFeature('addTypeTips', function(){addTypeTips();}); //                                              区分问题文章
                runFeature('addToQuestion', function(){addToQuestion();}); //                                            直达问题按钮
                runFeature('blockUsers(topic)', function(){blockUsers('topic');}); //                                        屏蔽指定用户
                runFeature('blockKeywords(topic)', function(){blockKeywords('topic');}); //                                     屏蔽指定关键词
            }

        } else if (location.hostname === 'zhuanlan.zhihu.com'){ //    文章 //
            runFeature('backToTop', function(){backToTop('.Post-content');}); //                                     快捷返回顶部
            runFeature('backToTop', function(){backToTop('.Post-Row-Content');}); //                                 快捷返回顶部
            setTimeout(function(){runFeature('topTime_post', topTime_post);}, 300); //                                  置顶显示时间
            runFeature('blockUsers', function(){blockUsers();}); //                                                   屏蔽指定用户


        } else if (location.pathname.indexOf('/column/') > -1) { //    专栏 //
            setTimeout(function(){
                runFeature('collapsedAnswer', function(){collapsedAnswer();}); //                                           一键收起回答
                runFeature('collapsedNowAnswer', function(){collapsedNowAnswer('main div');}); //                              收起当前回答 + 快捷返回顶部
                setInterval(function(){runFeature('topTime_', function(){topTime_('.ContentItem.AnswerItem, .ContentItem.ArticleItem', 'ContentItem-meta');})}, 300); // 置顶显示时间
                runFeature('blockUsers', function(){blockUsers();}); //                                                屏蔽指定用户
            }, 300);


        } else if (/^\/(?:people|org)\/[^/]+(?:\/|$)/.test(location.pathname)) { // 用户主页 //
            if (location.pathname.split('/').length === 3) runFeature('addTypeTips', function(){addTypeTips();});runFeature('addToQuestion', function(){addToQuestion();}); // 区分问题文章、直达问题按钮
            runFeature('collapsedNowAnswer', function(){collapsedNowAnswer('main div');}); //                                 收起当前回答 + 快捷返回顶部
            runFeature('collapsedNowAnswer', function(){collapsedNowAnswer('.Profile-main');}); //                            收起当前回答 + 快捷返回顶部
            setInterval(function(){runFeature('topTime_', function(){topTime_('.ContentItem.AnswerItem, .ContentItem.ArticleItem', 'ContentItem-meta');})}, 300); // 置顶显示时间
            runFeature('blockUsers(people)', function(){blockUsers('people');}); //                                           屏蔽指定用户
            runFeature('blockKeywords(people)', function(){blockKeywords('people');}); //                                        屏蔽指定关键词


        } else if (location.pathname.indexOf('/collection/') > -1) { // 收藏夹 //
            runFeature('addTypeTips', function(){addTypeTips();}); //                                                  区分问题文章
            runFeature('addToQuestion', function(){addToQuestion();}); //                                                直达问题按钮
            runFeature('collapsedNowAnswer', function(){collapsedNowAnswer('main');}); //                                     收起当前回答 + 快捷返回顶部
            runFeature('collapsedNowAnswer', function(){collapsedNowAnswer('.CollectionsDetailPage');}); //                   收起当前回答 + 快捷返回顶部
            setInterval(function(){runFeature('topTime_', function(){topTime_('.ContentItem.AnswerItem, .ContentItem.ArticleItem', 'ContentItem-meta');})}, 300); // 置顶显示时间
            runFeature('blockKeywords(collection)', function(){blockKeywords('collection');}); //                                    屏蔽指定关键词

        } else if (location.pathname.indexOf('/pin/') > -1) { // 想法 //
            runFeature('backToTop', function(){backToTop('main[role=main]');}); //                                   快捷返回顶部
            setInterval(function(){runFeature('topTime_', function(){topTime_('.ContentItem.PinItem', 'ContentItem-meta');})}, 300); // 置顶显示时间

        } else if (['/','/hot','/follow','/column-square','/ring-feeds'].indexOf(location.pathname) !== -1) { //    首页 //
            runFeature('switchHomeRecommend', function(){switchHomeRecommend();}); // 针对首页推荐
            // 解决屏蔽类别后，因为首页信息流太少而没有滚动条导致无法加载更多内容的问题
            appendStyle('.Topstory-container {min-height: 1500px;}');
            if (menu_value('menu_blockTypeVideo')) appendStyle(`.Card .ZVideoItem-video, nav.TopstoryTabs > a[aria-controls="Topstory-zvideo"] {display: none !important;}`);

            runFeature('collapsedNowAnswer', function(){collapsedNowAnswer('.App-main .Topstory');}); //                      收起当前回答 + 快捷返回顶部
            runFeature('collapsedNowAnswer', function(){collapsedNowAnswer('.App-main .Topstory-container');}); //            收起当前回答 + 快捷返回顶部
            if (location.pathname !== '/column-square'){ // 不是首页 - 专栏时
                setInterval(function(){runFeature('topTime_', function(){topTime_('.TopstoryItem', 'ContentItem-meta');})}, 300); // 置顶显示时间
                runFeature('addTypeTips', function(){addTypeTips();}); //                                                  区分问题文章
                runFeature('addToQuestion', function(){addToQuestion();}); //                                                直达问题按钮
                if (location.pathname == '/') { // 推荐
                    runFeature('blockLowCount(index)', function(){blockLowCount('index');}); //                                     屏蔽低赞/低评回答/文章
                    runFeature('blockUsers(index)', function(){blockUsers('index');}); //                                        屏蔽指定用户
                    runFeature('blockKeywords(index)', function(){blockKeywords('index');}); //                                     屏蔽指定关键词
                    runFeature('blockType', function(){blockType();}); //                                                屏蔽指定类别（视频/文章等）
                } else if (location.pathname == '/hot') { // 热榜
                    runFeature('blockKeywords(index)', function(){blockKeywords('index');}); //                                     屏蔽指定关键词
                    runFeature('blockHotOther', function(){blockHotOther();}); //                                            屏蔽热榜杂项
                } else if (location.pathname == '/follow') { // 关注
                    runFeature('blockLowCount(follow)', function(){blockLowCount('follow');}); //                                    屏蔽低赞/低评回答/文章
                    runFeature('blockUsers(follow)', function(){blockUsers('follow');}); //                                       屏蔽指定用户
                    runFeature('blockKeywords(follow)', function(){blockKeywords('follow');}); //                                    屏蔽指定关键词
                    runFeature('blockType', function(){blockType();}); //                                                屏蔽指定类别（视频/文章等）
                    runFeature('blockType(follow)', function(){blockType('follow');}); //                                        屏蔽指定类别（赞同了XX/关注了XX等）
                }
            }
        }
    }
})();
