// ==UserScript==
// @name         北邮人论坛 - 变好看！
// @namespace    http://github.com/Maxlinn/
// @version      3.2.0
// @description  一些仅在前端的北邮人论坛美化
// @author       Maxlinn
// @match        https://bbs.byr.cn/
// @icon         https://bbs.byr.cn/favicon.ico
// @homepageURL  https://github.com/Maxlinn/byrbbs-modern-frontend
// @supportURL   https://github.com/Maxlinn/byrbbs-modern-frontend
// @updateURL    https://raw.githubusercontent.com/Maxlinn/byrbbs-modern-frontend/master/main.user.js
// @downloadURL  https://raw.githubusercontent.com/Maxlinn/byrbbs-modern-frontend/master/main.user.js
//
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// @grant        none
// ==/UserScript==

// ***********************************设置用变量*************************************
// 论坛全文搜索API，由校友提供，不保证可靠性
var fulltext_search_api = "http://oneseven.cc/byrbbs/?key=";
// 论坛各组件的字体
var widget_font =
    `Verdana, Tahoma, Arial, "Microsoft YaHei", "Hiragino Sans GB", "WenQuanYi Micro Hei", sans-serif`;
// 阅读文章时的字体
var article_font =
    `-apple-system,BlinkMacSystemFont,Helvetica Neue,PingFang SC,Microsoft YaHei,Source Han Sans SC,Noto Sans CJK SC, WenQuanYi Micro Hei,sans-serif`;

// 分区标题和描述的映射
var container_title_desciption_mapping = {
    "近期热门话题": "俗称的论坛十大<br>关注今天北邮的新鲜事",
    "近期热点活动": "找点有趣的人，干点有趣的事",
    "生活时尚": "今天有什么奇思妙想",
    "信息社会": "工作、读研、考公、创业",
    "情感的天空": "愿陪你一同走过",
    "投票": "展示你的态度",
    "竞猜": "万一猜对了呢",
    "近期推荐文章": "大家都在看什么",
    "发文排行榜": "谁发了最多的贴？",
    "挂站排行榜": "谁看了最久论坛？"
    // todo: not finished
}

// ***********************************全局变量*************************************
// 原论坛顶栏备份（jquery选择器）
var old_header_selector = undefined;
// 原论坛左栏备份（jquery选择器）
var old_left_bar_selector = undefined;
// 解决论坛自带的JQuery和脚本内的JQuery冲突
//  https://stackoverflow.com/questions/28264871/require-jquery-to-a-safe-variable-in-tampermonkey-script-and-console
this.$ = window.jQuery.noConflict(true);


// ***********************************功能实现*************************************
// 去除并备份原顶栏
function remove_header() {
    old_header_selector = $('header#top_head');
    old_header_selector.remove();
}

// 去除并备份原左栏
function remove_left_bar() {
    old_left_bar_selector = $('aside#menu');
    old_left_bar_selector.remove();
    // 移除左栏后，需要右侧区域居中
    $('section#main').css({
        'margin-left': '120px',
        'margin-right': '120px'
    });
}

// 将要用的控件都放到第一列来，第二列和第三列删除
function keep_only_first_column_of_containers() {
    $('ul#column2').remove();
    $('ul#column3').remove();
    $('#columns .column').css('width', '100%');

    // @deprectaed 如何将其他列的控件移动到第一列
    //  仅选择下一级的选择器是 > li ，或者使用jquery选择器.children()
    // var left_col = $('ul#column1');
    // mid_col.remove().children('li').appendTo(left_col);
}

// 插入新设计的顶栏
function insert_new_header() {
    // nh -> new_header, nhl -> new_header_left, nhr -> new_header_right
    // 因为new_header_right需要float，所以div排列中先右再左
    var new_header_html = `
    <header style="text-align: center">
        <div id="nhr" style="float: right">
            <div class="nhl_div">
                <input type="text" class="input-text" placeholder="论坛全文搜索（非官方）" id="new_fulltext_search" x-webkit-speech="" lang="zh-CN">
            </div>
            <div class="nhr_div">
                <a class="nhr_a" href="/article/Announce/261" target="_blank" style="white-space: nowrap;">官方APP</a>
            </div>
            <div class="nhr_div">
                <a class="nhr_a" href="http://weibo.com/byrbbs" target="_blank" style="white-space: nowrap;">官微</a>
            </div>
            <div class="nhr_div">
                <a class="nhr_a" href="javascript:window.open('/n'+(window.location.hash.length? window.location.pathname: '')+window.location.hash.replace('#!', '')+window.location.search)" style="white-space: nowrap;">移动版</a>
            </div>
        </div>
        <div id="nhl">
            <div class="nhl_div" id="nhlogo">
                <a class="nlh_a" href="http://bbs.byr.cn">
                    <img alt="byrbbs" src="${mobile_butterfly_b64}" style="width:60px; height:60px;">
                </a>
            </div>
            <div class="nhl_div" id="nhtitle">
                <a class="nhl_a" href="http://bbs.byr.cn" target="_self" style="white-space: nowrap;">北邮人论坛<br>bbs.byr.cn</a>
            </div>
            <div class="nhl_div">
                <a class="nhl_a" href="/vote" target="_blank" style="white-space: nowrap;">投票</a>
            </div>
            <div class="nhl_div">
                <a class="nhl_a" href="/score" target="_blank" style="white-space: nowrap;">积分</a>
            </div>
            <div class="nhl_div">
                <a class="nhl_a" href="/elite/path" target="_blank" style="white-space: nowrap;">精华</a>
            </div>
            <div class="nhl_div">
                <a class="nhl_a" href="/#!board/IWhisper" target="_blank" style="white-space: nowrap;">悄悄话</a>
            </div>
            <div class="nhl_div">
                <input type="text" class="input-text" placeholder="搜索板块" id="b_search" x-webkit-speech="" lang="zh-CN">
            </div>
        </div>
    </header>
    `;

    // 插入新的header
    $('body').prepend(new_header_html);

    $('header').css({
        'height': '80px',
        'box-shadow': '0px 1px 1px gray',
        'background-color': '#FFFFFF'
    });

    // 设置所有标签横排
    $('div#nhl, div#nhr').css({
        'display': 'flex',
        'flex-direction': 'row',
        'font-size': '1.5em',
        'font-family': widget_font
    });

    // 设置所有标签间距
    $('div.nhl_div, div.nhr_div').css({
        'padding': '10px'
    })

    // 设置“北邮人论坛”
    $('div#nhtitle').css({
        'margin-top': '10px'
    })
    $('div#nhtitle > a').css({
        'color': '#1b4e95',
        'font-size': '20px'
    })

    // 设置其他标签顶部
    $('div.nhl_div:not(#nhlogo, #nhtitle), div.nhr_div').css({
        'margin-top': '20px'
    })

    // 全文搜索的回车监听
    $('input#new_fulltext_search').keypress(function (e) {
        if (e.which == 13) {
            var query = $('input#new_fulltext_search').val();
            query = query.replace(' ', '+');
            query = encodeURIComponent(query);
            window.open(fulltext_search_api + query);
            return false;
        }
    });

    // 添加用户的id
    $('div#nhr').append(old_left_bar_selector.find('div.u-login-id').css({
        'margin-top': '32px'
    }));
}

// 将主体区域的背景色设置为论坛蓝
function set_mainframe_background_color() {
    $('body:not(header)').css({
        'background': '#F2F6F9'
    });
}

// 设置各控件的字体
function set_widgets_font() {
    $('section#main').css({
        'font-size': '1.4em',
        'font-family': widget_font
    })
}

// 将贴图秀和好文收录放在顶部双栏显示
function raise_picshow_and_topposts() {
    var prompt_if_not_exist = `<li><div>
        <hr>
            <h3>此处应为{widget_name}</h3>
        <hr>
            <p>
            <a href="https://bbs.byr.cn/#!widget/add?t=ext" target="_blank">点击此处，将贴图秀栏目加入到第一列，再刷新</a><br>
            小提示：打开脚本后，只有显示第一列的栏目，请将关心的栏目都放到第一列哦
            </p>
        </div></li>`;

    // 贴图秀
    var picshow = $('li#picshow').remove();
    // 经反馈，有时不叫picshow，叫board-Picture
    if (picshow.length == 0) {
        picshow == $('li#board-Picture').remove();
    }
    // 如果还是没有，提示添加
    if (picshow.length == 0) {
        picshow = $(prompt_if_not_exist.format('贴图秀'));
    }

    // 好文收录
    var topposts = $('li#topposts').remove();
    if (topposts.length == 0) {
        topposts = $(prompt_if_not_exist.format('好文收录'));
    }

    // picshow and topposts 合成一个ul
    var combined = $('<ul id="picshow_and_topposts">')
        .append(picshow)
        .append(topposts)
        .css({ "display": "flex" });

    // 合成后，贴图秀需要设置下最小宽度
    picshow.css({ "min-width": "500px" });

    $('ul#column1').prepend(combined);

    // todo: 贴图秀和好文收录的下端不平齐
}

// 给首页的组件加上描述，使其看起来没有那么空
function insert_description_to_containers() {
    var lis = $('ul#column1>li');

    for (var i = 0; i < lis.length; i++) {
        var li = $(lis[i]);

        // 取得标题，从预设中取出描述
        var name = li.find("span.widget-title").text();
        var text = container_title_desciption_mapping[name] || "#todo: 描述待添加"

        // 构建描述区域
        var description = $('<div class="widget-description">')
            .append($("<h3>" + name + "</h3>"))
            .append(`<hr>`)
            .append($("<p>" + text + "</p>"))
            .css({
                "min-width": "250px",
                "background-color": "transparent",
                "padding": "20px"
            });

        // 插入描述区域
        li.find("div.widget-content")
            .prepend(description)
            .css({ "width": "100%", "display": "flex" });

        // 分区内可能存在的列表，底部线拉长
        li.find('ul').css({ "width": "100%" });
        li.find('div.w-tab').css({ "width": "100%" });
    }
}

// 将页面最上面的广告牌（如“暑假快乐”）移动到
// deprecated
// function move_slider_to_bottom() {
//     if (old_header_selector == undefined) {
//         var slider = $("article#ban_ner");
//     } else {
//         var slider = old_header_selector.find("article#ban_ner");
//     }

//     var footer = $("footer#bot_foot");

//     footer.prepend(slider);
// }

// 对文章和回复的顶部栏进行修改
function clean_article_and_replys_meta() {
    var tb = $('table.article');
    var replys = tb.find('div.a-content-wrap');

    for (var i = 0; i < replys.length; i++) {
        // 删除发信人（因为左边avatar有，重复了）和标题
        replys[i].innerHTML = replys[i].innerHTML.replace(/^发信人:.*?<br>标&nbsp;&nbsp;题[:：].*?<br>/ig, '');

        // 将发信站信息放到最后去
        // 因为发信站后会有两个<br>，可以用来定位
        replys[i].innerHTML = replys[i].innerHTML.replace(/<br><br>/, '<hr>');
    }
}

function clean_article_head() {
    var head = $('div.b-head');

    // 调整高度和字体大小
    head.css({ 'height': '30px', 'font-size': '20px' });

    // 左侧去掉“文章主题”四个字
    var left = head.find('span.n-left');
    left[0].innerHTML = left[0].innerHTML.replace(/文章主题:/, '').trim();

    // 去掉右侧的分享
    var right = head.find('span.n-right');
    right.children().remove();
}

// 设置文章的字体
function set_articles_font() {
    var tb = $('table.article');
    var replys = tb.find('div.a-content-wrap');

    replys.css({
        "font-family": article_font,
        "font-size": "15px"
    });
}

// 修复查看移动版时的标题
function fix_mobile_title() {
    if (document.title == "鍖楅偖浜鸿鍧") {
        document.title = "北邮人论坛移动版";
    }
}

// 更改网站图标
// https://stackoverflow.com/questions/260857/changing-website-favicon-dynamically
// todo: not working
// function change_favicon() {
//     var favicon = document.querySelector('link[rel~="icon"]');
//     var clone = favicon.cloneNode(!0);
//     clone.href = mobile_butterfly_b64;
//     favicon.parentNode.removeChild(favicon);
//     document.head.appendChild(clone);
// }

// 修复修改字体后，挂站排行榜和发帖排行榜显示重叠的问题
function fix_postrank_and_stayrank() {
    $('li#stayrank,li#postrank')
        .find("ul.w-list-line>li")
        .find("span")
        .css({ "width": "200px" });
}

// 移除掉过于久远的置顶帖子（红色的），在悄悄话尤其常见
// 默认移除上一次更新超过一个月的回复
// moment.js无法导入到tampermoneky.js，所以暂时手动实现
function remove_stale_toppings() {
    var trs = $('div.b-content').find('tr.top');
    for (var i = 0; i < trs.length; i++) {
        var tr = $(trs[i]);

        var last_reply_timestr = tr.find('td.title_10')[1].outerText;
        var last_reply_time = new Date(Date.parse(last_reply_timestr.replace(/-/g, "/")));

        var diff_milliseconds = new Date() - last_reply_time;
        var diff_month = diff_milliseconds / (1000 * 60 * 60 * 24 * 30);

        if (diff_month > 1) {
            // trs[i]才是dom元素，tr是jquery selector
            trs[i].remove();
        }
    }
}

// 增加对美化脚本的描述
function add_nav_prompt() {
    var prompt = $(`
    <p>
        【美化】<a href="https://github.com/Maxlinn/byrbbs-modern-frontend" target="_blank">美化脚本</a>已启用，
        <a href="https://bbs.byr.cn/#!widget/add" target="_blank">增减板块请点击此处并添加到第一列</a>。任何时候若效果不符合预期，请刷新。仍无法解决，请禁用美化脚本。
    </p>`).css({ "margin-top": "10px" });

    $('div#notice_nav').append(prompt);
    $('head').append(`<meta name="beautify" content="Maxlinn">`);
}

// 将精彩回复加宽
function widen_top_replys() {
    // “精彩回复 收起”那条线
    $("div.a-nice-comment-divline").css({ "width": "100%" });
    // “精彩评论” 的外框
    $("div.a-nice-comment").css({ "width": "100%" });
    // 各个评论
    $("div.a-nice-comment-item").css({ "width": "95%" });
}


// ***********************************功能开关*************************************
// 访问主页时
function modify_homepage() {
    add_nav_prompt();
    keep_only_first_column_of_containers();
    // raise需要放在insert_desc前面，因为picshow和topposts不需要描述
    raise_picshow_and_topposts();
    fix_postrank_and_stayrank();
    insert_description_to_containers();
    set_widgets_font();
}

// 阅读文章时
function modify_article() {
    clean_article_and_replys_meta();
    clean_article_head();
    set_articles_font();
    widen_top_replys();
}

// 查看文章列表时
function modify_board() {
    set_widgets_font();
    remove_stale_toppings();
}

// 载入论坛时，这些修改只会执行一次
function on_load() {
    fix_mobile_title();
    // change_favicon();
    remove_left_bar();
    set_mainframe_background_color();
    remove_header();
    insert_new_header();

    // 中间的页面元素是异步加载的，可能会慢一些，稍微等等
    setTimeout(on_hashchange, 1000);
};

// 在站内点击链接导致URL变化时运行
function on_hashchange() {
    var hash = window.location.hash;
    // 经过反馈，首页的hash可能是#!default
    if (hash == "" || hash.startsWith("#!default")) {
        modify_homepage();
    } else if (hash.startsWith("#!article")) {
        modify_article();
    } else if (hash.startsWith("#!board")) {
        modify_board();
    }
}

// ***********************************事件监听*************************************
window.addEventListener('load', on_load, false);

// 切换页面时，需要先等页面加载出来
window.addEventListener('hashchange', () => {
    setTimeout(on_hashchange, 1000);
}, false);

// ***********************************资源*************************************
var mobile_butterfly_b64 =
    `data:img/png;base64,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`;