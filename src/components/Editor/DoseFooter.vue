<script setup>
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useWorkStore } from "@/stores/useWorkStore";
import EditorSmallButton from "@/components/Editor/EditorSmallButton.vue";
import { useRoute, useRouter } from "vue-router";
import PenDetailModal from "@/components/PenDetails/PenDetailModal.vue";
import { useModalStore } from "@/stores/useModalStore";
import { useToastStore } from "@/stores/useToastStore";

import ConfirmModal from "@/components/ui/ConfirmModal.vue";

const toastStore = useToastStore();

const route = useRoute();
const router = useRouter();
const workStore = useWorkStore();
const modalStore = useModalStore();
const { showToast } = toastStore;
const { moveToTrash } = workStore;
const { currentId } = storeToRefs(workStore);

const deleting = ref(false);

const toDelete = () => {
  router.push('/your-work')
}

function openPenDetailModal() {
  if (!currentId.value) {
    return;
  }
  modalStore.openModal(currentId.value, "editor");
}

const showDeleteModal = ref(false);
const handleMoveToTrash = async () => {
  deleting.value = true;
  try {
    const id = currentId.value;
    const success = await moveToTrash(id);

    if (success) {
      console.log(`Work ID: ${id} has been moved to the trash`);
      showToast({
        message: `Work ID: ${id} has been moved to the trash`,
        variant: "success",
      });
      await router.push({ path: "/your-work" });
    } else {
      console.warn(`Move failed: server did not return a success status`);
      showToast({
        message: "Failed to move to trash. Please try again later.",
      });
    }
  } catch (error) {
    console.error("Failed to move to trash:", error);
    showToast({
      message: "Failed to move to trash. Please try again later.",
      variant: "danger",
    });
  } finally {
    deleting.value = false;
  }
};

const emit = defineEmits(["toggle-console"]);

const handleToggleConsole = () => {
  emit("toggle-console");
};
</script>
<template>
  <ConfirmModal
    v-if="showDeleteModal"
    variant="danger"
    :confirm-text="'I understand, delete my Dose'"
    :cancelText="'Cancel'"
    :confirming="deleting"
    :loadingText="'Deleting...'"
    @confirm="handleMoveToTrash"
    @cancel="showDeleteModal = false"
  >
    <template #title>
      Are you sure you want to delete this Dose?
    </template>

    <template #message>
      <p class="mb-5">
        Here's what happens when you delete a Dose:
      </p>
      <ul class="list-disc list-outside pl-4">
        <li>This Dose will no longer be accessible on Codecaine.</li>
        <li>This Dose will be moved to the <a class="text-cc-blue" href="#" @click.prevent="toDelete">Deleted Items section of Your Work</a> for 3 days.</li>
        <li>After 3 days, the Dose is permanently deleted. You can also manually delete it from your Deleted Items.</li>
      </ul>
    </template>
  </ConfirmModal>
  <PenDetailModal
    v-if="modalStore.showDetailModal"
    :pen-id="Number(currentId)"
  />

  <footer
    class="h-8 w-full flex relative justify-between items-center py-[.2rem] px-3 bg-cc-14 text-white"
  >
    <div class="flex items-center h-full gap-2">
      <EditorSmallButton
        class="hover:bg-cc-12"
        @buttonClick="handleToggleConsole"
        >Console</EditorSmallButton
      >
      <EditorSmallButton class="hover:bg-cc-12" @click="openPenDetailModal" v-if="currentId > 0"
        >comment</EditorSmallButton
      >
    </div>
    <div class="flex items-center h-full" >
      <EditorSmallButton
        class="hover:bg-cc-red"
        @click.prevent="showDeleteModal = true"
        v-if="currentId > 0"
      >
        Delete
      </EditorSmallButton>
    </div>
  </footer>
</template>
