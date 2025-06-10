<script setup>
import { ref, watch, onMounted, defineExpose } from 'vue'

// 從 parent 傳入的 props
const props = defineProps({
  currentWork: Object,
  updatePreviewSrc: Function
})

const previewFrame = ref(null)

function debounce(fn, wait = 2000) {
  let timeout
  return (...args) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => fn(...args), wait)
  }
}

const updateIframe = debounce(() => {
  if (!previewFrame.value) return
  previewFrame.value.srcdoc = props.updatePreviewSrc()
}, 2000)

function runPreview() {
  updateIframe()
}
defineExpose({ runPreview })

onMounted(() => {
  if (props.currentWork?.isAutoPreview) {
    updateIframe()
  }
})
watch(
  () => props.currentWork,
  (newVal) => {
    if (newVal?.isAutoPreview) {
      updateIframe()
    }
  },
  { deep: true }
)

</script>

<template>
  <iframe ref="previewFrame" sandbox="allow-scripts" class="h-full w-full"></iframe>
</template>