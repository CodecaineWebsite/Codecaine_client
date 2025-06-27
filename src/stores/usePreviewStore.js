import { defineStore } from 'pinia';
import { ref } from 'vue';

export const usePreviewStore = defineStore('preview', () => {
  // 設定 iframe 元素
  const iframeEl = ref(null)

  function setIframeEl(el) {
    iframeEl.value = el
  }

  const sendPreviewCode = (work) => {
    if (!iframeEl.value || !iframeEl.value.contentWindow) return;
  
    // 濾除非字串的元素
    const cdns = Array.isArray(work.cdns) ? work.cdns.filter(i => typeof i === 'string') : [];
    const links = Array.isArray(work.links) ? work.links.filter(i => typeof i === 'string') : [];
  
    // 直接用 JSON 序列化防止 clone 錯誤
    const payload = JSON.parse(JSON.stringify({
      html: work.html || '',
      css: work.css || '',
      javascript: work.javascript || '',
      htmlClass: work.htmlClass || '',
      headStuff: work.headStuff || '',
      cdns,
      links,
    }));
  
    iframeEl.value.contentWindow.postMessage({
      type: 'render',
      payload,
    }, '*');
  }

  return { 
    setIframeEl,
    sendPreviewCode
  };
});