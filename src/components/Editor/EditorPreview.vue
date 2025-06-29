<script setup>
import { ref, watch, onMounted } from 'vue'
import { debounce } from '@/utils/debounce'
import { useWorkStore } from '@/stores/useWorkStore'
import { usePreviewStore } from '@/stores/usePreviewStore'
import { storeToRefs } from 'pinia'

const workStore = useWorkStore()
const { currentWork } = storeToRefs(workStore)
const previewStore = usePreviewStore()

const iframeEl = ref(null)
const isIframeLoaded = ref(false)
const isFirstRenderDone = ref(false)

watch(iframeEl, (el) => {
  if (el) previewStore.setIframeEl(el)
}, { immediate: true })

watch(iframeEl, (el) => {
  if (el) {
    el.addEventListener('load', () => {
      console.log('✅ iframe loaded')
      isIframeLoaded.value = true
      tryRenderFirstTime()
    }, { once: true })
    previewStore.setIframeEl(el)
  }
}, { immediate: true })

const hasAnyContent = (work) => {
  return Boolean(
    work.html?.trim() ||
    work.css?.trim() ||
    work.javascript?.trim() ||
    work.htmlClass?.trim() ||
    work.headStuff?.trim()
  )
}

const tryRenderFirstTime = () => {
  if (isFirstRenderDone.value || !isIframeLoaded.value || !currentWork.value) return;

  if (!currentWork.value.id) {
    return;
  }

  if (hasAnyContent(currentWork.value)) {
    previewStore.sendAutoPreviewCode(currentWork.value);
  }
  isFirstRenderDone.value = true;
}

const autoSendToIframe = debounce(() => {
  if (isIframeLoaded.value) {
    previewStore.sendAutoPreviewCode(currentWork.value)
  }
}, 2000)

function runPreview() {
  if (isIframeLoaded.value) {
    previewStore.sendAutoPreviewCode(currentWork.value)
  }
}
defineExpose({ runPreview })

watch(
  () => [
    currentWork.value?.html,
    currentWork.value?.css,
    currentWork.value?.javascript,
    currentWork.value?.htmlClass,
    currentWork.value?.headStuff,
    JSON.stringify(currentWork.value?.cdns || []),
    JSON.stringify(currentWork.value?.links || []),
  ],
  () => {
    if (!isFirstRenderDone.value) {
      tryRenderFirstTime();
      return;
    }
    if (currentWork.value?.isAutoPreview) {
      autoSendToIframe();
    }
  },
  { immediate: true }
)
</script>

<template>
  <iframe
    ref="iframeEl"
    src="/auto-preview-frame.html"
    sandbox="allow-scripts"
    referrerpolicy="no-referrer"
    class="h-full w-full"
    title="Preview Frame"
  ></iframe>
</template>