import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSavedStore = defineStore('savedStore', () => {
  const savedPens = ref([])

  function savePen(pen) {
    if (!savedPens.value.some(p => p.id === pen.id)) {
      savedPens.value.push(pen)
    }
  }

  return {
    savedPens,
    savePen,
  }
})