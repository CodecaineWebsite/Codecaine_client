import { ref } from 'vue'
import { defineStore } from 'pinia'
import api from '../config/api'

export const useWorkStore = defineStore('work', () => {
  const workTemplate = {
    id: null,
    userId: null,
    userName: null,
    title: "",
    description: "",
    html: "",
    css: "",
    javascript: "",
    htmlPreprocessor: "none", // or "pug", "slim"
    cssPreprocessor: "none",  // or "sass", "scss"
    jsPreprocessor: "none",   // or "typescript"
    links:[],
    cdns: [], 
    viewsCount: "",
    viewMode: "center",
    isAutoSave: true,
    isAutoPreview: true,
    isPrivate: false,
    tags:[],
  }
  const currentId = ref('');
  const works = ref([])
  const updateCDNs = (newCDNs) => {
    currentWork.value.cdns = newCDNs
  }
  const updateLinks = (newLinks) => {
  currentWork.value.links = newLinks
  }
  const updateTags = (newTags) => {
  currentWork.value.tags = newTags
  }
  const currentWork = ref(workTemplate)
  const handleInitWork = (user) => {
    currentWork.value = {
      ...currentWork.value,
      ...user
    }
  }

  // 改變currentId function
  const handleCurrentIdChange = async (id) => {
    if (!id) {
      currentId.value = "";
      currentWork.value = workTemplate;
      return;
    }
  
    currentId.value = id;
  
    try {
      const data = await fetchWorkFromId(id);

      api.put(`/api/pens/${id}/view`).catch((err) => {
        console.warn('Failed to increase views count:', err);
      });

      const { html_code, css_code, js_code, username, user_id, is_pro, is_private, is_autosave, is_autopreview, resources_js, resources_css, tags, ...rest } = data;

      currentWork.value = {
        ...rest,
        userName: data.username,
        userId: data.user_id,
        isPro: data.is_pro,
        isPrivate: data.is_private,
        html: data.html_code,
        css: data.css_code,
        javascript: data.js_code,
        htmlPreprocessor: data.html_preprocessor?.trim() || "none",
        cssPreprocessor: data.css_preprocessor?.trim() || "none",
        jsPreprocessor: data.js_preprocessor?.trim() || "none",
        isAutoSave: data.is_autosave,
        isAutoPreview: data.is_autopreview,
        cdns: Array.isArray(data.resources_js) ? data.resources_js : [],
        links: Array.isArray(data.resources_css) ? data.resources_css : [],
        tags: Array.isArray(data.tags) ? data.tags : [],
      };
    } catch (err) {
      console.error('Failed to fetch work by ID:', err);
      // 可加入錯誤處理
    }
  };
  
  // 更新CurrentCode 
  const autoSaveTimeout = ref(null);
  const updateCurrentCode = (language, newCode) => {
    if (!currentWork.value) return;
    currentWork.value[language] = newCode;
    if (currentWork.value.isAutoSave) {
      // 清掉前一個 debounce
      if (autoSaveTimeout.value) {
        clearTimeout(autoSaveTimeout.value);
      }
    }
  };

  // 開關自動存檔狀態
  const toggleAutoSave = () => {
    currentWork.value.isAutoSave = !currentWork.value.isAutoSave
  }
  // 開關自動更新狀態
  const toggleAutoPreview = () => {
    currentWork.value.isAutoPreview = !currentWork.value.isAutoPreview
  }

  const SASS_CDN = 'https://unpkg.com/sass.js@0.11.1/dist/sass.sync.umd.js';

  let sassLoadPromise = null;
  async function loadSass() {
    if (window.Sass) return;
    if (sassLoadPromise) return sassLoadPromise;

    console.log('[Load Sass] Start loading');

    sassLoadPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = SASS_CDN;
      script.onload = () => {
        console.log('[Load Sass] Script loaded');

        // 保險一點確認 Sass 被註冊
        if (!window.Sass && typeof Sass !== 'undefined') {
          window.Sass = Sass;
          console.log(typeof window.Sass); // ✅ 應該是 "function"

        }

        const waitForSass = () => {
          if (window.Sass) {
            console.log('[Load Sass] Sass is available');
            resolve();
          } else {
            setTimeout(waitForSass, 30);
          }
        };
        waitForSass();
      };
      script.onerror = () => {
        console.error('[Load Sass] Load failed');
        reject(new Error('Failed to load Sass'));
      };
      document.body.appendChild(script);
    });

    return sassLoadPromise;
  }


  
  // CSS 編譯器函式（支援 sass/scss，未來可擴展）
  async function compileCSS(code, preprocessor) {
    if (preprocessor === 'scss' || preprocessor === 'sass') {
      try {
        await loadSass(); // 載入 CDN
        const sass = new window.Sass();

        return await new Promise((resolve, reject) => {
          sass.compile(code, result => {
            if (result.status === 0) {
              resolve(result.text);
            } else {
              console.error('[Sass Compile Error]', result);
              reject(new Error(result.formatted || result.message));
            }
          }, {
            indentedSyntax: preprocessor === 'sass'
          });
        });
      } catch (err) {
        console.error('[Sass Exception]', err);
        return `body::before {
          content: 'Sass Error: ${err.message.replace(/'/g, "\\'")}';
          color: red;
          white-space: pre;
        }`;
      }
    }

    return code; // 非 sass/scss，原樣回傳
  }


  // JS 編譯器函式（未實作，保留擴充）
async function compileJS(code, preprocessor) {
  // TODO: 未來可加入 typescript、babel 等編譯流程
  return code;
}

// HTML 編譯器函式（未實作，保留擴充）
function compileHTML(code, preprocessor) {
  // TODO: 例如 pug、slim 等預處理器可放這
  return code;
}


  // 更新作品Preview
  // const updatePreviewSrc = () => {
  //   const rawJS = currentWork.value.javascript + '\n//# sourceURL=user-code.js';
  //   const safeJS = rawJS.replace(/<\/script>/gi, '<\\/script>');
  //   const cssCode = currentWork.value.css;
  //   const htmlCode = currentWork.value.html;
  //   const cdnTags = (currentWork.value.cdns || []).map(url => `<script src="${url}"></script>`).join('\n')
  //   const linkTags = (currentWork.value.links || []).map(url => `<link rel="stylesheet" href="${url}">`).join('\n')
  
  //   const previewData = `
  //     <!DOCTYPE html>
  //     <html lang="en">
  //     <head>
  //       <meta charset="UTF-8">
  //       <meta http-equiv="Content-Security-Policy" content="
  //         default-src 'self';
  //         script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: https:;
  //         style-src 'self' 'unsafe-inline' https:;
  //         img-src 'self' data: blob: https:;
  //         font-src 'self' https: data:;
  //         connect-src 'self' https:;
  //         frame-src https:;
  //       ">
  //       ${cdnTags}
  //       ${linkTags}
  //       <style>
  //         body {
  //           background-color: white;
  //           margin: 0;
  //         }
  //         ${cssCode}
  //       </style>
  //       <script type="module">
  //         const originalConsole = {
  //           log: console.log,
  //           error: console.error,
  //           warn: console.warn,
  //           info: console.info
  //         };
  
  //         ['log', 'error', 'warn', 'info'].forEach(method => {
  //           console[method] = (...args) => {
  //             window.parent.postMessage({
  //               type: 'log',
  //               message: args.map(arg =>
  //                 typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
  //               ).join(' '),
  //               level: method
  //             }, '*');
  //             originalConsole[method](...args);
  //           };
  //         });
  
  //         window.onerror = function(message, source, lineno, colno, error) {
  //           const errorMsg = error
  //             ? \`\${error.name}: \${error.message}\`
  //             : message;
  //           window.parent.postMessage({
  //             type: 'log',
  //             message: \`\${errorMsg}\\nSource: \${source}\\nLine: \${lineno}, Column: \${colno}\`,
  //             level: 'error'
  //           }, '*');
  //           return true;
  //         };
  
  //         window.addEventListener('unhandledrejection', function(event) {
  //           window.parent.postMessage({
  //             type: 'log',
  //             message: 'Unhandled Promise rejection: ' + (event.reason?.stack || event.reason),
  //             level: 'error'
  //           }, '*');
  //         });
  
  //         const code = ${JSON.stringify(safeJS)};
  //         const blob = new Blob([code], { type: 'application/javascript' });
  //         const blobUrl = URL.createObjectURL(blob);
  
  //         const script = document.createElement('script');
  //         script.type = 'module';
  //         script.src = blobUrl;
  //         script.onload = () => URL.revokeObjectURL(blobUrl);
  //         script.onerror = () => {
  //           window.parent.postMessage({
  //             type: 'log',
  //             message: 'Script loading error',
  //             level: 'error'
  //           }, '*');
  //         };
  
  //         document.head.appendChild(script);
  //       <\/script>
  //     </head>
  //     <body>
  //       ${htmlCode}
  //     </body>
  //     </html>
  //   `.trim();
  
  //   const blob = new Blob([previewData], { type: 'text/html;charset=utf-8' });
  //   const blobUrl = URL.createObjectURL(blob);
  //   if (window.currentPreviewBlob) {
  //     URL.revokeObjectURL(window.currentPreviewBlob);
  //   }
  //   window.currentPreviewBlob = blobUrl;
  //   return blobUrl;
  // };
  const updatePreviewSrc = async () => {
    console.log('[CSS Preprocessor]', currentWork.value.cssPreprocessor);
    
    const htmlCode = currentWork.value.html;
    const cssCode = currentWork.value.css;
    const rawJS = currentWork.value.javascript + '\n//# sourceURL=user-code.js';
    const safeJS = rawJS.replace(/<\/script>/gi, '<\\/script>');
    const compiledCSS = await compileCSS(currentWork.value.css, currentWork.value.cssPreprocessor || 'none');


    console.log('[Compiled CSS]', compiledCSS);
  const cssPreprocessor = currentWork.value.cssPreprocessor || 'none';
  const jsPreprocessor = currentWork.value.jsPreprocessor || 'none';

  const cdnTags = (currentWork.value.cdns || []).map(url => `<script src="${url}"></script>`).join('\n');
  const linkTags = (currentWork.value.links || []).map(url => `<link rel="stylesheet" href="${url}">`).join('\n');

  // 1️⃣ 處理 CSS 編譯（支援 scss/sass）
  


  const previewData = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="Content-Security-Policy" content="
        default-src 'self';
        script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: https:;
        style-src 'self' 'unsafe-inline' https:;
        img-src 'self' data: blob: https:;
        font-src 'self' https: data:;
        connect-src 'self' https:;
        frame-src https:;
      ">
      ${cdnTags}
      ${linkTags}
      <style id="user-style">${compiledCSS}</style>
      <style>
        body {
          background-color: white;
          margin: 0;
        }
      </style>
      <script type="module">
        const originalConsole = {
          log: console.log,
          error: console.error,
          warn: console.warn,
          info: console.info
        };

        ['log', 'error', 'warn', 'info'].forEach(method => {
          console[method] = (...args) => {
            window.parent.postMessage({
              type: 'log',
              message: args.map(arg =>
                typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
              ).join(' '),
              level: method
            }, '*');
            originalConsole[method](...args);
          };
        });

        window.onerror = function(message, source, lineno, colno, error) {
          const errorMsg = error
            ? \`\${error.name}: \${error.message}\`
            : message;
          window.parent.postMessage({
            type: 'log',
            message: \`\${errorMsg}\\nSource: \${source}\\nLine: \${lineno}, Column: \${colno}\`,
            level: 'error'
          }, '*');
          return true;
        };

        window.addEventListener('unhandledrejection', function(event) {
          window.parent.postMessage({
            type: 'log',
            message: 'Unhandled Promise rejection: ' + (event.reason?.stack || event.reason),
            level: 'error'
          }, '*');
        });

        const code = ${JSON.stringify(safeJS)};
        const blob = new Blob([code], { type: 'application/javascript' });
        const blobUrl = URL.createObjectURL(blob);

        const script = document.createElement('script');
        script.type = 'module';
        script.src = blobUrl;
        script.onload = () => URL.revokeObjectURL(blobUrl);
        script.onerror = () => {
          window.parent.postMessage({
            type: 'log',
            message: 'Script loading error',
            level: 'error'
          }, '*');
        };

        document.head.appendChild(script);
      <\/script>
    </head>
    <body>
      ${htmlCode}
    </body>
    </html>
  `.trim();

  // 3️⃣ 產出 Blob 預覽頁面
  const blob = new Blob([previewData], { type: 'text/html;charset=utf-8' });
  const blobUrl = URL.createObjectURL(blob);
  if (window.currentPreviewBlob) {
    URL.revokeObjectURL(window.currentPreviewBlob);
  }
  window.currentPreviewBlob = blobUrl;
  return blobUrl;
};

  
  const fetchWorks = async () => {
    try {
      const res = await api.get(`/api/pens`);
      works.value = res.data;
    } catch (err) {
      console.error('Failed to fetch works', err);
    }
  };

  const fetchWorkFromId = async (id) => {
    try {
      const res = await api.get(`/api/pens/${id}`);
      return res.data;
    } catch (err) {
      console.error('Failed to fetch work', err);
    }
  };

  const createNewWork = async (newWorkData) => {
    try {
    const payload = {
      title: newWorkData.title || '',
      description: newWorkData.description || '',
      html_code: newWorkData.html || '',
      css_code: newWorkData.css || '',
      js_code: newWorkData.javascript || '',
      html_preprocessor: newWorkData.htmlPreprocessor || "none",
      css_preprocessor: newWorkData.cssPreprocessor || "none",
      js_preprocessor: newWorkData.jsPreprocessor || "none",
      view_mode: newWorkData.view_mode,
      is_autosave: newWorkData.isAutoSave ?? false,
      is_autopreview: newWorkData.isAutoPreview ?? true,
      resources_css: newWorkData.links || [],
      resources_js: newWorkData.cdns || [],
      tags: newWorkData.tags || [],
    };
    const res = await api.post('/api/pens', payload);
    const createdWork = res.data.data;
    works.value.unshift(res.data.data);
    currentId.value = res.data.data.id;
    currentWork.value.id = res.data.data.id;
    console.log('Work created successfully');
    return createdWork;
  } catch (err) {
    console.error('Failed to create work', err);
    return null;
  }
  };

  const saveCurrentWork = async () => {
    try {
      const payload = {
        title: currentWork.value.title,
        description: currentWork.value.description,
        html_code: currentWork.value.html,
        css_code: currentWork.value.css,
        js_code: currentWork.value.javascript,
        html_preprocessor: currentWork.value.htmlPreprocessor || '',
        css_preprocessor: currentWork.value.cssPreprocessor || '',
        js_preprocessor: currentWork.value.jsPreprocessor || '',
        view_mode: currentWork.value.view_mode,
        is_autosave: currentWork.value.isAutoSave ?? false,
        is_autopreview: currentWork.value.isAutoPreview ?? true,
        resources_css: currentWork.value.links || [],
        resources_js: currentWork.value.cdns || [],
        tags: currentWork.value.tags || [],
      };
      await api.put(`/api/pens/${currentId.value}`, payload);
      currentWork.value.lastSavedTime = new Date();
      console.log('Work saved successfully');
      console.log("要送出的資料:", payload)

      return true;
    } catch (err) {
      console.error('Failed to save work', err);
      return false;
    }
  };
  
  const moveToTrash = async (id) => {
  try {
    const res = await api.put(`/api/pens/${id}/trash`);
    const { data } = res;
    if (data?.data) {
      currentWork.value.is_trash = true;
      currentWork.value.deleted_at = new Date();
      return true;
    } else {
      console.warn('API responded without expected data:', res.data);
      return false;
    }
  } catch (err) {
    console.error('Failed to move work to trash', err);
    throw err;
  }
};

  const markAsDeleted = async (id) => {
    try {
      await api.put(`/api/pens/${id}/delete`);
      currentWork.value.is_deleted = true;
      console.log('Work deleted');
    } catch (err) {
      console.error('Failed to delete this work', err);
      throw err;
    }
  };

  const deletePenPermanently = async (id) => {
    try {
      const res = await api.delete(`/api/pens/${id}`);
      console.log('Work permanently deleted');
      return res.data;
    } catch (err) {
      console.error('Failed to permanently delete work', err);
      throw err;
    }
  };

  return { 
    works,
    currentWork,
    currentId,
    handleInitWork,
    handleCurrentIdChange,
    updateCurrentCode,
    toggleAutoSave,
    toggleAutoPreview,
    updatePreviewSrc,
    updateCDNs,
    updateLinks,
    updateTags,
    fetchWorks,
    fetchWorkFromId,
    createNewWork,
    saveCurrentWork,
    moveToTrash,
    markAsDeleted,
    deletePenPermanently,
  }
})
