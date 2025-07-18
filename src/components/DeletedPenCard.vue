<template>
  <div class="flex justify-between items-center p-2 border-b border-cc-14">
    <!-- 左邊作品標題 -->

    <div class="text-cc-10 font-semibold flex">
      <PensIcon class="fill-current w-4 mr-2" />
      <span class="text-cc-1 truncate">{{ pen.title || "Untitled" }} </span>
    </div>

    <!-- 右邊按鈕 -->
    <div class="flex space-x-2">
      <button
        :disabled="restoring || deleting"
        @click="handleRestore"
        class="px-2 py-0.5 rounded-xs text-xs whitespace-nowrap cursor-pointer"
        :class="
          restoring ? 'text-cc-9' : 'bg-cc-13 text-white hover:bg-green-700'
        "
      >
        {{ restoring ? "Restoring..." : "Restore" }}
      </button>

      <button
        :disabled="restoring || deleting"
        @click="showDeleteModal = true"
        class="px-2 py-0.5 rounded-xs text-xs whitespace-nowrap cursor-pointer"
        :class="deleting ? 'text-cc-9' : 'bg-cc-13 text-white hover:bg-red-600'"
      >
        {{ deleting ? "Deleting..." : "Delete Permanently" }}
      </button>
    </div>

    <ConfirmModal
      v-if="showDeleteModal"
      variant="danger"
      :confirm-text="'Delete'"
      :cancelText="'Cancel'"
      :confirming="deleting"
      :loadingText="'Deleting...'"
      @confirm="handleDelete"
      @cancel="showDeleteModal = false"
    >
      <template #title>
        Are you sure you want to PERMANENTLY delete this work?
      </template>

      <template #message>
        <p>
          “<strong>{{ pen.title }}</strong
          >” will be gone forever. Even Codecaine support has no way to get it
          back.<br />Be sure!
        </p>
      </template>
    </ConfirmModal>
  </div>
</template>
<script setup>
import { ref } from "vue";
import ConfirmModal from "@/components/ui/ConfirmModal.vue";
import PensIcon from "@/components/icons/PensIcon.vue";
import { useToastStore } from "@/stores/useToastStore";

const toastStore = useToastStore();
const { showToast } = toastStore;

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
    await emit("delete");
  } catch (err) {
    showToast({
      message: "An error occurred. Please try again later.",
      variant: "danger",
    });
  } finally {
    deleting.value = false;
  }
}

async function handleRestore() {
  try {
    restoring.value = true;
    await emit("restore");
    showToast({
      message: "Restored!",
      variant: "success",
    });
  } catch (err) {
    showToast({
      massage: "An error occurred. Please try again later.",
      variant: "danger",
    });
  } finally {
    restoring.value = false;
  }
}
</script>
