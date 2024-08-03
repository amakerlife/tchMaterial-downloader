// ==UserScript==
// @name         国家中小学智慧教育平台电子课本下载
// @namespace    https://github.com/amakerlife
// @version      1.3.0
// @description  在国家中小学智慧教育平台网站中添加电子课本下载按钮，免登录下载电子课本
// @author       Makerlife
// @match        https://*.smartedu.cn/tchMaterial/detail*
// @match        https://*.smartedu.cn/elecedu/detail*
// @match        https://www.zxx.edu.cn/tchMaterial/detail*
// @icon         https://basic.smartedu.cn/favicon.ico
// @license      MIT
// @grant        GM_download
// @compatible   Chrome
// @compatible   Firefox
// @compatible   Edge
// @compatible   Safari
// @require      https://greasyfork.org/scripts/425166-elegant-alert-%E5%BA%93/code/elegant%20alert()%E5%BA%93.js?version=922763
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11
// ==/UserScript==

(function() {
    'use strict';
    var checkUrls = async function(urls, id, fileName) {
        for (let url of urls) {
            try {
                let response = await fetch(url, { method: 'HEAD' });
                if (response.status === 200) {
                    localStorage.setItem(`validUrl_${id}`, url);
                    Swal.fire({
                        title: '下载选项',
                        text: "请选择下载方式",
                        icon: 'question',
                        showCancelButton: true,
                        confirmButtonText: '直接下载',
                        cancelButtonText: '在新标签页中打开'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            GM_download({
                                url: url,
                                name: `${fileName}.pdf`,
                            });
                        } else if (result.dismiss === Swal.DismissReason.cancel) {
                            window.open(url, '_blank');
                        }
                    });
                    return;
                }
            } catch (error) {
                console.error(`Failed to fetch ${url}:`, error);
            }
        }
        alert('All URLs are invalid!');
    };

    var main = function() {
        var url = window.location.href;
        var regex = /[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/g;
        var match = regex.exec(url);
        if (match) {
            var id = match[0];
            console.log(`ContentID: ${id}`);
            var filNameElement = document.querySelector("span.fish-breadcrumb-link");
            var fileName = filNameElement ? filNameElement.innerText : "电子课本";
            var savedUrl = localStorage.getItem(`validUrl_${id}`);
            if (savedUrl) {
                console.log(`Using saved URL: ${savedUrl}`);
                Swal.fire({
                    title: '下载选项',
                    text: "请选择下载方式",
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonText: '直接下载',
                    cancelButtonText: '在新标签页中打开'
                }).then((result) => {
                    if (result.isConfirmed) {
                        GM_download({
                            url: savedUrl,
                            name: `${fileName}.pdf`,
                        });
                    } else if (result.dismiss === Swal.DismissReason.cancel) {
                        window.open(savedUrl, '_blank');
                    }
                });
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
            checkUrls(urls, id, fileName);
        } else {
            console.log("No ContentID Found!");
        }
    };

    let init = setInterval(function() {
        let filNameElement = document.querySelector("span.fish-breadcrumb-link");
        if (filNameElement) {
            clearInterval(init);
            new ElegantAlertBox("正在解析，即将开始下载");
            main();
        }
    }, 1000);
})();
