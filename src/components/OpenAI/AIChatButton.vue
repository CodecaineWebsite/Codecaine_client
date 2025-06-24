<script setup>
  import { ref } from 'vue';
  import OpenAIIcon from '@/components/icons/OpenAIIcon.vue'
  
  const emit = defineEmits(['handleOpenAIChat'])

  const isShowAIChat = ref(false)
  const openAIChat = async() => {
    isShowAIChat.value = true;
    emit('handleOpenAIChat')
  }

  const closeAIChat = () => {
    isShowAIChat.value = false;
  }

  defineExpose({ closeAIChat })
</script>

<template>

  <button type="button"
    class="absolute bottom-10 bg-[#10a37f] p-3 text-lg leading-4 rounded-full hover:bg-[#13b38f] hover:scale-110 duration-300 ease-in-out transition-* " @click="openAIChat"
    :class="isShowAIChat ? 'opacity-0 right-10' : 'opacity-100 right-2'"
  >
    <OpenAIIcon class="w-6 h-6 text-cc-1" />
  </button>
</template>