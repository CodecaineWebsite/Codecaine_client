<template>
<div class="flex justify-between items-center p-4 border-b border-cc-13">
  <!-- 左邊作品標題 -->

  <div class="text-cc-10 font-semibold">
    🧱 {{ pen.title }}
  </div>

  <!-- 右邊按鈕 -->
  <div class="flex space-x-2">
    <button
      :disabled="restoring || deleting"
      @click="handleRestore"
      class="px-3 py-1 rounded text-sm"
      :class="restoring ? 'text-cc-9' : 'bg-green-600 text-white hover:bg-green-700'"
    >
      {{ restoring ? 'Restoring...' : 'Restore' }}
    </button>

    <button
      :disabled="restoring || deleting"
      @click="showDeleteModal = true"
      class="px-3 py-1 rounded text-sm"
      :class="deleting ? 'text-cc-9' : 'bg-cc-13 text-white hover:bg-red-600'"
    >
      {{ deleting ? 'Deleting...' : 'Delete Permanently' }}
    </button>
  </div>

  <!-- Modal -->
  <div v-if="showDeleteModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div class="bg-cc-17 border-2 border-red-600 text-cc-1 p-6 rounded-md max-w-sm w-full">
      <p class="font-bold mb-2 text-lg">Are you sure you want to PERMANENTLY delete this work?</p>
      <p class="text-sm text-cc-9 mb-4">“{{ pen.title }}” will be gone forever. Even Codecaine support has no way to get it back. Be sure!</p>
      <div class="flex justify-end space-x-2">
        <button @click="showDeleteModal = false" class="bg-cc-13 px-4 py-2 rounded">Cancel</button>
        <button @click="handleDelete" class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Delete</button>
      </div>
    </div>
  </div>
</div>
</template>
<script setup>
import { ref } from 'vue';
defineProps({
  pen: Object, // 單一作品資料
  onRestore: Function,
  onDelete: Function
})

const restoring = ref(false)
const deleting = ref(false)
const showDeleteModal = ref(false)

</script>