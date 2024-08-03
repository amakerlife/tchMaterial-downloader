// ==UserScript==
// @name         国家中小学智慧教育平台电子课本下载
// @namespace    https://github.com/amakerlife
// @version      1.2.2
// @description  在国家中小学智慧教育平台网站中添加电子课本下载按钮，免登录下载电子课本
// @author       Makerlife
// @match        https://*.smartedu.cn/tchMaterial/detail*
// @match        https://*.smartedu.cn/elecedu/detail*
// @match        https://www.zxx.edu.cn/tchMaterial/detail*
// @icon         https://basic.smartedu.cn/favicon.ico
// @license      MIT
// @grant        GM_download
// @grant        GM_registerMenuCommand
// @compatible   Chrome
// @compatible   Firefox
// @compatible   Edge
// @compatible   Safari
// @require      https://greasyfork.org/scripts/425166-elegant-alert-%E5%BA%93/code/elegant%20alert()%E5%BA%93.js?version=922763
// ==/UserScript==
(function() {
    'use strict';
    var checkUrls = async function(urls,id,fileName) {
        for (let url of urls) {
            try {
                let response = await fetch(url, { method: 'HEAD' });
                if (response.status === 200) {
                    localStorage.setItem(`validUrl_${id}`, url);
                    GM_download({
                        url: url,
                        name: `${fileName}.pdf`,
                    })
                    return;
                }
            } catch (error) {
                console.error(`Failed to fetch ${url}:`, error);
            }
        }
        alert('All URLs are invalid!');
    };
    var main = function(){
        var url = window.location.href;
        var regex = /[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/g;
        var match = regex.exec(url);
        if (match) {
            var id = match[0];
            console.log(`ContentID: ${id}`);
            var filNameElement = document.querySelector("span.fish-breadcrumb-link")
            var fileName = filNameElement?filNameElement.innerText:"电子课本"
            var savedUrl = localStorage.getItem(`validUrl_${id}`);
            if (savedUrl) {
                console.log(`Using saved URL: ${savedUrl}`);
                GM_download({
                    url: savedUrl,
                    name: `${fileName}.pdf`,
                })
                //window.location.assign(savedUrl);
                return;
            }

            var urls = [
                `https://r1-ndr.ykt.cbern.com.cn/edu_product/esp/assets_document/${id}.pkg/pdf.pdf`,
                `https://r1-ndr.ykt.cbern.com.cn/edu_product/esp/assets/${id}.pkg/pdf.pdf`,
                `https://r2-ndr.ykt.cbern.com.cn/edu_product/esp/assets_document/${id}.pkg/pdf.pdf`,
                `https://r2-ndr.ykt.cbern.com.cn/edu_product/esp/assets/${id}.pkg/pdf.pdf`,
                `https://r3-ndr.ykt.cbern.com.cn/edu_product/esp/assets_document/${id}.pkg/pdf.pdf`,
                `https://r3-ndr.ykt.cbern.com.cn/edu_product/esp/assets/${id}.pkg/pdf.pdf`
    ];
            checkUrls(urls,id,fileName);
        } else {
            console.log("No ContentID Found!");
        }
    }
    var init = function(){
    let init_interval = setInterval(function(){
        let filNameElement = document.querySelector("span.fish-breadcrumb-link")
        if(filNameElement){
            clearInterval(init_interval)
            new ElegantAlertBox("正在解析，即将开始下载")
            main()
        }
    },500)
    }
     GM_registerMenuCommand(`【下载电子课本】`,init)

    })();
