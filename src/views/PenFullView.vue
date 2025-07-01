<script setup>
	import { ref, onMounted, watch } from 'vue';
  import PenHeader from '@/components/Editor/PenHeader.vue';
  // import EditorPreview from '@/components/Editor/EditorPreview.vue';

  import { useWorkStore } from '@/stores/useWorkStore';
  import { usePreviewStore } from '@/stores/usePreviewStore';
  import { useRoute } from 'vue-router'
  import { storeToRefs } from 'pinia'

  const route = useRoute();
  const workStore = useWorkStore();
  const previewStore = usePreviewStore()
  
  const { handleCurrentIdChange }= workStore; //放function
  const { currentWork } = storeToRefs(workStore)
  handleCurrentIdChange(route.params.id)

  const iframeFullEl = ref(null);

  watch(currentWork, (newVal) => {
    if (!newVal || !iframeFullEl.value || !iframeFullEl.value.contentWindow) return;

    const code = {
      html: newVal.html || "",
      css: newVal.css || "",
      javascript: `
        try {
          ${newVal.javaScript || ""}
        } catch (err) {
          console.error("User JS Error:", err);
        }
      `,
      htmlClass: newVal.htmlClass || "",
      headStuff: newVal.headStuff || "",
      cdns: Array.isArray(newVal.cdns) ? newVal.cdns : [],
      links: Array.isArray(newVal.links) ? newVal.links : [],
    };

    previewStore.sendPreviewCode(iframeFullEl.value, code);
  }, { immediate: true });


</script>
<template>
  <div class="flex flex-col h-dvh">
    <PenHeader/>
    <div class="bg-cc-1 h-full">
      <iframe
        ref="iframeFullEl"
        src="/preview-frame.html"
        sandbox="allow-scripts"
        referrerpolicy="no-referrer"
        class="h-full w-full bg-cc-1"
        title="Preview Frame"
      ></iframe>

    </div>
  </div>
</template>