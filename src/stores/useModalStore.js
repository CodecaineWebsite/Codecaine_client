import { defineStore } from 'pinia';

export const useModalStore = defineStore('modal', {
  state: () => ({
    showDetailModal: false,
    penId: null,
    from: null, // 'card' | 'editor' | null
  }),
  actions: {
    openModal(penId, from) {
      this.penId = penId
      this.from = from
      this.showDetailModal = true
    },
    closeModal() {
      this.penId = null
      this.from = null
      this.showDetailModal = false
    },
  },
})