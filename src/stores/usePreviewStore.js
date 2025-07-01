import { defineStore } from 'pinia';
import { ref } from 'vue';

export const usePreviewStore = defineStore('preview', () => {
  const iframeEl = ref(null)

  function setIframeEl(el) {
    iframeEl.value = el
  }

  const sendAutoPreviewCode = (work) => {
    if (!iframeEl.value || !iframeEl.value.contentWindow) return;
  
    const cdns = Array.isArray(work.cdns) ? work.cdns.filter(i => typeof i === 'string') : [];
    const links = Array.isArray(work.links) ? work.links.filter(i => typeof i === 'string') : [];
  
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

  function sendPreviewCode(iframe, work) {
    if (!iframe || !iframe.contentWindow) return;
  
    const cdns = Array.isArray(work.cdns) ? work.cdns.filter(i => typeof i === 'string') : [];
    const links = Array.isArray(work.links) ? work.links.filter(i => typeof i === 'string') : [];
  
    const payload = JSON.parse(JSON.stringify({
      html: work.html || '',
      css: work.css || '',
      javascript: work.javascript || '',
      htmlClass: work.htmlClass || '',
      headStuff: work.headStuff || '',
      cdns,
      links,
    }));
  
    iframe.contentWindow.postMessage({
      type: 'render',
      payload,
    }, '*');
  }

  return { 
    setIframeEl,
    sendAutoPreviewCode,
    sendPreviewCode
  };
});