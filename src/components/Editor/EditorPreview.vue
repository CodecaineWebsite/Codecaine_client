<script setup>
import { ref, watch } from 'vue'
import { debounce } from '@/utils/debounce'
import { useWorkStore } from '@/stores/useWorkStore'
import { usePreviewStore } from '@/stores/usePreviewStore'
import { storeToRefs } from 'pinia'

const workStore = useWorkStore()
const { currentWork } = storeToRefs(workStore)
const previewStore = usePreviewStore()

const iframeEl = ref(null)
const isFirstRenderDone = ref(false)

watch(iframeEl, (el) => {
  if (el) previewStore.setIframeEl(el)
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

const autoSendToIframe = debounce(() => {
  previewStore.sendAutoPreviewCode(currentWork.value)
}, 2000)

function runPreview() {
  previewStore.sendAutoPreviewCode(currentWork.value)
}
defineExpose({ runPreview })

watch(
  currentWork,
  (work) => {
    if (!work || isFirstRenderDone.value) return
    if (work.isAutoPreview && hasAnyContent(work)) {
      previewStore.sendAutoPreviewCode(work)
    }
    isFirstRenderDone.value = true
  },
  { immediate: true }
)

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
    if (!isFirstRenderDone.value) return
    if (currentWork.value?.isAutoPreview) {
      autoSendToIframe()
    }
  }
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