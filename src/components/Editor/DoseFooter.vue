<script setup>
import { storeToRefs } from "pinia";
import { useWorkStore } from "@/stores/useWorkStore";
import EditorSmallButton from "@/components/Editor/EditorSmallButton.vue";
import { useRoute, useRouter } from "vue-router";
import PenDetailModal from "@/components/PenDetails/PenDetailModal.vue";
import { useModalStore } from "@/stores/useModalStore";
import { useToastStore } from "@/stores/useToastStore";

const toastStore = useToastStore();

const route = useRoute();
const router = useRouter();
const workStore = useWorkStore();
const modalStore = useModalStore();
const { showToast } = toastStore;
const { moveToTrash } = workStore;
const { currentWork, currentId } = storeToRefs(workStore);
function openPenDetailModal() {
  if (!currentId.value) {
    return;
  }
  modalStore.openModal(currentId.value, "editor");
}

const handleMoveToTrash = async () => {
  const confirmed = window.confirm(
    "Are you sure you want to move this work to the trash? You can restore it later from the trash."
  );
  if (!confirmed) return;
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
  }
};

defineProps({
  isConsoleShow: Boolean,
});
const emit = defineEmits(["toggle-console"]);

const handleToggleConsole = () => {
  emit("toggle-console");
};
</script>
<template>
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
        @click.prevent="handleMoveToTrash"
        v-if="currentId > 0"
        >Delete</EditorSmallButton
      >
    </div>
  </footer>
</template>
