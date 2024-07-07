// ==UserScript==
// @name         国家中小学智慧教育平台电子课本下载
// @namespace    https://github.com/amakerlife
// @version      1.2.0
// @description  在国家中小学智慧教育平台网站中添加电子课本下载按钮，免登录下载电子课本
// @author       Makerlife
// @match        https://*.smartedu.cn/tchMaterial/detail*
// @match        https://*.smartedu.cn/elecedu/detail*
// @match        https://www.zxx.edu.cn/tchMaterial/detail*
// @icon         https://basic.smartedu.cn/favicon.ico
// @license      MIT
// @grant        none
// @compatible   Chrome
// @compatible   Firefox
// @compatible   Edge
// @compatible   Safari
// ==/UserScript==

(function() {
  'use strict';

  var url = window.location.href;
  var regex = /[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/g;
  var match = regex.exec(url);

  if (match) {
    var originalTitle = document.title;
    document.title = `[Redirecting] ${originalTitle}`;
    var id = match[0];
    console.log(`ContentID: ${id}`);

    var urls = [
      `https://r1-ndr.ykt.cbern.com.cn/edu_product/esp/assets_document/${id}.pkg/pdf.pdf`,
      `https://r1-ndr.ykt.cbern.com.cn/edu_product/esp/assets/${id}.pkg/pdf.pdf`,
      `https://r2-ndr.ykt.cbern.com.cn/edu_product/esp/assets_document/${id}.pkg/pdf.pdf`,
      `https://r2-ndr.ykt.cbern.com.cn/edu_product/esp/assets/${id}.pkg/pdf.pdf`,
      `https://r3-ndr.ykt.cbern.com.cn/edu_product/esp/assets_document/${id}.pkg/pdf.pdf`,
      `https://r3-ndr.ykt.cbern.com.cn/edu_product/esp/assets/${id}.pkg/pdf.pdf`
    ];

    var checkUrls = async function(urls) {
      for (let url of urls) {
        try {
          let response = await fetch(url, { method: 'HEAD' });
          if (response.status === 200) {
            window.location.assign(url);
            return;
          }
        } catch (error) {
          console.error(`Failed to fetch ${url}:`, error);
        }
      }
      alert('All URLs are invalid!');
    };

    checkUrls(urls);
  } else {
    console.log("No ContentID Found!");
  }
})();
