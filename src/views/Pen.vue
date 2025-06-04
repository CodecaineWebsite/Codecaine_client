<script setup>
	import { ref, onMounted, onUnmounted, watch } from 'vue';
  import ArrowWhite from '../assets/arrow-white.svg';
  import Settings from '../assets/settings.svg';
  import Close from '../assets/close.svg';
  import HTMLIcon from '../assets/html.svg';
  import CSSIcon from '../assets/css.svg';
  import JSIcon from '../assets/js.svg';
  import EditorSmallButton from '../components/Editor/EditorSmallButton.vue';
  import Editor from '@/components/Editor/Editor.vue';
  import EditorPreview from '@/components/Editor/EditorPreview.vue';
  import ConsolePreview from '../components/Editor/ConsolePreview.vue'
  import PenHeader from '@/components/Editor/PenHeader.vue';

  import { storeToRefs } from 'pinia'
  import { useWorkStore } from '@/stores/workStore';

  import { useRoute } from 'vue-router'

  const route = useRoute();
  const workStore = useWorkStore()
  const { updateCurrentCode, handleCurrentIdChange  }= workStore; //放function
  const { currentWork } = storeToRefs(workStore); //放資料
  handleCurrentIdChange(route.params.id)

  const htmlCode = ref(currentWork.value.html);
  const cssCode = ref(currentWork.value.css);
  const javascriptCode = ref(currentWork.value.javascript);
  const isAutoPreview = ref(currentWork.value.isAutoPreview);

	
  const isConsoleDragging = ref(false);
  const consoleHeight = ref(200);  // 預設高度 px
  const previewContainer = ref(null);


  const cdns = ref(currentWork.value.cdns)
  const links = ref(currentWork.value.links)

  watch(cdns, (newCDNs) => {
    workStore.updateCDNs(newCDNs)
  }, { deep: true })

  watch(links, (newLinks) => {
    workStore.updateLinks(newLinks)
  }, { deep: true })

  const layoutOptionVisible = ref(false);
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


  const selectedLayout = ref(layoutOptions[1]);
  const selectLayout = (layout) => {
    selectedLayout.value = layout
    layoutOptionVisible.value = false
  };

  const isDraggingEditor = ref(false)
  const isDraggingConsole = ref(false)
  const isDraggingColumn = ref(false)

  const currentColumnIndex = ref(null)
  const dragElement = ref(null)
  const mainRef = ref(null);

  const MIN_SIZE = 0

  // 啟動 / 停止拖曳時禁用選取文字
  function enableNoSelect() {
    document.body.classList.add('select-none')
  }
  function disableNoSelect() {
    document.body.classList.remove('select-none')
  }

  // Console 拖曳
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
      const mainHeight = mainRef.value ? mainRef.value.getBoundingClientRect().height : window.innerHeight
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
      const mainHeight = mainRef.value?.getBoundingClientRect().height || window.innerHeight
      const maxEditorHeight = mainHeight - 36 - 16  // console 高度預留

      if (editorWrapperSize.value > maxEditorHeight) {
        editorWrapperSize.value = maxEditorHeight
      }
    }
  })

  function onPointerMove(e) {
    if (isDraggingConsole.value) {
      handleConsoleDrag(e)
    } else if (isDraggingEditor.value) {
      handleEditorDrag(e)
    } else if (isDraggingColumn.value) {
      handleColumnDrag(e)
    }
  }

  function onPointerUp(e) {
    stopConsoleDrag(e)
    stopEditorDrag(e)
    stopColumnDrag(e)
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
</script>

<template>
  <div class="flex flex-col h-dvh">
    <PenHeader/>
    <main class="flex-1 flex overflow-hidden w-full" :class="selectedLayout.display" ref="mainRef">
      <!-- editor -->
      <div
        ref="editorWrapperRef"
        class="flex overflow-hidden"
        :style="selectedLayout.id === 'center'
          ? { height: editorWrapperSize + 'px' }
          : { width: editorWrapperSize + 'px' }"
        :class="selectedLayout.id === 'center' ? 'flex-row' : 'flex-col'"
      >
        <div
          class="resizer border-cc-editor-column-border bg-cc-editor-column-bg"
          :class="selectedLayout.id === 'center' ? 'w-4 border-x' : 'h-0 border-y'"
        ></div>
        <div :style="selectedLayout.id === 'center'
          ? { flexBasis: columnSizes[0] + '%', minWidth: '0px' }
          : { flexBasis: columnSizes[0] + '%', minHeight: '0px' }" class="relative">
          <div class="flex justify-between items-center min-w-3xs overflow-hidden bg-cc-editor-column-bg" ref="columnTitleRef">
            <h2 class="py-2 px-3 font-bold bg-cc-editor-column-tab-bg text-cc-editor-column-tab-text border-t-3 border-cc-editor-column-border flex items-center gap-2">
              <img :src="HTMLIcon" alt="HTML" class="w-[15px] h-[15px]">
              <div>
                HTML
              </div>
            </h2>
            <div class="h-full flex items-center gap-2 px-3">
              <EditorSmallButton class="hover:bg-cc-12">
                <img :src="Settings" alt="setting button" class="w-2.5 h-2.5">
              </EditorSmallButton>
              <EditorSmallButton class="hover:bg-cc-12">
                <img :src="ArrowWhite" alt="other button" class="w-2.5 h-2.5">
              </EditorSmallButton>
            </div>
          </div>
          <Editor :language="'html'" :code="htmlCode" @update:code="newCode => updateCode('html', newCode)"/>
        </div>

        <div
          class="resizer border-cc-editor-column-border bg-cc-editor-column-bg"
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
              <img :src="CSSIcon" alt="CSS" class="w-[15px] h-[15px]">
              <div>
                CSS
              </div>
            </h2>
            <div class="h-full flex items-center gap-2 px-3">
              <EditorSmallButton class="hover:bg-cc-12">
                <img :src="Settings" alt="setting button" class="w-2.5 h-2.5">
              </EditorSmallButton>
              <EditorSmallButton class="hover:bg-cc-12">
                <img :src="ArrowWhite" alt="other button" class="w-2.5 h-2.5">
              </EditorSmallButton>
            </div>
          </div>
          <Editor :language="'css'" :code="cssCode" @update:code="newCode => updateCode('css', newCode)"/>
        </div>

        <div
          class="resizer border-cc-editor-column-border bg-cc-editor-column-bg"
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
              <img :src="JSIcon" alt="JavaScript" class="w-[15px] h-[15px]">
              <div>
                JS
              </div>
            </h2>
            <div class="h-full flex items-center gap-2 px-3">
              <EditorSmallButton class="hover:bg-cc-12">
                <img :src="Settings" alt="setting button" class="w-2.5 h-2.5">
              </EditorSmallButton>
              <EditorSmallButton class="hover:bg-cc-12">
                <img :src="ArrowWhite" alt="other button" class="w-2.5 h-2.5">
              </EditorSmallButton>
            </div>
          </div>
          <Editor :language="'javascript'" :code="javascriptCode" @update:code="newCode => updateCode('javascript', newCode)"/>
        </div>

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
        @pointerdown="startEditorDrag"
      ></div>
      <!-- preview -->
      <div class="flex-1 overflow-hidden flex flex-col justify-between bg-cc-1" ref="previewContainer">
        <div class="overflow-auto flex-none shrink min-w-0 min-h-0 w-full h-full">
          <!-- Preview iframe -->
          <EditorPreview :html="htmlCode" :css="cssCode" :javascript="javascriptCode" :isAutoPreview="isAutoPreview"/>
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
                <img :src="Close" alt="close button" class="w-2.5 h-2.5">
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
    </main>

    <footer class="h-8 w-full flex relative justify-between items-center py-[.2rem] px-3 bg-cc-14 text-white">
        <div class="flex items-center h-full">
          <EditorSmallButton class="hover:bg-cc-12" @buttonClick="toggleConsole">Console</EditorSmallButton>
        </div>
        <div class="flex items-center h-full">
          <EditorSmallButton class="hover:bg-cc-red">Delete</EditorSmallButton>
        </div>
    </footer>
  </div>
</template>
