<template>
  <div class="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-3 max-w-sm items-center">
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
import Toast from '@/components/Toast/Toast.vue'

const toastStore = useToastStore()
</script>