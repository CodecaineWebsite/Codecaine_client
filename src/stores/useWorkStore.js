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
    htmlClass: "",
    links:[],
    cdns: [], 
    headStuff: "",
    viewsCount: "",
    viewMode: "center",
    tabSize: 2,
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
  const updateHtmlClass = (newhtmlClass) => {
  currentWork.value.htmlClass = newhtmlClass
  }
  const updateHeadStuff = (newStuff) => {
  currentWork.value.headStuff = newStuff
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
    await fetchWorkFromId(id);
    addViews(id);

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

  const isSaved = ref(true)
  const isAuthor = ref()

  const addViews = (id) => {
    try {
      api.put(`/api/pens/${id}/view`).catch((err) => {
        console.warn('Failed to increase views count:', err);
      });
    } catch (err) {
      console.error('Failed to fetch work by ID:', err);
      // 可加入錯誤處理
    }

  }
  
  const fetchWorkFromId = async (id) => {
    try {
      const res = await api.get(`/api/pens/${id}`);
      const { 
        html_code, 
        css_code, 
        js_code, 
        html_class,
        head_stuff,
        username, 
        user_id, 
        is_pro, 
        is_private, 
        is_autosave, 
        is_autopreview, 
        tab_size, 
        resources_js, 
        resources_css, 
        tags, 
        ...rest 
      } = res.data;

      currentWork.value = {
        ...rest,
        userName: username,
        userId: user_id,
        isPro: is_pro,
        isPrivate: is_private,
        html: html_code,
        css: css_code,
        htmlClass: html_class,
        headStuff: head_stuff,
        javascript: js_code,
        isAutoSave: is_autosave,
        isAutoPreview: is_autopreview,
        tabSize: tab_size ?? 2,
        cdns: Array.isArray(resources_js) ? resources_js : [],
        links: Array.isArray(resources_css) ? resources_css : [],
        tags: Array.isArray(tags) ? tags : [],
      }
      return res.data;
    } catch (err) {
      console.error('Failed to fetch work', err);
    }
  };

  const createNewWork = async (newWorkData) => {
    try {
    const payload = {
      title: (newWorkData.title || '').trim() || 'Untitled',
      description: newWorkData.description || '',
      html_code: newWorkData.html || '',
      css_code: newWorkData.css || '',
      js_code: newWorkData.javascript || '',
      html_class: newWorkData.html_class || '',
      head_stuff: newWorkData.head_stuff || '',
      view_mode: newWorkData.view_mode,
      tab_size: newWorkData.tab_size,
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
    isSaved.value = true;
    return createdWork;
  } catch (err) {
    console.error('Failed to create work', err);
    return null;
  }
  };

  const saveCurrentWork = async () => {
    try {
      const payload = {
        title: (currentWork.value.title || '').trim() || 'Untitled',
        description: currentWork.value.description,
        html_code: currentWork.value.html,
        css_code: currentWork.value.css,
        js_code: currentWork.value.javascript,
        view_mode: currentWork.value.viewMode,
        tab_size: currentWork.value.tabSize,
        html_class: currentWork.value.htmlClass || "",
        head_stuff: currentWork.value.headStuff || "",
        is_autosave: currentWork.value.isAutoSave ?? false,
        is_autopreview: currentWork.value.isAutoPreview ?? true,
        resources_css: currentWork.value.links || [],
        resources_js: currentWork.value.cdns || [],
        tags: currentWork.value.tags || [],
      };
      await api.put(`/api/pens/${currentId.value}`, payload);
      currentWork.value.lastSavedTime = new Date();
      isSaved.value = true;
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
    } catch (err) {
      console.error('Failed to delete this work', err);
      throw err;
    }
  };

  const deletePenPermanently = async (id) => {
    try {
      const res = await api.delete(`/api/pens/${id}`);
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
    isSaved,
    isAuthor,
    handleInitWork,
    handleCurrentIdChange,
    updateCurrentCode,
    toggleAutoSave,
    toggleAutoPreview,
    updateCDNs,
    updateLinks,
    updateHtmlClass,
    updateHeadStuff,
    updateTags,
    fetchWorkFromId,
    createNewWork,
    saveCurrentWork,
    moveToTrash,
    markAsDeleted,
    deletePenPermanently,
  }
})
