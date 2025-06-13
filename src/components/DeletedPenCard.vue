<template>
  <div class="flex justify-between items-center p-2 border-b border-cc-14">
    <!-- 左邊作品標題 -->

    <div class="text-cc-10 font-semibold flex">
      <PensIcon class="fill-current w-4 mr-2" />
      <span class="text-cc-1 truncate">{{ pen.title }}</span>
    </div>

    <!-- 右邊按鈕 -->
    <div class="flex space-x-2">
      <button
        :disabled="restoring || deleting"
        @click="handleRestore"
        class="px-2 py-0.5 rounded-xs text-xs whitespace-nowrap"
        :class="
          restoring ? 'text-cc-9' : 'bg-cc-13 text-white hover:bg-green-700'
        "
      >
        {{ restoring ? "Restoring..." : "Restore" }}
      </button>

      <button
        :disabled="restoring || deleting"
        @click="showDeleteModal = true"
        class="px-2 py-0.5 rounded-xs text-xs whitespace-nowrap"
        :class="deleting ? 'text-cc-9' : 'bg-cc-13 text-white hover:bg-red-600'"
      >
        {{ deleting ? "Deleting..." : "Delete Permanently" }}
      </button>
    </div>

    <!-- Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <div
        class="bg-cc-17 border-8 border-cc-red text-cc-1 p-6 rounded-md max-w-sm w-full"
      >
        <p class="font-bold mb-2 text-lg">
          Are you sure you want to PERMANENTLY delete this work?
        </p>
        <p class="text-xs text-cc-1 mb-4">
          “{{ pen.title }}” will be gone forever. Even Codecaine support has no
          way to get it back. <br />
          Be sure!
        </p>
        <div class="flex text-sm justify-start space-x-2">
          <button
            @click="handleDelete"
            :disabled="deleting"
            class="bg-cc-red text-white px-4.5 py-2.5 rounded hover:bg-cc-red-dark"
          >
            {{ deleting ? "Deleting..." : "Delete" }}
          </button>
          <button
            @click="showDeleteModal = false"
            class="bg-cc-13 px-4.5 py-2.5 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";

import PensIcon from "./icons/PensIcon.vue";

defineProps({
  pen: Object, // 單一作品資料
});
const emit = defineEmits(["restore", "delete"]);

const restoring = ref(false);
const deleting = ref(false);
const showDeleteModal = ref(false);

async function handleDelete() {
  try {
    deleting.value = true;
    showDeleteModal.value = false;
    emit("delete");
    // 改成 Toast
  } catch (err) {
    alert("系統發生錯誤，請稍後再試");
  } finally {
    deleting.value = false;
  }
}

async function handleRestore() {
  try {
    restoring.value = true;
    emit("delete");

    // 還原成功後可以加 toast 或 log
    // showToast({ type: "success", message: "Restored!" });
  } catch (err) {
    alert("系統發生錯誤，請稍後再試")
    console.error("還原失敗", err);
    // showToast({ type: "error", message: "Restore failed." });
  } finally {
    restoring.value = false;
  }
}
</script>
