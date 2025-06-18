<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { debounce } from '@/utils/debounce'

// 從 parent 傳入的 props
const props = defineProps({
  currentWork: Object,
  updatePreviewSrc: Function
})

const iframeSrc = ref('')
let currentBlobUrl = null

function revokeOldUrl() {
  if (currentBlobUrl) {
    URL.revokeObjectURL(currentBlobUrl)
    currentBlobUrl = null
  }
}

const updateIframe = debounce(() => {
  revokeOldUrl()
  const newBlobUrl = props.updatePreviewSrc()
  iframeSrc.value = newBlobUrl
  currentBlobUrl = newBlobUrl
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

onUnmounted(() => {
  revokeOldUrl()
})

</script>

<template>
  <iframe :src="iframeSrc" sandbox="allow-scripts" class="h-full w-full" title="Preview Frame"></iframe>
</template>