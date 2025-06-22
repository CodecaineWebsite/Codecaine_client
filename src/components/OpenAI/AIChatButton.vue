<script setup>
  import { ref } from 'vue';
  
  const emit = defineEmits(['handleOpenAIChat'])

  const isShowAIChat = ref(false)
  const openAIChat = () => {
    isShowAIChat.value =  true;
    emit('handleOpenAIChat')
  }

  const closeAIChat = () => {
    console.log(isShowAIChat.value);
    isShowAIChat.value = false;
  }

  defineExpose({ closeAIChat })
</script>

<template>

  <button type="button"
    class="absolute bottom-10 bg-cc-yellow p-4.5 text-lg leading-4 rounded-full hover:bg-cc-blue hover:scale-110 duration-300 ease-in-out transition-* " @click="openAIChat"
    :class="isShowAIChat ? 'opacity-0 right-10' : 'opacity-100 right-2'"
  >
    AI
  </button>
</template>