<script setup>
	import { ref, onMounted, onUnmounted, onBeforeUnmount, watch } from 'vue';
  import Settings from '../assets/settings.vue';
  import Close from '../assets/close.vue';
  import HTMLIcon from '../assets/html.vue';
  import CSSIcon from '../assets/css.vue';
  import JSIcon from '../assets/js.vue';
  import EditorSmallButton from '../components/Editor/EditorSmallButton.vue';
  import Editor from '@/components/Editor/Editor.vue';
  import EditorPreview from '@/components/Editor/EditorPreview.vue';
  import ConsolePreview from '@/components/Editor/ConsolePreview.vue'
  import PenHeader from '@/components/Editor/PenHeader.vue';
  import AnonLoginModal from '@/components/Editor/AnonLoginModal.vue';
  import AIChatButton from '@/components/OpenAI/AIChatButton.vue';
  import AIChat from '@/components/OpenAI/AIChat.vue';
  import { debounce } from '@/utils/debounce';
  import { storeToRefs } from 'pinia'
  import { useWorkStore } from '@/stores/useWorkStore';
  import { useAuthStore } from '@/stores/useAuthStore';
  import { useHandleSave } from '@/utils/handleWorkSave';
  import { useRoute, useRouter } from 'vue-router'

  const route = useRoute();
  const router = useRouter();
  const workStore = useWorkStore();
  const authStore = useAuthStore();
  const { handleInitWork, updateCurrentCode, handleCurrentIdChange, updatePreviewSrc, moveToTrash } = workStore; //放function
  const { currentWork, currentId } = storeToRefs(workStore); //放資料
  const { handleSave } = useHandleSave();
  const isPro = ref(false)

  const debouncedSave = debounce(() => {
    handleSave()
  }, 300)

  const handleKeydown = (e) => {
    const isMac = navigator.platform.toUpperCase().includes('MAC')
    const key = e.key?.toLowerCase()

    const isSaveKey =
      (isMac && e.metaKey && key === 's') ||
      (!isMac && e.ctrlKey && key === 's')

    if (isSaveKey) {
      e.preventDefault()
      e.stopPropagation()
      debouncedSave()
    }
  }

  onMounted( async() => {
    await handleCurrentIdChange(route.params.id);
    const userProfile = authStore.userProfile;
    if (!route.params.id) {
     const userInit = {
        userName: userProfile.username,
        displayName: userProfile.display_name,
        isPro: userProfile.is_pro,
      };
      await handleInitWork(userInit)
    }
    isPro.value = !!userProfile.is_pro;
    window.addEventListener('keydown', handleKeydown, true)
  })

  watch(
    () => authStore.userProfile,
    (profile) => {
      if (profile && typeof profile.is_pro !== 'undefined') {
        isPro.value = !!profile.is_pro;
      }
    },
    { immediate: true, deep: true }
  );

  onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleKeydown, true)
  })

  const penHeader = ref(null)
  const htmlCode = ref('');
  const cssCode = ref('');
  const javascriptCode = ref('');
  const cdns = ref([]);
  const links = ref([]);

  // RWD
  const tabs = [
    { id: 'html', label: 'HTML' },
    { id: 'css', label: 'CSS' },
    { id: 'js', label: 'JS' }
  ]

  const selectedTab = ref('html')
  const isMobile = ref(false)
  const checkMobile = () => {
    isMobile.value = editorRef.value?.clientWidth < 768
  }
  onMounted(() => {
    window.addEventListener('resize', checkMobile)
    checkMobile()
  })
  onUnmounted(() => {
    window.removeEventListener('resize', checkMobile)
  })

  watch(isMobile, (mobile) => {
    if (mobile && selectedLayout.value.id !== 'center') {
      selectedLayout.value = layoutOptions.find(opt => opt.id === 'center')
    }
  })

  watch(currentWork, (newWork) => {
    if (newWork) {
      htmlCode.value = newWork.html || '';
      cssCode.value = newWork.css || '';
      javascriptCode.value = newWork.javascript || '';
      cdns.value = newWork.cdns || [];
      links.value = newWork.links || [];
    }
  }, { deep: true });

  let isFirstRun = true;
  const debouncedAutoSave = debounce(() => {
    penHeader.value?.handleWorkAutoSave()
  }, 2000)
  watch( () => [
      currentWork.value.title,
      currentWork.value.description,
      currentWork.value.html,
      currentWork.value.css,
      currentWork.value.javascript,
      currentWork.value.cdns,
      currentWork.value.links,
      currentWork.value.viewMode,
      currentWork.value.isAutoSave,
      currentWork.value.isAutoPreview,
      currentWork.value.isPrivate,
      currentWork.value.tags,
    ],
    () => {
      if(isFirstRun) {
        isFirstRun = false;
        return
      }
      debouncedAutoSave()
    }
  )

  const isConsoleShow = ref(false);
  const consoleRef = ref(null)

  const handleConsoleClose = () => {
    isConsoleShow.value = false;
  };

  const handleConsoleClear = () => {
    consoleRef.value.consoleClear();
  }

  const toggleConsole = ()=> {
    isConsoleShow.value = !isConsoleShow.value
  };

  const layoutOptions = [
    { id: 'left', rotation: -90, display: 'flex-row'},
    { id: 'center', rotation: 0, display: 'flex-col'},
    { id: 'right', rotation: 90, display: 'flex-row-reverse'}
  ];
  
  const selectedLayout = ref(layoutOptions.find(
    option => option.id === currentWork.value?.viewMode
  ) || layoutOptions[1])

  watch(() => currentWork.value?.viewMode, (newMode) => {
    const match = layoutOptions.find(option => option.id === newMode)
    if (match) selectedLayout.value = match
  }, { immediate: true })

  const handleOpenSetting = (tab) => {
    penHeader.value?.toggleSetting(tab);
  }


  // 拖拉改欄位大小 計算變更高度或寬度
  const isDraggingEditor = ref(false)
  const isDraggingConsole = ref(false)
  const isDraggingColumn = ref(false)
  const isDraggingAiChat = ref(false)

  const currentColumnIndex = ref(null)
  const dragElement = ref(null)
  const editorRef = ref(null);
  const mainRef = ref(null)

  // 啟動 / 停止拖曳時禁用選取文字
  function enableNoSelect() {
    document.body.classList.add('select-none')
  }
  function disableNoSelect() {
    document.body.classList.remove('select-none')
  }

  // Console 拖曳
  const consoleHeight = ref(200);  // 預設高度 px
  const previewContainer = ref(null);

  function startConsoleDrag(e) {
    e.preventDefault()
    isDraggingConsole.value = true
    e.target.setPointerCapture?.(e.pointerId)
    enableNoSelect()
  }
  function stopConsoleDrag(e) {
    isDraggingConsole.value = false
    e?.target?.releasePointerCapture?.(e.pointerId)
    disableNoSelect()
  }
  function handleConsoleDrag(e) {
    if (!isDraggingConsole.value || !previewContainer.value) return

    const container = previewContainer.value
    const containerHeight = container.clientHeight
    const rect = container.getBoundingClientRect()
    const offsetY = e.clientY - rect.top
    const newHeight = containerHeight - offsetY

    consoleHeight.value = Math.min(Math.max(newHeight, 0), containerHeight)
  }

  // Editor拖曳
  const editorWrapperSize = ref(300)
  let startY = 0
  let initialHeight = 0
  const editorWrapperRef = ref(null)

  function updateEditorSizeByDevice() {
    const editorWidth = editorRef.value?.clientWidth || 0;
    editorWrapperSize.value = editorWidth < 640 ? 200 : 300;
  }

  onMounted(() => {
    updateEditorSizeByDevice()
    window.addEventListener('resize', updateEditorSizeByDevice)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', updateEditorSizeByDevice)
  })
  
  function startEditorDrag(e) {
    e.preventDefault()
    e.target.setPointerCapture?.(e.pointerId)
    isDraggingEditor.value = true
    startY = e.clientY
    initialHeight = editorWrapperSize.value
    enableNoSelect()
  }

  function stopEditorDrag(e) {
    e?.target?.releasePointerCapture?.(e.pointerId)
    isDraggingEditor.value = false
    disableNoSelect()
  }

  function handleEditorDrag(e) {
    if (!isDraggingEditor.value) return
    const layoutId = selectedLayout.value.id;

    if (layoutId === 'center') {
      const deltaY = e.clientY - startY
      const newHeight = initialHeight + deltaY
      const mainHeight = editorRef.value ? editorRef.value.getBoundingClientRect().height : window.innerHeight
      let maxHeight = window.innerHeight

      if (isConsoleShow.value) {
        maxHeight = mainHeight - 36 - 16 // console 開時限制
      }

      if (newHeight > 100 && newHeight < maxHeight) {
        editorWrapperSize.value = newHeight
      } else if (newHeight >= maxHeight) {
        editorWrapperSize.value = maxHeight
      } else if (newHeight <= 100) {
        editorWrapperSize.value = 100
      }
    } else {
      const rect = editorWrapperRef.value.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;

      const newWidth = selectedLayout.value.id === 'left'
        ? offsetX
        : rect.width - offsetX;

      editorWrapperSize.value = Math.max(newWidth, 150);
    }
  }

  const columnSizes = ref([33.3, 33.3, 33.4]);
  const columnTitleRef = ref(null)

  function startColumnDrag(index, el, e) {
    e.preventDefault()
    e.target.setPointerCapture?.(e.pointerId)
    currentColumnIndex.value = index
    dragElement.value = el
    isDraggingColumn.value = true
    enableNoSelect()
  }
  function stopColumnDrag(e) {
    isDraggingColumn.value = false
    currentColumnIndex.value = null
    dragElement.value = null
    disableNoSelect()
    if (e?.target?.releasePointerCapture && e.pointerId != null) {
      e.target.releasePointerCapture(e.pointerId)
    }
  }

  function handleColumnDrag(e) {
    const index = currentColumnIndex.value
    const el = dragElement.value
    const layoutId = selectedLayout.value.id

    if (index === null || !el || !el.parentElement) return

    const parent = el.parentElement
    const totalSize = layoutId === 'center' ? parent.clientWidth : parent.clientHeight
    const delta = layoutId === 'center' ? e.movementX : e.movementY
    const a = columnSizes.value[index]
    const b = columnSizes.value[index + 1]
    const change = (delta / totalSize) * 100

    let newA = a + change
    let newB = b - change

    if (layoutId !== 'center') {
      // 僅在直向模式下限制最小高度
      const titleHeight = columnTitleRef.value?.offsetHeight || 0
      const minPercent = (titleHeight / totalSize) * 100

      if (newA < minPercent) {
        newA = minPercent
        newB = a + b - minPercent
      } else if (newB < minPercent) {
        newB = minPercent
        newA = a + b - minPercent
      }
    }
    columnSizes.value[index] = newA
    columnSizes.value[index + 1] = newB
  }

  // 如果有顯示console 且 顯示模式是center  maxEditorHeight保留(console拖曳欄高 + editor拖曳欄高)
  watch(isConsoleShow, (show) => {
    if (show && selectedLayout.value.id === 'center') {
      const mainHeight = editorRef.value?.getBoundingClientRect().height || window.innerHeight
      const maxEditorHeight = mainHeight - 36 - 16  // console 高度預留

      if (editorWrapperSize.value > maxEditorHeight) {
        editorWrapperSize.value = maxEditorHeight
      }
    }
  })

  // handle AI Chat Drag
  const aiChatWidth = ref(400); // 預設寬度，可以依需求調整
  let startX = 0;
  let startWidth = 0;

  function startAiChatDrag(e) {
    e.preventDefault();
    isDraggingAiChat.value = true;
    e.target.setPointerCapture?.(e.pointerId);
    startX = e.clientX;
    startWidth = aiChatWidth.value;
    enableNoSelect();
  }

  function handleAiChatDrag(e) {
    if (!isDraggingAiChat.value || !mainRef.value) return;

    const deltaX = e.clientX - startX;
    let newWidth = startWidth - deltaX;

    const maxWidth = mainRef.value.clientWidth;

    if (newWidth < 320) newWidth = 320;
    if (newWidth > maxWidth) newWidth = maxWidth;

    aiChatWidth.value = newWidth;
  }

  function stopAiChatDrag(e) {
    isDraggingAiChat.value = false;
    e?.target?.releasePointerCapture?.(e.pointerId);
    disableNoSelect();
  }

  function onPointerMove(e) {
    if (isDraggingConsole.value) {
      handleConsoleDrag(e);
    } else if (isDraggingEditor.value) {
      handleEditorDrag(e);
    } else if (isDraggingColumn.value) {
      handleColumnDrag(e);
    } else if (isDraggingAiChat.value) {
      handleAiChatDrag(e);
    }
  }

  function onPointerUp(e) {
    stopConsoleDrag(e);
    stopEditorDrag(e);
    stopColumnDrag(e);
    stopAiChatDrag(e);
  }

  onMounted(() => {
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
  })

  onUnmounted(() => {
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('pointerup', onPointerUp)
  })

  const updateCode = (language, newCode) => {
    updateCurrentCode(language, newCode);
  }

  const previewRef = ref(null)

  const handleRunPreview = () => {
    previewRef.value?.runPreview()
  }

  const handleMoveToTrash = async () => {
    const confirmed = window.confirm('確定要將這個作品移至垃圾桶嗎？此操作可以在垃圾桶中還原。');
    if (!confirmed) return;

  try {
    const id = currentId.value;
    const success = await moveToTrash(id);

    if (success) {
      console.log(`作品 ID: ${id} 已丟入垃圾桶`);
      await router.push({ path: '/your-work' });
    } else {
      console.warn(`移動失敗：伺服器未回傳成功狀態`);
      alert('無法丟入垃圾桶，請稍後再試');
    }
  } catch (error) {
    console.error('丟入垃圾桶失敗：', error);
    alert('無法丟入垃圾桶');
  }
};

const aiChatButtonRef = ref(null)
const isShowAIChat = ref(false)

const handleCloseAIChat = () => {
  isShowAIChat.value = false
  aiChatButtonRef.value.closeAIChat()
}

const handleOpenAIChat = () => {
  isShowAIChat.value = true
}

</script>

<template>
  <div class="flex flex-col h-dvh">
    <AnonLoginModal/>
    <AIChatButton ref="aiChatButtonRef" @handleOpenAIChat = "handleOpenAIChat" v-if="isPro"/>
    <PenHeader @run-preview="handleRunPreview" :currentWork = "currentWork" ref="penHeader"/>
    <main class="flex flex-1 overflow-hidden" ref="mainRef">
      <div class="flex-1 flex overflow-hidden w-full" :class="selectedLayout.display" ref="editorRef">
        <div v-if="isMobile" class="flex border-b border-gray-600 mb-1 px-2 gap-1">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="selectedTab = tab.id"
            :class="[
              'px-3 py-1 text-center font-medium my-1 text-sm bg-cc-14',
              selectedTab === tab.id ? 'bg-gray-600 ' : 'text-gray-500 '
            ]"
          >
            {{ tab.label }}
          </button>
        </div>

        <div
          ref="editorWrapperRef"
          class="flex overflow-hidden"
          :style="isMobile
            ? { height: editorWrapperSize + 'px' }
            : selectedLayout.id === 'center'
              ? { height: editorWrapperSize + 'px' }
              : { width: editorWrapperSize + 'px' }"
          :class="isMobile
            ? 'flex-col'
            : selectedLayout.id === 'center'
              ? 'flex-row'
              : 'flex-col'"
        >
          <template v-if="!isMobile">
            <div
              class="flex overflow-hidden"
              :style="selectedLayout.id === 'center'
                ? { height: editorWrapperSize + 'px', width: '100%' }
                : { width: editorWrapperSize + 'px', height: '100%' }"
              :class="selectedLayout.id === 'center' ? 'flex-row' : 'flex-col'"
            >
              <div
                class="resizer border-cc-editor-column-border bg-cc-editor-column-bg z-10"
                :class="selectedLayout.id === 'center' ? 'w-4 border-x' : 'h-0 border-y'"
              ></div>

              <div :style="selectedLayout.id === 'center'
                ? { flexBasis: columnSizes[0] + '%', minWidth: '0px' }
                : { flexBasis: columnSizes[0] + '%', minHeight: '0px' }" class="relative">
                <div class="flex justify-between items-center min-w-3xs overflow-hidden bg-cc-editor-column-bg" ref="columnTitleRef">
                  <h2 class="py-2 px-3 font-bold bg-cc-editor-column-tab-bg text-cc-editor-column-tab-text border-t-3 border-cc-editor-column-border flex items-center gap-2">
                    <HTMLIcon class="w-[15px] h-[15px] text-[#FF3C41]" alt="HTML"/>
                    <div>
                      HTML
                    </div>
                  </h2>
                  <div class="h-full flex items-center gap-2 px-3">
                    <EditorSmallButton class="hover:bg-cc-12" @click="handleOpenSetting('html')">
                      <Settings class="w-2.5 h-2.5" alt="setting button"/>
                    </EditorSmallButton>
                  </div>
                </div>
                <Editor :language="'html'" :code="htmlCode" @update:code="newCode => updateCode('html', newCode)"/>
              </div>

              <div
                class="resizer border-cc-editor-column-border bg-cc-editor-column-bg z-10"
                :class="selectedLayout.id === 'center' ? 'w-4 cursor-col-resize border-x' : 'h-0 cursor-row-resize border-y'"
                @pointerdown="(e) => startColumnDrag(0, e.currentTarget, e)"
              ></div>

              <div :style="selectedLayout.id === 'center'
                ? { flexBasis: columnSizes[1] + '%', minWidth: '0px' }
                : { flexBasis: columnSizes[1] + '%', minHeight: '0px' }" class="relative">
                <div class="flex justify-between items-center min-w-3xs overflow-hidden editor-bgc" 
                  :class="selectedLayout.id !== 'center' ? 'cursor-row-resize' : ''"
                  @pointerdown="(e) => {
                    if(selectedLayout.id !== 'center') {
                      startColumnDrag(0, editorWrapperRef, e)
                    }
                  }">
                  <h2 class="py-2 px-3 font-bold bg-cc-editor-column-tab-bg text-cc-editor-column-tab-text border-t-3 border-cc-editor-column-border flex items-center gap-2">
                    <CSSIcon class="w-[15px] h-[15px] text-[#0EBEFF]" alt="CSS"/>
                    <div>
                      CSS
                    </div>
                  </h2>
                  <div class="h-full flex items-center gap-2 px-3">
                    <EditorSmallButton class="hover:bg-cc-12" @click="handleOpenSetting('css')">
                      <Settings class="w-2.5 h-2.5" alt="setting button"/>
                    </EditorSmallButton>
                  </div>
                </div>
                <Editor :language="'css'" :code="cssCode" @update:code="newCode => updateCode('css', newCode)"/>
              </div>

              <div
                class="resizer border-cc-editor-column-border bg-cc-editor-column-bg z-10"
                :class="selectedLayout.id === 'center' ? 'w-4 cursor-col-resize border-x' : 'h-0 cursor-row-resize border-y'"
                @pointerdown="(e) => startColumnDrag(1, e.currentTarget, e)"
              ></div>

              <div :style="selectedLayout.id === 'center'
                ? { flexBasis: columnSizes[2] + '%', minWidth: '0px' }
                : { flexBasis: columnSizes[2] + '%', minHeight: '0px' }" class="relative">
                <div class="flex justify-between items-center min-w-3xs overflow-hidden bg-cc-editor-column-bg"
                  :class="selectedLayout.id !== 'center' ? 'cursor-row-resize' : ''"
                  @pointerdown="(e) => {
                    if(selectedLayout.id !== 'center') { 
                      startColumnDrag(1, editorWrapperRef, e)
                    }
                  }"
                >
                  <h2 class="py-2 px-3 font-bold bg-cc-editor-column-tab-bg text-cc-editor-column-tab-text border-t-3 border-cc-editor-column-border flex items-center gap-2">
                    <JSIcon class="w-[15px] h-[15px] text-[#FCD000]" alt="JavaScript" />
                    <div>
                      JS
                    </div>
                  </h2>
                  <div class="h-full flex items-center gap-2 px-3">
                    <EditorSmallButton class="hover:bg-cc-12" @click="handleOpenSetting('js')">
                      <Settings class="w-2.5 h-2.5" alt="setting button" />
                    </EditorSmallButton>
                  </div>
                </div>
                <Editor :language="'javascript'" :code="javascriptCode" @update:code="newCode => updateCode('javascript', newCode)"/>
              </div>

            </div>
          </template>

          <template v-else>
            <div class="relative flex-grow min-w-0">
              <Editor
                v-if="selectedTab === 'html'"
                :language="'html'"
                :code="htmlCode"
                @update:code="newCode => updateCode('html', newCode)"
              />
              <Editor
                v-if="selectedTab === 'css'"
                :language="'css'"
                :code="cssCode"
                @update:code="newCode => updateCode('css', newCode)"
              />
              <Editor
                v-if="selectedTab === 'js'"
                :language="'javascript'"
                :code="javascriptCode"
                @update:code="newCode => updateCode('javascript', newCode)"
              />
            </div>
          </template>
        </div>

        <div
          :class="[
            'bg-cc-editor-column-bg',
            'border-cc-editor-column-border',
            'select-none', 
            selectedLayout.id === 'center'
              ? 'h-4 cursor-row-resize border-y'
              : 'w-4 cursor-col-resize border-x'
          ]"
          v-if="!isMobile"
          @pointerdown="startEditorDrag"
        ></div>

        <div class="flex-1 overflow-hidden flex flex-col justify-between bg-cc-1" ref="previewContainer">
          <div class="overflow-auto flex-none shrink min-w-0 min-h-0 w-full h-full">
            <EditorPreview :updatePreviewSrc="updatePreviewSrc" :currentWork="currentWork" ref="previewRef"/>
          </div>
          <div v-show="isConsoleShow">
            <div
              class="h-9 bg-cc-editor-column-bg cursor-row-resize text-cc-1 flex justify-between items-center py-2 px-3"
              @pointerdown="startConsoleDrag"
            >
              <div>
                <h2 class="text-base text-cc-editor-column-title font-bold">
                  Console
                </h2>
              </div>
              <div class="flex gap-1">

                <EditorSmallButton class="hover:bg-cc-12" @buttonClick="handleConsoleClear">
                  Clear
                </EditorSmallButton>
                <EditorSmallButton class="hover:bg-cc-12" @buttonClick="handleConsoleClose">
                  <Close class="w-2.5 h-2.5" alt="close button"/>
                </EditorSmallButton>
              </div>
            </div>
            <div
              class="h-16 bg-cc-editor-column-bg flex flex-col justify-between"
              :style="{ height: `${consoleHeight}px` }"
            >
              <ConsolePreview ref="consoleRef"/>
            </div>
          </div>
        </div>
      </div>
      <transition name="slide-fade">
        <div
          v-if="isShowAIChat"
          class="flex"
          style="overflow: hidden;"
        >
          <div
            class="relative resizer cursor-col-resize border-cc-editor-column-border bg-cc-editor-column-bg z-10 w-4 border-x h-full"
            @pointerdown="startAiChatDrag"
          >
            <button
              @click="handleCloseAIChat"
              class="absolute top-4 flex items-center justify-center w-4 h-7 bg-[#5A5F73] text-amber-50 rounded-r cursor-pointer z-50 transition-all duration-400 hover:opacity-100 ease-in-out"
            >
              <span>➤</span>
            </button>
          </div>
          <AIChat :style="{ width: aiChatWidth + 'px' }" v-if="isPro"/>
        </div>
      </transition>
    </main>
    <footer class="h-8 w-full flex relative justify-between items-center py-[.2rem] px-3 bg-cc-14 text-white">
        <div class="flex items-center h-full">
          <EditorSmallButton class="hover:bg-cc-12" @buttonClick="toggleConsole">Console</EditorSmallButton>
        </div>
        <div class="flex items-center h-full">
          <EditorSmallButton class="hover:bg-cc-red" @click.prevent="handleMoveToTrash">Delete</EditorSmallButton>
        </div>
    </footer>
  </div>
</template>

<style scoped>
  .slide-fade-enter-active,
  .slide-fade-leave-active {
    transition: all 0.5s ease;
  }

  .slide-fade-enter-from,
  .slide-fade-leave-to {
    max-width: 0;
    opacity: 0;
    transform: translateX(-20px);
  }

  .slide-fade-enter-to,
  .slide-fade-leave-from {
    max-width: 100%;
    opacity: 1;
    transform: translateX(0);
  }

</style>