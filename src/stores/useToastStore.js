// useToastStore.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useToastStore = defineStore('toast', () => {
  const toasts = ref([]);

  function showToast({ message, variant = 'warning', duration = 3000 }) {
    const id = Date.now().toString();
    toasts.value.push({ id, message, variant, duration });
  }

  function removeToast(id) {
    toasts.value = toasts.value.filter((t) => t.id !== id);
  }

  return { toasts, showToast, removeToast };
});
