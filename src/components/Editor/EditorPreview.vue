<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { debounce } from '@/utils/debounce'

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

const autoUpdateIframe = debounce(() => {
  updateIframe();
}, 2000)

const updateIframe =() => {
  revokeOldUrl()
  const newBlobUrl = props.updatePreviewSrc()
  iframeSrc.value = newBlobUrl
  currentBlobUrl = newBlobUrl
}

function runPreview() {
  updateIframe()
}
defineExpose({ runPreview })

const isFirstRenderDone = ref(false);

watch(
  () => props.currentWork,
  (work) => {
    if (!work || isFirstRenderDone.value) return;

    if (work.isAutoPreview && work.html) {
      updateIframe();
      isFirstRenderDone.value = true;
    }
  },
  { immediate: true }
);

watch(
  () => [
    props.currentWork?.html,
    props.currentWork?.css,
    props.currentWork?.javascript,
    JSON.stringify(props.currentWork?.cdns || []),
    JSON.stringify(props.currentWork?.links || []),
  ],
  () => {
    if (!isFirstRenderDone.value) return;

    if (props.currentWork?.isAutoPreview) {
      autoUpdateIframe();
    }
  }
);

// onUnmounted(() => {
//   revokeOldUrl()
// })

</script>

<template>
  <!-- <iframe :src="iframeSrc" sandbox="allow-scripts" class="h-full w-full" title="Preview Frame" /> -->
  <iframe
  :src="iframeSrc"
  sandbox="allow-scripts allow-same-origin"
  class="h-full w-full"
  title="Preview Frame"
/>

</template>