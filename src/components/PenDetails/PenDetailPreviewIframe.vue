<script setup>
import { ref, onMounted } from 'vue'
import { usePreviewStore } from '@/stores/usePreviewStore'

const props = defineProps({
  pen: {
    type: Object,
    required: true,
  },
})

const iframeDetailEl = ref(null)
const previewStore = usePreviewStore()

function sendCode() {
  if (!iframeDetailEl.value || !iframeDetailEl.value.contentWindow) return

  const newPen = props.pen
  const code = {
    html: newPen.html_code || '',
    css: newPen.css_code || '',
    javascript: `
      try {
        ${newPen.js_code || ''}
      } catch (err) {
        console.error("User JS Error:", err)
      }
    `,
    htmlClass: newPen.html_class || '',
    headStuff: newPen.head_stuff || '',
    cdns: Array.isArray(newPen.resources_js) ? newPen.resources_js : [],
    links: Array.isArray(newPen.resources_css) ? newPen.resources_css : [],
  }

  previewStore.sendPreviewCode(iframeDetailEl.value, code)
}

onMounted(() => {
  if (!iframeDetailEl.value) return

  iframeDetailEl.value.addEventListener('load', () => {
    sendCode()
  }, { once: true })
})
</script>

<template>
  <div class="aspect-video w-full">
    <iframe
      ref="iframeDetailEl"
      src="/preview-frame.html"
      sandbox="allow-scripts"
      referrerpolicy="no-referrer"
      class="h-full w-full bg-cc-1"
      title="Preview Frame"
    ></iframe>
  </div>
</template>