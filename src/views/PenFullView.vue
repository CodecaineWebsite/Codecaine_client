<script setup>
	import { ref, computed } from 'vue';
  import PenHeader from '@/components/Editor/PenHeader.vue';
  import EditorPreview from '@/components/Editor/EditorPreview.vue';

  import { useWorkStore } from '@/stores/workStore';
  import { useRoute } from 'vue-router'
  import { storeToRefs } from 'pinia'

  const route = useRoute();
  const workStore = useWorkStore();
  const isHeaderShow = ref(true)
  const viewModeType = computed(() => {
    return route.query.mode
  })
  if(viewModeType.value === 'onlyPreview') {
    isHeaderShow.value = false
  }
  const { handleCurrentIdChange }= workStore; //放function
  const { currentWork } = storeToRefs(workStore); //放資料
  handleCurrentIdChange(route.params.id)
  const htmlCode = ref(currentWork.value.html);
  const cssCode = ref(currentWork.value.css);
  const javascriptCode = ref(currentWork.value.javascript);
  const isAutoPreview = ref(currentWork.value.isAutoPreview);
</script>
<template>
  <div class="flex flex-col h-dvh">
    <PenHeader v-if="isHeaderShow"/>
    <div class="bg-cc-1 h-full">
      <EditorPreview :html="htmlCode" :css="cssCode" :javascript="javascriptCode" :isAutoPreview="isAutoPreview"/>
    </div>
  </div>
</template>