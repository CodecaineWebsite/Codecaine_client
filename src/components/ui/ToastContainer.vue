<!-- ToastContainer.vue -->
<template>
  <div class="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-3 w-full max-w-sm">
    <Toast
      v-for="toast in toastStore.toasts"
      :key="toast.id"
      v-bind="toast"
      @close="toastStore.removeToast(toast.id)"
    />
  </div>
</template>
<script setup>
import { useToastStore } from '@/stores/useToastStore'
import Toast from '@/components/Toast/Toast.vue' // 單一 toast 元件

const toastStore = useToastStore()
</script>