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
    links:[],
    cdns: [], 
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
    console.log(currentWork.value);
  }

  // 改變currentId function
  const handleCurrentIdChange = async(id) => {
    if(id) {
      currentId.value = id
      const data = await fetchWorkFromId(id)
      currentWork.value = {
        ...data,
        userName: data.username,
        userId: data.user_id,
        isPro: data.is_pro,
        isPrivate: data.is_private,
        html: data.html_code,
        css: data.css_code,
        javascript: data.js_code,
        isAutoSave: data.is_autosave,
        isAutoPreview: data.is_autopreview,
        cdns: data.resources_js || [],
        links: data.resources_css || [],
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
  const updatePreviewSrc = () => {
    const rawJS = currentWork.value.javascript + '\n//# sourceURL=user-code.js';
    const safeJS = rawJS.replace(/<\/script>/gi, '<\\/script>');
    const cssCode = currentWork.value.css;
    const htmlCode = currentWork.value.html;
    const cdnTags = (currentWork.value.cdns || []).map(url => `<script src="${url}"></script>`).join('\n')
    const linkTags = (currentWork.value.links || []).map(url => `<link rel="stylesheet" href="${url}">`).join('\n')
  
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
        <style>
          body {
            background-color: white;
            margin: 0;
          }
          ${cssCode}
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
  
    const blob = new Blob([previewData], { type: 'text/html;charset=utf-8' });
    const blobUrl = URL.createObjectURL(blob);
    if (window.currentPreviewBlob) {
      URL.revokeObjectURL(window.currentPreviewBlob);
    }
    window.currentPreviewBlob = blobUrl;
    return blobUrl;
  };

  const updateCardPreviewSrc = (code) => {
    console.log(code);
    const rawJS = code.javascript + '\n//# sourceURL=user-code.js';
    const safeJS = rawJS.replace(/<\/script>/gi, '<\\/script>');
    const cssCode = code.css;
    const htmlCode = code.html;
    const cdnTags = (code.cdns || []).map(url => `<script src="${url}"></script>`).join('\n')
    const linkTags = (code.links || []).map(url => `<link rel="stylesheet" href="${url}">`).join('\n')
  
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
        <style>
          body {
            background-color: white;
            margin: 0;
          }
          ${cssCode}
        </style>
        <script type="module">
          window.console = {
            log: () => {},
            error: () => {},
            warn: () => {},
            info: () => {}
          };
        
          const code = ${JSON.stringify(safeJS)};
          const blob = new Blob([code], { type: 'application/javascript' });
          const blobUrl = URL.createObjectURL(blob);
        
          const script = document.createElement('script');
          script.type = 'module';
          script.src = blobUrl;
          script.onload = () => URL.revokeObjectURL(blobUrl);
          document.head.appendChild(script);
        <\/script>
      </head>
      <body>
        ${htmlCode}
      </body>
      </html>
    `.trim();
  
    const blob = new Blob([previewData], { type: 'text/html;charset=utf-8' });
    const blobUrl = URL.createObjectURL(blob);
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
      // currentWork.value = res.data;
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
    updateCardPreviewSrc,
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
