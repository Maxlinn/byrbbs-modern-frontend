// ==UserScript==
// @name         北邮人论坛 - 变好看！
// @namespace    http://github.com/Maxlinn/
// @version      1.2.0
// @description  一些仅在前端的北邮人论坛美化
// @author       Maxlinn
// @match        https://bbs.byr.cn/
// @icon         https://bbs.byr.cn/favicon.ico
// @homepageURL  https://github.com/Maxlinn/byrbbs-modern-frontend
// @supportURL   https://github.com/Maxlinn/byrbbs-modern-frontend
// @updateURL    https://raw.githubusercontent.com/Maxlinn/byrbbs-modern-frontend/master/main.user.js
//
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        none
// ==/UserScript==

var old_top_head = undefined;
var old_left_aside = undefined;
var fulltext_search_api = "http://123.207.168.11/byrbbs/?key=";
var container_font_family = 'Verdana, Tahoma, Arial, "Microsoft YaHei", "Hiragino Sans GB", "WenQuanYi Micro Hei", sans-serif';
var article_font_family = "-apple-system,BlinkMacSystemFont,Helvetica Neue,PingFang SC,Microsoft YaHei,Source Han Sans SC,Noto Sans CJK SC,     WenQuanYi Micro Hei,sans-serif";
var section_title2desc = {
    "近期热门话题": "俗称的论坛十大<br>关注今天北邮的新鲜事",
    "近期热点活动": "找点有趣的人，干点有趣的事",
    "生活时尚": "今天有什么奇思妙想",
    "信息社会": "工作、读研、考公",
    "投票": "你怎么看",
    "精彩": "万一猜对了呢",
    "近期推荐文章": "大家都在看什么"
}

function save_old_header() {
    var el = $('header#top_head');
    old_top_head = el;
}

function remove_left_bar() {
    var el = $('aside#menu').remove();
    old_left_aside = el;
    $('section#main').css({ 'margin-left': '120px', 'margin-right': '120px' });
}

function keep_only_first_column_of_containers() {
    // 请将要用的控件都放到第一列来，第二列和第三列的控件不会被使用
    // 仅选择下一级，用`> li`来选择，或者使用`.children()`

    // var left_col = $('ul#column1');
    // var mid_col = $('ul#column2');
    // var right_col = $('ul#column3');
    // mid_col.remove().children('li').appendTo(left_col);
    // right_col.remove().children('li').appendTo(left_col);

    $('ul#column2').remove();
    $('ul#column3').remove();
    $('#columns .column').css('width', '100%');
}

function replace_new_header() {
    old_top_head.remove();
    // nh -> new_header, nhl -> new_header_left, nhr -> new_header_right
    // 先右再左，因为右是float
    var new_header = `
    <header style="text-align: center">
        <div id="nhr" style="float: right">
            <div class="nhl_div">
                <input type="text" class="input-text" placeholder="论坛全文搜索（非官方）" id="new_fulltext_search" x-webkit-speech="" lang="zh-CN">
            </div>
            <div class="nhr_div">
                <a class="nhr_a" href="/article/Announce/261" target="_blank" style="white-space: nowrap;">官方APP</a>
            </div>
            <div class="nhr_div">
                <a class="nhr_a" href="telnet://bbs.byr.cn" target="_blank" style="white-space: nowrap;">Telnet</a>
            </div>
            <div class="nhr_div">
                <a class="nhr_a" href="http://weibo.com/byrbbs" target="_blank" style="white-space: nowrap;">官微</a>
            </div>
            <div class="nhr_div">
                <a class="nhr_a" href="/n" target="_blank" style="white-space: nowrap;">移动版</a>
            </div>
        </div>
        <div id="nhl">
            <div class="nhl_div" id="nhlogo">
                <a class="nlh_a" href="http://bbs.byr.cn">
                    <img alt="byrbbs" src="data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAMgAAABDCAYAAADZL0qFAAAACXBIWXMAAAsTAAALEwEAmpwYAAAGnWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAyMi0wNS0yOFQxNzowMzozNCswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMi0wNS0yOFQxNzowMzozNCswODowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjItMDUtMjhUMTc6MDM6MzQrMDg6MDAiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NDQzYjgyNDEtN2VkMS00MDQzLTkwNGMtMjE1NDQxNWY5NDU0IiB4bXBNTTpEb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6OTIyMWI0M2ItMGYwNy01MDRhLTk5NTUtOTlmNTQ4YTI3ZWI4IiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6MGIyNTAzMzctZDJiOS0yYzRiLWJkZTctNWQyZjA3MDc3NTIxIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDowYjI1MDMzNy1kMmI5LTJjNGItYmRlNy01ZDJmMDcwNzc1MjEiIHN0RXZ0OndoZW49IjIwMjItMDUtMjhUMTc6MDM6MzQrMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAoV2luZG93cykiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjQ0M2I4MjQxLTdlZDEtNDA0My05MDRjLTIxNTQ0MTVmOTQ1NCIgc3RFdnQ6d2hlbj0iMjAyMi0wNS0yOFQxNzowMzozNCswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPHBob3Rvc2hvcDpUZXh0TGF5ZXJzPiA8cmRmOkJhZz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSLljJfpgq7kurrorrrlnZsgIGJicy5ieXIuY24iIHBob3Rvc2hvcDpMYXllclRleHQ9IuWMl+mCruS6uuiuuuWdmyAgYmJzLmJ5ci5jbiIvPiA8L3JkZjpCYWc+IDwvcGhvdG9zaG9wOlRleHRMYXllcnM+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+R6BoWQAAH1lJREFUeNrtfWtwHNd15ndu97wwAIgBSREkJZEE9bJkWbJASzYg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">
                </a>
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
                <input type="text" class="input-text" placeholder="进入板块" id="b_search" x-webkit-speech="" lang="zh-CN">
            </div>
        </div>
    </header>
    `;

    // 插入新的header
    $('body').prepend(new_header);

    // 编辑样式
    // 设置标题栏的样式并冻结
    $('header').css({
        'height': '80px',
        'box-shadow': '0px 1px 1px gray',
        'background-color': '#FFFFFF'
    });

    // 设置字区域横排
    $('div#nhl, div#nhr').css({
        'display': 'flex',
        'flex-direction': 'row',
        'font-size': '1.5em',
        'font-family': 'Verdana, Tahoma, Arial, "Microsoft YaHei", "Hiragino Sans GB", "WenQuanYi Micro Hei", sans-serif'
    });

    // 设置间距
    $('div.nhl_div, div.nhr_div').css({
        'padding': '10px'
    })
    // 设置字垂直居中
    $('div.nhl_div:not(#nhlogo), div.nhr_div').css({
        'margin-top': '20px'
    })

    // 添加用户的id
    $('div#nhr').append(old_left_aside.find('div.u-login-id').css({
        'margin-top': '32px'
    }));

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
}

function set_background_color() {
    $('body:not(header)').css('background', '#F2F6F9');
}

function containers_set_font() {
    $('section#main').css({
        'font-size': '1.4em',
        'font-family': container_font_family
    })
}

function raise_and_merge_picshow_and_topposts() {
    var picshow = $('li#picshow').remove();
    var topposts = $('li#topposts').remove();

    // picshow and topposts 合成一个ul
    picshow.css({ "min-width": "500px" });

    var pt = $('<ul id="new_pt">')
        .append(picshow)
        .append(topposts)
        .css({ "display": "flex" });
    $('ul#column1').prepend(pt);
}

function containers_insert_desc() {
    var lis = $('ul#column1>li');
    for (var i = 0; i < lis.length; i++) {
        // 注意要用jquery包一下，因为原生的dom对象不支持css方法
        // li是一个container
        var li = $(lis[i]);

        // 分区的标题和描述
        var desc = $('<div class="widget-desc">');
        var name = li.find("span.widget-title").text();
        var text = section_title2desc[name];
        desc
            .append($("<h3>" + name + "</h3>"))
            .append(`<hr>`)
            .append($("<p>" + text + "</p>"))
            // desc需要宽度
            .css({
                "min-width": "250px",
                "background-color": "transparent",
                "padding": "20px"
            });

        // 分区内可能存在的列表，底部线拉长
        li.find('ul').css({ "width": "100%" });
        li.find('div.w-tab').css({ "width": "100%" });

        li.find("div.widget-content")
            .prepend(desc)
            .css({ "width": "100%", "display": "flex" });
    }
}

// @depreacted
function containers_squeeze_height() {
    var lis = $('ul#column1>li.widget');
    var contents = lis.find('div.widget-content');
    contents.css({ "overflow-y": "scroll", "height": "160px" });
}

function rewrite_reply_info() {
    var tb = $('table.article');
    if (!tb.length) return;
    var replys = tb.find('div.a-content-wrap');
    // 删除发信人（因为左边avatar有，重复了）和标题
    var del_sender_regex = /^发信人:.*?<br>标&nbsp;&nbsp;题:.*?<br>/ig;
    for (var i = 0; i < replys.length; i++) {
        replys[i].innerHTML = replys[i].innerHTML.replace(del_sender_regex, '');
        // 在发信站下加横线，因为发信站后会有两个<br>，这里只替换第一处即可
        replys[i].innerHTML = replys[i].innerHTML.replace(/<br><br>/, '<hr>');
    }
}

function replys_set_font() {
    var tb = $('table.article');
    if (!tb.length) return;
    var replys = tb.find('div.a-content-wrap');
    replys.css({
        "font-family": article_font_family,
        "font-size": "15px"
    });
}

function fix_mobile_title() {
    if (document.title == "鍖楅偖浜鸿鍧") {
        document.title = "北邮人论坛移动版";
    }
}

function modify_homepage() {
    /// 主页
    // 内容容器的修改
    keep_only_first_column_of_containers();
    raise_and_merge_picshow_and_topposts();
    containers_insert_desc();
    containers_set_font();
}

function modify_article() {
    /// 帖子页
    rewrite_reply_info();
    replys_set_font();
}

// on_load只在初次加载页面时运行一次
function on_load() {
    /// 移动版
    fix_mobile_title();

    /// 通用
    // 左栏，背景
    remove_left_bar();
    set_background_color();
    // 顶部
    save_old_header();
    replace_new_header();

    on_jump();
};

// on_jump在站内点击链接导致URL变化时运行
function on_jump() {
    var hash = window.location.hash;
    if (hash == "") {
        modify_homepage();
    } else if (hash.startsWith("#!article")) {
        modify_article();
    }
}

// 只有当加载完毕后，jquery才能正确找到元素
window.addEventListener('load', on_load, false);
// 切换页面时，需要先等页面加载出来
window.addEventListener('hashchange', () => {
    new Promise(resolve => setTimeout(resolve, 1000)).then(on_jump);
}, false);