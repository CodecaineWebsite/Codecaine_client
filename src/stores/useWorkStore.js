import { ref } from 'vue'
import { defineStore } from 'pinia'
import api from '../config/api'

export const useWorkStore = defineStore('work', () => {
  const workTemplate = {
    id: null,
    title: "",
    description: "",
    html: "",
    css: "",
    javascript: "",
    links:[],
    cdns: [], 
    view_mode: "center",
    isAutoSave: true,
    isAutoPreview: true,
    is_private: false,
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


  const currentWork = ref(workTemplate)

  // 改變currentId function
  const handleCurrentIdChange = async(id) => {
    if(id) {
      currentId.value = id
      const data = await fetchWorkFromId(id)
      currentWork.value = {
        ...data,
        html: data.html_code,
        css: data.css_code,
        javascript: data.js_code,
        isAutoSave: data.is_autosave,
        isAutoPreview: data.is_autopreview,
        cdns: data.resources_js || [],
        links: data.resources_css || []
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

      // 設定新的 debounce
      // autoSaveTimeout.value = setTimeout(() => {
      //   saveCurrentWork();
      // }, 1000); // 自動儲存延遲 1 秒，可調整
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
    const jsCode = currentWork.value.javascript + '\n//# sourceURL=user-code.js';
    const cssCode = currentWork.value.css;
    const htmlCode = currentWork.value.html;
    const cdnTags = (currentWork.value.cdns || []).map(url => `<script src="${url}"><\/script>`).join('\n')
    const linkTags = (currentWork.value.links || []).map(url => `<link rel="stylesheet" href="${url}"><\/link>`).join('\n')
    const previewData = `
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
    return previewData
  };

  const fetchWorks = async () => {
    try {
      const res = await api.get(`/api/pens`);
      works.value = res.data;
      
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
    const payload = {
      title: newWorkData.title || '',
      description: newWorkData.description || '',
      html_code: newWorkData.html || '',
      css_code: newWorkData.css || '',
      js_code: newWorkData.javascript || '',
      view_mode: newWorkData.view_mode,
      is_autosave: newWorkData.isAutoSave ?? false,
      is_autopreview: newWorkData.isAutoPreview ?? true,
      resources_css: newWorkData.links || [],
      resources_js: newWorkData.cdns || [],
      tags: newWorkData.tags || [],
    };

    const res = await api.post('/api/pens', payload);
    const createdWork = res.data;

    works.value.unshift(res.data);
    currentId.value = res.data.id;
    currentWork.value.id = res.data.id;

    console.log('作品建立成功');
      return createdWork;
    } catch (err) {
      console.error('作品建立失敗', err);
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
        view_mode: currentWork.value.view_mode,
        is_autosave: currentWork.value.isAutoSave ?? false,
        is_autopreview: currentWork.value.isAutoPreview ?? true,
        resources_css: currentWork.value.links || [],
        resources_js: currentWork.value.cdns || [],
        tags: currentWork.value.tags || [],
      };
      const res = await api.put(`/api/pens/${currentId.value}`, payload);
      currentWork.value.lastSavedTime = new Date();
      console.log('儲存成功');
    } catch (err) {
      console.error('儲存失敗', err);
    }
  };
  
  const moveToTrash = async (id) => {
  try {
    const res = await api.put(`/api/pens/${id}/trash`);
    
    if (res.data?.data) {
      currentWork.value.is_trash = true;
      currentWork.value.deleted_at = new Date();
      return true;
    } else {
      console.warn('API 回傳失敗結果：', res.data);
      return false;
    }
  } catch (err) {
    console.error('丟入垃圾桶失敗', err);
    throw err;
  }
};

  const markAsDeleted = async (id) => {
    try {
      const res = await api.put(`/api/pens/${id}/delete`);
      currentWork.value.is_deleted = true;
    } catch (err) {
      console.error('標記刪除失敗', err);
      throw err;
    }
  };

  const deletePenPermanently = async (id) => {
    try {
      const res = await api.delete(`/api/pens/${id}`);
      return res.data;
    } catch (err) {
      console.error('永久刪除失敗', err);
      throw err;
    }
  };

  return { 
    works,
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
    createNewWork,
    saveCurrentWork,
    moveToTrash,
    markAsDeleted,
    deletePenPermanently,
  }
})
