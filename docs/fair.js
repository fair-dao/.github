const BIND_IF = "data-bind-if";
const BIND_JSON = "bind-json";
const BIND_HTML = "bind-html";
const BIND = "data-bind";
const BIND_LANG = "data-bind-lang";
const BIND_FOR = "data-bind-for"; //循环
function getQuery(key) {
    var query = window.location.search.substring(1);
    var key_values = query.split("&");
    var params = {};
    key_values.map(function (key_val) {
        var key_val_arr = key_val.split("=");
        params[key_val_arr[0]] = key_val_arr[1];
    });
    if (typeof params[key] != "undefined") {
        return params[key];
    }
    return "";
}

function loadJS(url, callback) {
    var script = document.createElement('script'),
        fn = callback || function (state) { };
    script.type = 'text/javascript';

    if (script.readyState) {

        script.onreadystatechange = function () {

            if (script.readyState == 'loaded' || script.readyState == 'complete') {

                script.onreadystatechange = null;

                fn("ok");

            }

        };

    } else {
        script.onload = function () { fn("ok"); };
        script.onerror = function () {
            fn("error")
        };
    }
    script.src = url;
    document.getElementsByTagName('head')[0].appendChild(script);
}


function translate(key,json) {
    if (typeof (key) === "undefined" || key === null || key === "") return "";
    let val = com.kvs[key];
    if (typeof (val) === "undefined") {
        try {
            val = eval(key);
        } catch (e) {
        }
    }
    if (typeof (val) === "undefined") return "";
    return val;
}


function processHtmlTemplate(element) {
    element.querySelectorAll("[" + BIND_JSON + "]").forEach(async (e) => {
        let key = e.getAttribute(BIND_JSON);
        let response = await fetch(key + "_" + lang + ".json");
        let json = await response.json();
        processBindFor(e,json);  
    });
    element.querySelectorAll(".tabs").forEach((e) => {
        let contents = e.querySelectorAll("li");
        contents.forEach((e2, index) => {
            e2.onclick = function () {
                let tab = this.parentNode.querySelector(".is-active");
                if (tab) tab.classList.remove("is-active");
                this.classList.add("is-active");
                var contents = this.parentNode.parentNode.parentNode.querySelectorAll(".tabs-content>div");
                for (let i = 0; i < contents.length; i++) {
                    let cur = contents[i];
                    if (i != index) {
                        if (cur.classList.contains("is-active")) cur.classList.remove("is-active");
                    } else cur.classList.add("is-active");
                }
            }

        });

    });
}


function processBindFor(element,json) {
    element.querySelectorAll("[" + BIND_FOR + "]").forEach(e => {
        let html = e.innerHTML;
        let key = e.getAttribute(BIND_FOR);
        let items = translate(key,json);
        let newHtml = "";
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            item.index = i;
            var reg = new RegExp("\{\-[^\}]+?\-\}", "g");
            let itemHtml = html.replace(reg, function (s) {
                var old = s;
                s = s.replace(new RegExp("item\."), "").replace(/\-\}/g, "").replace(/\{\-/g, "");
                let val = eval("item." + s);
                return val;
            });
            newHtml += itemHtml;
        }
        e.innerHTML = newHtml;
        e.removeAttribute(BIND_FOR);
        processBind(e);
    });
    processBind(element);
}

function processBind(element) {
    element.querySelectorAll("[" + BIND_IF + "]").forEach(e => {
        let key = e.getAttribute(BIND_IF);
        let val = translate(key);
        if (!val) {
            e.parentNode.removeChild(e);
        } else e.removeAttribute(BIND_IF);
    });

    element.querySelectorAll("[" + BIND + "]").forEach(e => {
        let key = e.getAttribute(BIND);     
        e.innerHTML = translate(key);
        e.removeAttribute(BIND);
    }); 
}

function loadData() {

    document.title = com.kvs["page-title"];
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
        meta.setAttribute('content', com.kvs["page-des"]);
    }

    // <div bind-html="page/header.html"></div> or <div bind-html="page/header"></div> (page/header_cn.html)
    document.querySelectorAll("[" + BIND_HTML + "]").forEach( async(e) => {
        let page = e.getAttribute(BIND_HTML);
        if (!page.endsWith(".html")) {
            page = page + + "_" + lang + ".html";
        }
        let response = await fetch(page);
        let html = await response.text();
        e.innerHTML = html;
        e.removeAttribute(BIND_HTML);
        processHtmlTemplate(e);
    });

    processHtmlTemplate(document.body);
    


}

function getLang() {
    let lang = getQuery("lang");
    let lsLang = localStorage.getItem("lang");
    if (!lang && lsLang) return lsLang;
    if (!lang) {
        lang = navigator.language.toUpperCase();
        let langs = lang.split("-");
        if (langs.length > 1) {
            lang = langs[1];
        } else lang = lang[0];
    } else {
        lang = lang.toUpperCase();
    }
    if (lang != lsLang) {
        localStorage.setItem("lang", lang);
    }
    return lang;
}
var lang = getLang();

var eBuilding = document.getElementById("building");
var com = null;
var container = document.getElementById("container");


var enav;
var elang;


document.addEventListener('DOMContentLoaded', async () => {  
    var lang2 = navigator.language;
    console.log("navigator.language:" + lang2);
  
    enav = document.getElementById("dvnav");
    elang = enav.querySelector(".lang");
    var XyConfig = null;
    let strConfig = localStorage.getItem("config");
    let needUpdate = true;
    if (strConfig) {
        try {
            XyConfig = JSON.parse(strConfig);
            let lastUpdate = XyConfig.lastUpdate;
            if (Date.now() - lastUpdate < 600000) { //小于10分钟不用更新
                needUpdate = false;
            }
        } catch (e) {
        }
    }
    if (needUpdate) {
        let langResponse = await fetch("/docs/lang/langs.json");
        XyConfig = await langResponse.json();
        XyConfig.lastUpdate = Date.now();
        localStorage.setItem("config", JSON.stringify(XyConfig));
    }
    let foundLang = false;
    for (let i = 0; i < XyConfig.Langs.length; i++) {
        let nav = XyConfig.Langs[i];
        if (nav.Name) {
            var el = document.createElement("a");
            el.setAttribute("class", "navbar-item");
            el.innerHTML = nav.RealName;
            el.setAttribute("code", nav.Name);
            if (nav.Name === lang) foundLang = true;
            elang.appendChild(el);
            el.onclick = function () {
                let code = this.getAttribute("code");
                localStorage.setItem("lang", code);
                location.href = location.href + location.href.indexOf('?') > 0 ? "&" : "?" + "lang=" + code;
            };
        }
    }


    const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
    $navbarBurgers.forEach(el => {
        el.addEventListener('click', () => {
            const target = el.dataset.target;
            const $target = document.getElementById(target);
            el.classList.toggle('is-active');
            $target.classList.toggle('is-active');

        });
    });

    if (!foundLang) {
        lang = XyConfig.Lang;
    }

    let response = await fetch("/docs/lang/" + lang + "/public.json");
    com = await response.json();
    let path = location.pathname.replace(/\//g, "-").replace(/\.html/g, "");
    document.querySelectorAll("a").forEach(a => {
        let href = a.getAttribute("href");
        if (href) {
            try {
                a.setAttribute("href", href.replace("\{lang\}", lang));
            } catch(e) {
                console.error(e,href);
            }
        }
    });
  

    loadData();

});

