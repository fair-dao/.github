const BIND_IF = "data-bind-if";
const BIND_JSON = "bind-json";
const BIND_HTML = "bind-html";
const BIND_HTML_LOADED = "bind-html-loaded";
const BIND = "data-bind";
const BIND_LANG = "data-bind-lang";
const BIND_FOR = "data-bind-for"; //循环

// 公共变量
var com = null;

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
    var script = document.createElement("script"),
        fn = callback || function (state) { };
    script.type = "text/javascript";

    if (script.readyState) {
        script.onreadystatechange = function () {
            if (script.readyState == "loaded" || script.readyState == "complete") {
                script.onreadystatechange = null;

                fn("ok");
            }
        };
    } else {
        script.onload = function () {
            fn("ok");
        };
        script.onerror = function () {
            fn("error");
        };
    }
    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
}

function translate(key, json, item) {
    if (typeof key === "undefined" || key === null || key === "") return "";
    var val = "";
    try {
        val = eval(key);
    } catch (e) { }

    if (typeof val === "undefined") return "";
    return val;
}

function processHtmlTemplate(element) {
    element.querySelectorAll("[" + BIND_JSON + "]").forEach(async (e) => {
        let page = e.getAttribute(BIND_JSON);
        if (!page.endsWith(".json")) {
            page = "/pages/" + lang + "/" + page + ".json";
            console.log("page:", page);
        }
        let response = await fetch(page);
        let json = await response.json();
        processBindTemplate(e, json);
    });    
    processBindTemplate(element);

    element.querySelectorAll(".tabs").forEach((e) => {
        let contents = e.querySelectorAll("li");
        contents.forEach((e2, index) => {
            e2.onclick = function () {
                let tab = this.parentNode.querySelector(".is-active");
                if (tab) tab.classList.remove("is-active");
                this.classList.add("is-active");
                var contents =
                    this.parentNode.parentNode.parentNode.querySelectorAll(
                        ".tabs-content>div"
                    );
                for (let i = 0; i < contents.length; i++) {
                    let cur = contents[i];
                    if (i != index) {
                        if (cur.classList.contains("is-active"))
                            cur.classList.remove("is-active");
                    } else cur.classList.add("is-active");
                }
            };
        });
    });

    element.querySelectorAll("a").forEach((a) => {
        let href = a.getAttribute("href");
        if (href) {
            try {
                if (href.startsWith("pages:")) {
                    href = "/pages/" + lang + "/" + href.substring(6) + ".html";
                    a.setAttribute("href", href);
                }
            } catch (e) {
                console.error(e, href);
            }
        }
    });
}

function processBindTemplate(element, json) {
    element.querySelectorAll("[" + BIND_FOR + "]").forEach((e) => {
        let html = e.innerHTML;
        let key = e.getAttribute(BIND_FOR);
        if (!json && !key.startsWith("com.")){
            return;
        }
        let items = translate(key, json);
        let newHtml = "";
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            item.index = i;
            var reg = new RegExp("{-[^}]+?-}", "g");
            let itemHtml = html.replace(reg, function (s) {
                if (s.startsWith("{-item.")){
                    s = s.replace(/\-\}/g, "")
                        .replace(/\{\-/g, "");
                    let val = eval(s);
                    if (typeof val === "undefined") return "";
                    return val;
                }else return s;
            });
            newHtml += itemHtml;
        }
        e.innerHTML = newHtml;
        e.removeAttribute(BIND_FOR);
        processBind(e, json, item);
    });
    processBind(element, json);
}

function processBind(element, json, item) {
    element.querySelectorAll("[" + BIND_IF + "]").forEach((e) => {
        let key = e.getAttribute(BIND_IF);
         if (!json && !key.startsWith("com.")){
            return;
        }
        let val = translate(key, json, item);
        if (!val) {
            e.parentNode.removeChild(e);
        } else e.removeAttribute(BIND_IF);
    });

    element.querySelectorAll("[" + BIND + "]").forEach((e) => {
        let key = e.getAttribute(BIND);
         if (!json && !key.startsWith("com.")){
            return;
        }
        e.innerHTML = translate(key, json, item);
        e.removeAttribute(BIND);
    });
}

function loadData() {
    // <div bind-html="page/header.html"></div> or <div bind-html="page/header"></div> (page/ZH/header.html)
    document.querySelectorAll("[" + BIND_HTML + "]").forEach(async (e) => {
        let page = e.getAttribute(BIND_HTML);
        if (!page.endsWith(".html")) {
            page = "/pages/" + lang + "/" + page + ".html";
        }
        let response = await fetch(page);
        let html = await response.text();
        e.innerHTML = html;
        let loaded = e.getAttribute(BIND_HTML_LOADED);
        if (loaded) {
            try {
                eval(loaded);
            } catch (e1) {
                console.log(e1);
            }
        }

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
        let langs = lang.split("-");       
        lang = langs[0];   
    }
    lang = lang.toLowerCase();    
    if (lang != lsLang) {
        localStorage.setItem("lang", lang);
    }
    return lang;
}
var lang = getLang();

var eBuilding = document.getElementById("building");
var container = document.getElementById("container");

var XyConfig = null;

function headerLoaded(e) {
    var elang = e.querySelector(".lang");
    for (let i = 0; i < XyConfig.Langs.length; i++) {
        let nav = XyConfig.Langs[i];
        if (nav.Name) {
            var el = document.createElement("a");
            el.setAttribute("class", "navbar-item");
            el.innerHTML = nav.RealName;
            el.setAttribute("code", nav.Name);
            elang.appendChild(el);
            el.onclick = function () {
                let code = this.getAttribute("code");
                localStorage.setItem("lang", code);
                let href = location.href;
                if (href.includes("#")){
                    href = href.split("#")[0];
                }
                let oldLangKey = "pages/" + lang + "/";
                if (href.includes(oldLangKey)) {
                    href = href.replace(oldLangKey, "pages/" + code + "/");
                } else {
                    href = href.replace(/([?&])lang=[^&]*/, "$1lang=" + code);
                    if (!href.includes("lang=")) {
                        href += (href.includes("?") ? "&" : "?") + "lang=" + code;
                    }
                }
                location.href = href;
            };
        }
    }

    const $navbarBurgers = Array.prototype.slice.call(
        document.querySelectorAll(".navbar-burger"),
        0
    );
    $navbarBurgers.forEach((el) => {
        el.addEventListener("click", () => {
            const target = el.dataset.target;
            const $target = document.getElementById(target);
            el.classList.toggle("is-active");
            $target.classList.toggle("is-active");
        });
    });
}
document.addEventListener("DOMContentLoaded", async () => {
    var lang2 = navigator.language;
    console.log("navigator.language:" + lang2);

    let strConfig = localStorage.getItem("config");
    let needUpdate = true;
    if (strConfig) {
        try {
            XyConfig = JSON.parse(strConfig);
            let lastUpdate = XyConfig.lastUpdate;
            if (Date.now() - lastUpdate < 600000) {
                //小于10分钟不用更新
                needUpdate = false;
            }
        } catch (e) { }
    }
    if (needUpdate) {
        let langResponse = await fetch("/res/langs.json");
        XyConfig = await langResponse.json();
        XyConfig.lastUpdate = Date.now();
        localStorage.setItem("config", JSON.stringify(XyConfig));
    }



    let foundLang = false;
    for (let i = 0; i < XyConfig.Langs.length; i++) {
        let nav = XyConfig.Langs[i];
        if (nav.Name) {
            if (nav.Name === lang) {
                foundLang = true;
                break;
            }
        }
    }
    if (!foundLang) {
        lang = XyConfig.Lang;
    }
    try {
        let response = await fetch("/pages/" + lang + "/public.json");
        com = await response.json();
    } catch(e){     
    }
    if (!com || !com.trading) {
        let response = await fetch("/pages/" + XyConfig.Lang + "/public.json");
        com = await response.json();
    }

    document.body.setAttribute("lang", lang.toLowerCase());
    loadData();
});
