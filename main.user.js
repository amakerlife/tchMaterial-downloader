// ==UserScript==
// @name         国家中小学智慧教育平台电子课本下载
// @namespace    https://github.com/amakerlife
// @version      1.1.1
// @description  在国家中小学智慧教育平台网站中添加电子课本下载按钮，免登录下载电子课本
// @author       Makerlife
// @match        https://*.smartedu.cn/tchMaterial/detail*
// @icon         https://basic.smartedu.cn/favicon.ico
// @license      MIT
// @grant        none
// ==/UserScript==
 
const pdfUrlRegExp = /\/pdf.pdf$/;
const originalFetch = window.fetch;
window.fetch = function() {
  return originalFetch.apply(this, arguments).then(response => {
    if (pdfUrlRegExp.test(response.url)) {
      console.log('捕获到 PDF 请求链接：' + response.url);
      localStorage.setItem('pdfUrl', response.url);
    }
    return response;
  });
};
 
 
const downloadBtn = document.createElement('div');
downloadBtn.classList.add('download-btn-wrapper');
downloadBtn.innerHTML = '<a href="#" class="download-link"><span class="download-icon"><i class="fas fa-download"></i></span></a>';
downloadBtn.style.position = 'fixed';
downloadBtn.style.right = '20px';
downloadBtn.style.bottom = '20px';
downloadBtn.style.width = '50px';
downloadBtn.style.height = '50px';
downloadBtn.style.borderRadius = '25px';
downloadBtn.style.backgroundColor = 'blue';
downloadBtn.style.cursor = 'pointer';
downloadBtn.style.color = '#ffffff';
document.body.appendChild(downloadBtn);
const faLink = document.createElement('link');
faLink.rel = 'stylesheet';
faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css';
document.head.appendChild(faLink);
const style = document.createElement('style');
style.textContent = `
.download-link {
  display: inline-block;
  text-decoration: none;
  color: #ffffff;
  font-size: 0;
  line-height: 50px;
}
 
.download-icon {
  display: block;
  font-size: 24px;
  line-height: 50px;
}
 
.download-btn-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}
`;
document.head.appendChild(style);
 
 
downloadBtn.addEventListener('click', function() {
  const pdfUrl = localStorage.getItem('pdfUrl');
  if (pdfUrl) {
    window.open(pdfUrl, '_blank');
  } else {
    console.log('未捕获到 PDF 请求链接');
  }
});
 
document.body.appendChild(downloadBtn);
