<template>
  <div
    v-show="isMounted"
    class="layout transition-all duration-400 ease-in-out"
    :style="{
      gridTemplateColumns: layoutColumns,
      gridTemplateAreas: layoutAreas,
    }"
  >
    <MainSidebar
      class="sidebar"
      v-if="!isCompactScreen"
      @toggle="toggleSidebar"
    />

    <SubHeader class="header" />

    <RouterView v-slot="{ Component }">
      <component :is="Component" class="content" />
    </RouterView>

    <SubFooter class="footer" />

    <PenDetailModal
      v-if="modalStore.showDetailModal"
      :pen-id="modalStore.penId"
      :from="modalStore.from"
      @close="modalStore.closeModal"
    />
  </div>
  <ConfirmModal
    v-if="msg.show"
    :variant="msg.variant"
    :confirming="msg.confirming"
    :loadingText="msg.loadingText"
    :confirm-text="msg.confirmText"
    :cancel-text="msg.cancelText"
    @confirm="msg.close(true)"
    @cancel="msg.close(false)"
  >
    <template #title>{{ msg.title }}</template>
    <template #message
      ><p>{{ msg.message }}</p></template
    >
  </ConfirmModal>

  <ToastContainer />
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useLocalStorage, useWindowSize, whenever } from "@vueuse/core";
import { useModalStore } from "@/stores/useModalStore";
import SubHeader from "@/components/SubHeader.vue";
import SubFooter from "@/components/SubFooter.vue";
import MainSidebar from "@/components/MainSidebar.vue";
import PenDetailModal from "@/components/PenDetails/PenDetailModal.vue";
import { useMsgStore } from "@/stores/useMsgStore";
import ConfirmModal from "@/components/ui/ConfirmModal.vue";
import ToastContainer from "@/components/Toast/ToastContainer.vue";

const msg = useMsgStore();
const modalStore = useModalStore();
const isMounted = ref(false);

const isSidebarOpen = useLocalStorage("sidebarOpen", true);
const { width: screenWidth } = useWindowSize();

const isCompactScreen = computed(() => screenWidth.value <= 830);

const layoutColumns = computed(() => {
  if (isCompactScreen.value) {
    return "1fr";
  }
  return isSidebarOpen.value ? "160px 1fr" : "12px 1fr";
});

const layoutAreas = computed(() => {
  if (isCompactScreen.value) {
    return `"header" "content" "footer"`;
  }
  return `"sidebar header" "sidebar content" "sidebar footer"`;
});

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

whenever(isCompactScreen, (compact) => {
  if (compact) {
    isSidebarOpen.value = false;
  }
});

watch(
  () => isCompactScreen.value,
  () => {
    isMounted.value = true;
  },
  { immediate: true }
);
</script>

<style>
.layout {
  display: grid;
  grid-template-rows: 75px 1fr auto;
  min-height: 100vh;
  overflow: auto;
}

.sidebar {
  grid-area: sidebar;
}
.header {
  grid-area: header;
}
.content {
  grid-area: content;
  overflow-y: auto;
}
.footer {
  grid-area: footer;
}
</style>
