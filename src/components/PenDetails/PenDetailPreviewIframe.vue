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

<script setup>
import { onMounted, ref, watch } from 'vue';
import { useWorkStore } from '@/stores/useWorkStore';
import { usePreviewStore } from '@/stores/usePreviewStore';

const props = defineProps({
  pen: {}
});

const iframeDetailEl = ref(null);
const workStore = useWorkStore();
const previewStore = usePreviewStore();

watch(
  () => props.pen,
  (newPen) => {
    if (!newPen || !iframeDetailEl.value || !iframeDetailEl.value.contentWindow) return;

    const code = {
      html: newPen.html_code || "",
      css: newPen.css_code || "",
      javascript: `
        try {
          ${newPen.js_code || ""}
        } catch (err) {
          console.error("User JS Error:", err);
        }
      `,
      htmlClass: newPen.html_class || "",
      headStuff: newPen.head_stuff || "",
      cdns: Array.isArray(newPen.resources_js) ? newPen.resources_js : [],
      links: Array.isArray(newPen.resources_css) ? newPen.resources_css : [],
    };

    previewStore.sendPreviewCode(iframeDetailEl.value, code);
  },
  { immediate: true }
);
// onMounted(() => {
//   console.log(props.pen);
//   iframeEl.value.addEventListener("load", () => {
//     const code = {
//       html: props.pen.html_code || "",
//       css: props.pen.css_code || "",
//       javascript: `
//         try {
//           ${props.pen.js_code || ""}
//         } catch (err) {
//           console.error("User JS Error:", err);
//         }
//       `,
//       htmlClass: props.pen.html_class || "",
//       headStuff: props.pen.head_stuff || "",
//       cdns: Array.isArray(props.pen.resources_js) ? props.pen.resources_js : [],
//       links: Array.isArray(props.pen.resources_css) ? props.pen.resources_css : [],
//     };

//     previewStore.sendPreviewCode(iframeEl.value, code);
//   });
// });

</script>