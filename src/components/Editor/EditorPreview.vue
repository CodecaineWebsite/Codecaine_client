<script setup>
import { ref, watch } from 'vue'
import { debounce } from '@/utils/debounce'
import { usePreviewStore } from '@/stores/usePreviewStore'

const props = defineProps({
  currentWork: {
    type: Object,
    required: true
  }
})
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
  if (
    isFirstRenderDone.value ||
    !isIframeLoaded.value ||
    !props.currentWork
  )
    return;

  if (hasAnyContent(props.currentWork)) {
    previewStore.sendAutoPreviewCode(props.currentWork);
  }
  isFirstRenderDone.value = true;
}

const autoSendToIframe = debounce(() => {
  if (isIframeLoaded.value) {
    previewStore.sendAutoPreviewCode(props.currentWork)
  }
}, 2000)

function runPreview() {
  if (isIframeLoaded.value) {
    previewStore.sendAutoPreviewCode(props.currentWork)
  }
}

defineExpose({ runPreview })

watch(
  () => [
    props.currentWork?.html,
    props.currentWork?.css,
    props.currentWork?.javascript,
    props.currentWork?.htmlClass,
    props.currentWork?.headStuff,
    JSON.stringify(props.currentWork?.cdns || []),
    JSON.stringify(props.currentWork?.links || []),
  ],
  () => {
    if (!isFirstRenderDone.value) {
      tryRenderFirstTime();
      return;
    }
    if (props.currentWork?.isAutoPreview) {
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