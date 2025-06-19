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
    htmlPreprocessor: "", // or "pug", "slim"
    cssPreprocessor: "",  // or "sass", "scss"
    jsPreprocessor: "",   // or "typescript"
    links:[],
    cdns: [], 
    views_count: "",
    view_mode: "center",
    isAutoSave: true,
    isAutoPreview: true,
    isPrivate: false,
    tags:[],
  }
  const currentId = ref('');
  const works = ref([])
  const updateCDNs = (newCDNs) => {
    currentWork.value.resources_js = newCDNs
  }
  const updateLinks = (newLinks) => {
  currentWork.value.resources_css = newLinks
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
  const handleCurrentIdChange = async(id) => {
    if(id) {
      currentId.value = id
      const data = await fetchWorkFromId(id)
      api.put(`/api/pens/${id}/view`).catch(err => {
      console.warn('Failed to increase views count:', err)
    });
      currentWork.value = {
        ...data,
        userName: data.username,
        userId: data.user_id,
        isPro: data.is_pro,
        isPrivate: data.is_private,
        html: data.html_code,
        css: data.css_code,
        javascript: data.js_code,
        htmlPreprocessor: data.html_preprocessor || "none",
        cssPreprocessor: data.css_preprocessor || "none",
        jsPreprocessor: data.js_preprocessor || "none",
        cdns: data.resources_js || [],
        links: data.resources_css || [],
        isAutoSave: data.is_autosave,
        isAutoPreview: data.is_autopreview,
        tags: data.tags || [],
        
      }
    } else {
      currentId.value = ""
      currentWork.value = workTemplate
    }
  }
  // 更新CurrentCode 
  // todo: 改v-model綁定
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
    console.log(currentWork.value.isAutoSave);
  }
  // 開關自動更新狀態
  const toggleAutoPreview = () => {
    currentWork.value.isAutoPreview = !currentWork.value.isAutoPreview
  }
  // 更新作品Preview
  // const updatePreviewSrc = () => {
  //   const { html, css, javascript, cdns, links, htmlPreprocessor, cssPreprocessor, jsPreprocessor } = currentWork.value;

  //   const rawJS = javascript + '\n//# sourceURL=user-code.js';
  //   const safeJS = rawJS.replace(/<\/script>/gi, '<\\/script>');
  //   const escapeScript = (code) => code.replace(/<\/script>/gi, '<\\/script>');
  //   const cdnTags = (cdns || []).map(url => `<script src="${url}"></script>`).join('\n')
  //   const linkTags = (links || []).map(url => `<link rel="stylesheet" href="${url}">`).join('\n')
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
  //         worker-src 'self' blob: https:;
  //       ">
  //       ${cdnTags}
  //       ${linkTags}

  //       ${htmlPreprocessor === 'pug'
  //         ? `<script src="https://unpkg.com/pug@2.0.4/pug.min.js" onload="window.__PUG_READY__ = true;"></script>`
  //         : ''}
  //       ${htmlPreprocessor === 'slim' ? '<script src="https://cdn.jsdelivr.net/npm/slim-js@5.0.10/dist/index.legacy.min.js"></script>' : ''}
  //       ${cssPreprocessor === 'sass' || cssPreprocessor === 'scss' ? '<script src="https://cdn.jsdelivr.net/npm/sass@1.89.2/sass.dart.min.js"></script>' : ''}
  //       ${jsPreprocessor === 'typescript' ? '<script src="https://cdn.jsdelivr.net/npm/typescript@5.8.3/lib/typescript.min.js"></script>' : ''}

  //       <style id="user-style">${cssPreprocessor === 'none' ? css : ''}</style>
  //       <script type="module">
  //         const waitForPug = async () => {
  //           if (${JSON.stringify(htmlPreprocessor)} !== 'pug') return;
  //           console.log('Waiting for pug to load...');
  //           while (!window.__PUG_READY__) {
  //             await new Promise(r => setTimeout(r, 50));
  //           }
  //           console.log('Pug loaded!');
  //         };
  //         console.log("typeof pug:", typeof pug);
          
  //         const preprocess = async () => {
  //           try {
  //             await waitForPug();
  //             // HTML Preprocessor
  //             console.log("htmlPreprocessor:", ${JSON.stringify(htmlPreprocessor)});
  //             console.log("html:", ${JSON.stringify(html)});
  //             console.log("Using HTML preprocessor:", "${htmlPreprocessor}");
  //             console.log("Using CSS preprocessor:", "${cssPreprocessor}");
  //             console.log("Using JS preprocessor:", "${jsPreprocessor}");

  //             ${htmlPreprocessor === 'pug'
  //               ? `document.getElementById("user-html").innerHTML = pug.render(${JSON.stringify(html)});`
  //               : htmlPreprocessor === 'slim'
  //               ? `const { renderSlim } = window.slimWASM;
  //                 const slimResult = await renderSlim(${JSON.stringify(html)});
  //                 document.getElementById("user-html").innerHTML = slimResult;`
  //               : `document.getElementById("user-html").innerHTML = ${JSON.stringify(html)};`
  //             }

  //             // CSS Preprocessor
  //             ${
  //               cssPreprocessor === 'sass' || cssPreprocessor === 'scss'
  //                 ? `Sass.compile(${JSON.stringify(css)}, {
  //                     indentedSyntax: ${cssPreprocessor === 'sass'}
  //                   }, result => {
  //                     if (result.status !== 0) {
  //                       console.error('Sass Error:', result);
  //                       return;
  //                     }
  //                     document.getElementById("user-style").textContent = result.text;
  //                   });`
  //                 : ''
  //             }

              
  //             // JS Preprocessor
  //             let scriptCode = '';
  //             ${
  //               jsPreprocessor === 'typescript'
  //                 ? `scriptCode = ts.transpile(${JSON.stringify(safeJS)});`
  //                 : `scriptCode = ${JSON.stringify(safeJS)};`
  //             }
  //             const blob = new Blob([scriptCode], { type: 'application/javascript' });
  //             const script = document.createElement('script');
  //             script.src = URL.createObjectURL(blob);
  //             script.type = 'text/javascript';
  //             script.onload = () => URL.revokeObjectURL(script.src);
  //             script.onerror = () => {
  //               window.parent.postMessage({
  //                 type: 'log',
  //                 message: 'Script loading error',
  //                 level: 'error'
  //               }, '*');
  //             };
  //             document.body.appendChild(script);
  //           } catch (err) {
  //             console.error('Preprocess error:', err);
  //           }

  //           const originalConsole = {
  //             log: console.log,
  //             error: console.error,
  //             warn: console.warn,
  //             info: console.info
  //           };
    
  //           ['log', 'error', 'warn', 'info'].forEach(method => {
  //             console[method] = (...args) => {
  //               window.parent.postMessage({
  //                 type: 'log',
  //                 message: args.map(arg =>
  //                   typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
  //                 ).join(' '),
  //                 level: method
  //               }, '*');
  //               originalConsole[method](...args);
  //             };
  //           });
    
  //           window.onerror = function(message, source, lineno, colno, error) {
  //             const errorMsg = error
  //               ? \`\${error.name}: \${error.message}\`
  //               : message;
  //             window.parent.postMessage({
  //               type: 'log',
  //               message: \`\${errorMsg}\\nSource: \${source}\\nLine: \${lineno}, Column: \${colno}\`,
  //               level: 'error'
  //             }, '*');
  //             return true;
  //           };
            
  //           window.addEventListener('unhandledrejection', function(event) {
  //             window.parent.postMessage({
  //               type: 'log',
  //               message: 'Unhandled Promise rejection: ' + (event.reason?.stack || event.reason),
  //               level: 'error'
  //               }, '*');
  //             });
  //           };
  //           preprocess();

  //       </script>
  //     </head>
  //     <body>
  //       <div id="user-html"></div>
  //     </body>
  //     </html>
  //   `.trim();

  //   return previewData

  // };
  const updatePreviewSrc = () => {
    const {
      html,
      css,
      javascript,
      cdns,
      links,
      htmlPreprocessor,
      cssPreprocessor,
      jsPreprocessor,
    } = currentWork.value;
  
    const safeJS = (javascript || '') + '\n//# sourceURL=user-code.js';
    const escapeScript = (code) => code.replace(/<\/script>/gi, '<\\/script>');
    const cdnTags = (cdns || []).map(url => `<script src="${url}"></script>`).join('\n');
const linkTags = (links || []).map(url => `<link rel="stylesheet" href="${url}">`).join('\n');

const previewHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  ${cdnTags}
  ${linkTags}
  ${htmlPreprocessor === 'pug' ? `<script src="https://cdn.jsdelivr.net/npm/pug-standalone@3.0.4/pug.min.js"></script>` : ''}
  ${cssPreprocessor === 'sass' || cssPreprocessor === 'scss'
    ? `<script src="https://cdn.jsdelivr.net/npm/sass@1.89.2/sass.dart.min.js"></script>` : ''}
  ${jsPreprocessor === 'typescript'
    ? `<script src="https://cdn.jsdelivr.net/npm/typescript@5.0.0/lib/typescript.min.js"></script>` : ''}
  <style id="user-style">${cssPreprocessor === 'none' ? css : ''}</style>
</head>
<body>
  <div id="user-html">Loading preview...</div>

  <script>
    window.__runPreview__ = async function () {
      const htmlPreprocessor = "${htmlPreprocessor}";
      const cssPreprocessor = "${cssPreprocessor}";
      const jsPreprocessor = "${jsPreprocessor}";
      const html = ${JSON.stringify(html)};
      const css = ${JSON.stringify(css)};
      const js = ${JSON.stringify(escapeScript(safeJS))};

      const waitForLib = async (key) => {
        while (!window[key]) {
          await new Promise(r => setTimeout(r, 50));
        }
      };

      if (htmlPreprocessor === "pug") await waitForLib("pug");
      if (cssPreprocessor === "sass" || cssPreprocessor === "scss") await waitForLib("Sass");
      if (jsPreprocessor === "typescript") await waitForLib("ts");

      try {
        // HTML
        if (htmlPreprocessor === "pug") {
          try {
            document.getElementById("user-html").innerHTML = window.pug.render(html || '');
          } catch(e) {
            document.getElementById("user-html").textContent = "Pug 渲染錯誤: " + e.message;
          }
        } else {
          document.getElementById("user-html").innerHTML = html;
        }

        // CSS
        if (cssPreprocessor === "sass" || cssPreprocessor === "scss") {
          window.Sass.compile(css, {
            indentedSyntax: cssPreprocessor === 'sass'
          }, (result) => {
            if (result.status === 0) {
              document.getElementById("user-style").textContent = result.text;
            } else {
              console.error("Sass Error:", result);
            }
          });
        }

        // JS
        let finalJS = js;
        if (jsPreprocessor === "typescript") {
          finalJS = window.ts.transpile(js);
        }

        // 用 Blob 方式插入 JS
        const blob = new Blob([finalJS], { type: 'application/javascript' });
        const script = document.createElement("script");
        script.src = URL.createObjectURL(blob);
        script.onload = () => URL.revokeObjectURL(script.src);
        script.onerror = () => console.error("JS blob failed to load");
        document.body.appendChild(script);

      } catch (e) {
        console.error("Preview Error:", e);
      }
    };
  </script>

  <script>
    window.addEventListener('load', () => {
      if (typeof window.__runPreview__ === 'function') {
        window.__runPreview__();
      }
    });
  </script>
</body>
</html>
`.trim();

const blob = new Blob([previewHTML], { type: 'text/html' });
return URL.createObjectURL(blob);

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
      htmlPreprocessor: newWorkData.htmlPreprocessor || '',
      cssPreprocessor: newWorkData.cssPreprocessor || '',
      jsPreprocessor: newWorkData.jsPreprocessor || '',
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
        htmlPreprocessor: currentWork.value.htmlPreprocessor || '',
        cssPreprocessor: currentWork.value.cssPreprocessor || '',
        jsPreprocessor: currentWork.value.jsPreprocessor || '',
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
