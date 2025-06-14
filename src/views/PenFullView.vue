<script setup>
	import { ref, computed } from 'vue';
  import PenHeader from '@/components/Editor/PenHeader.vue';
  import EditorPreview from '@/components/Editor/EditorPreview.vue';

  import { useWorkStore } from '@/stores/useWorkStore';
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
  const { handleCurrentIdChange, updatePreviewSrc }= workStore; //放function
  const { currentWork } = storeToRefs(workStore); //放資料
  handleCurrentIdChange(route.params.id)

</script>
<template>
  <div class="flex flex-col h-dvh">
    <PenHeader v-if="isHeaderShow"/>
    <div class="bg-cc-1 h-full">
      <EditorPreview :updatePreviewSrc="updatePreviewSrc" :currentWork="currentWork"/>
    </div>
  </div>
</template>