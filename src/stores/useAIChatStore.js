import { ref } from 'vue'
import { defineStore } from "pinia";

export const useAIChatStore = defineStore('chat', () => {
  const historyMessages = ref([])
  const sendingMessages= ref([])
  const loading = ref(false)

  function addMessage(role, content) {
    messages.value.push({ role, content })
  }

  return { 
    messages,
    loading,
    addMessage
  }
})