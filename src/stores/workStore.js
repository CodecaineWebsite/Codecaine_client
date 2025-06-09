import { ref } from 'vue'
import { defineStore } from 'pinia'
import api from '../config/api'
import axios from 'axios'
const URL = "http://localhost:3000"
export const useWorkStore = defineStore('work', () => {
  const workTemplate = {
    title: "",
    description: "",
    html_code: "",
    css_code: "",
    js_code: "",
    resources_css:[],
    resources_js: [], 
    view_mode: "center",
    is_autosave: true,
    is_autopreview: true,
    is_private: false,
    tags:[],
    // title: currentWork.value.title,
    // description: currentWork.value.description || "",
    // html_code: currentWork.value.html,
    // css_code: currentWork.value.css,
    // js_code: currentWork.value.javascript,
    // resources_css: currentWork.value.links,
    // resources_js: currentWork.value.cdns,
    // view_mode: currentWork.value.viewMode,
    // is_autosave: currentWork.value.isAutoSave,
    // is_autopreview: currentWork.value.isAutoPreview,
    // is_private: currentWork.value.isPrivate || false,
    // tags: currentWork.value.tags || []
  }
  const currentId = ref('');
  const works = ref([])

  const updateCDNs = (newCDNs) => {
    currentWork.value.resources_js = newCDNs
  }
  const updateLinks = (newLinks) => {
  currentWork.value.resources_css = newLinks
  }


  const currentWork = ref(null)

  // 改變currentId function
  const handleCurrentIdChange = async(id) => {
    if(id) {
      currentId.value = id
      currentWork.value = await fetchWorkFromId(id)
      
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

      // 設定新的 debounce
      autoSaveTimeout.value = setTimeout(() => {
        saveCurrentWork();
      }, 1000); // 自動儲存延遲 1 秒，可調整
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

  // 更新作品Preview function
  const updatePreviewSrc = () => {
    const jsCode = currentWork.value.js_code + '\n//# sourceURL=user-code.js';
    const cssCode = currentWork.value.css_code;
    const htmlCode = currentWork.value.html_code;
    const cdnTags = (currentWork.value.resources_js || []).map(url => `<script src="${url}"><\/script>`).join('\n')
    const linkTags = (currentWork.value.resources_css || []).map(url => `<link rel="stylesheet" href="${url}"><\/link>`).join('\n')
  
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      ${linkTags}
      <style>${cssCode}</style>
    </head>
    <body>
      ${htmlCode}
      ${cdnTags}
      <script>
        // Override console methods to send logs to parent
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
  
        // Global error handler
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
  
        // Handle unhandled promise rejections
        window.addEventListener('unhandledrejection', function(event) {
          window.parent.postMessage({
            type: 'log',
            message: 'Unhandled Promise rejection: ' + (event.reason?.stack || event.reason),
            level: 'error'
          }, '*');
        });
  
        // Inject user code via Blob script
        const code = ${JSON.stringify(jsCode)};
        const blob = new Blob([code], { type: 'application/javascript' });
        const blobUrl = URL.createObjectURL(blob);
  
        const script = document.createElement('script');
        script.src = blobUrl;
  
        script.onload = () => {
          URL.revokeObjectURL(blobUrl);
        };
  
        script.onerror = () => {
          window.parent.postMessage({
            type: 'log',
            message: 'Script loading error',
            level: 'error'
          }, '*');
        };
  
        document.head.appendChild(script);
      <\/script>
    </body>
    </html>
    `;
  };


  return { 
    currentWork,
    currentId,
    handleCurrentIdChange,
    updateCurrentCode,
    toggleAutoSave,
    toggleAutoPreview,
    updatePreviewSrc,
    updateCDNs,
    updateLinks,
    fetchWorks,
    fetchWorkFromId,
    saveCurrentWork,
    deleteWork,
    createNewWork,
    works
  }
})
  
  
  // todo:
  // fetch取得作品function 未來的works資料取得
  // 儲存作品function
  // 執行作品function
  // 刪除作品function

  // 更新作品Preview function




  const fetchWorks = async () => {
  try {
    const res = await axios.get(`${URL}/api/pens`);
    console.log(res);
    // works.value = res;
    
  } catch (err) {
    console.error('取得作品失敗', err);
  }
};
  const fetchWorkFromId = async (id) => {
  try {
    const res = await api.get(`/api/pens/${id}`);
    return res.data;
    // currentWork.value = res.data;
  } catch (err) {
    console.error('取得作品失敗', err);
  }
};

const createNewWork = async (newWorkData) => {
  try {
    const res = await api.post('/api/pens', newWorkData);
    works.value.push(res.data);
    currentId.value = res.data.id;
    currentWork.value = res.data;
    console.log('作品建立成功');
  } catch (err) {
    console.error('作品建立失敗', err);
  }
};

const saveCurrentWork = async () => {
  try {
    const res = await api.put(`/api/pens/${currentId.value}`, currentWork.value);
    currentWork.value.lastSavedTime = new Date();
    console.log('儲存成功');
  } catch (err) {
    console.error('儲存失敗', err);
  }
};

const deleteWork = async (id) => {
  try {
    await api.delete(`/api/pens/${id}`);
    works.value = works.value.filter(work => work.id !== id);
    if (currentId.value === id) {
      handleCurrentIdChange(null);
    }
    console.log('刪除成功');
  } catch (err) {
    console.error('刪除失敗', err);
  }
};