<template>
  <div
    v-show="isMounted"
    class="layout transition-all duration-400 ease-in-out"
    :style="{ gridTemplateColumns: layoutColumns }">
    <MainSidebar
      class="sidebar"
      v-if="!isCompactScreen"
      @toggle="toggleSidebar" />

    <SubHeader class="header" />

    <RouterView v-slot="{ Component }">
      <component
        :is="Component"
        class="content" />
    </RouterView>

    <SubFooter class="footer" />

    <PenDetailModal
      v-if="modalStore.showDetailModal"
      :pen-id="modalStore.penId"
      :from="modalStore.from"
      @close="modalStore.closeModal" />
  </div>
  <ConfirmModal
    v-if="msg.show"
    :variant="msg.variant"
    :confirming="msg.confirming"
    :loadingText="msg.loadingText"
    :confirm-text="msg.confirmText"
    :cancel-text="msg.cancelText"
    @confirm="msg.close(true)"
    @cancel="msg.close(false)">
    <template #title>{{ msg.title }}</template>
    <template #message
      ><p>{{ msg.message }}</p></template
    >
  </ConfirmModal>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import { useModalStore } from "@/stores/useModalStore";
import SubHeader from "@/components/SubHeader.vue";
import SubFooter from "@/components/SubFooter.vue";
import MainSidebar from "@/components/MainSidebar.vue";
import PenDetailModal from "@/components/PenDetails/PenDetailModal.vue";
import { useMsgStore } from "@/stores/useMsgStore";
import ConfirmModal from "@/components/ui/ConfirmModal.vue";

const msg = useMsgStore();
const modalStore = useModalStore();
const isMounted = ref(false);
const screenWidth = ref(window.innerWidth);
const isCompactScreen = computed(() => screenWidth.value <= 830);
const isSidebarOpen = ref(true);

const layoutColumns = computed(() => {
  if (isCompactScreen.value) {
    return "1fr";
  }
  return isSidebarOpen.value ? "160px 1fr" : "12px 1fr";
});
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
  localStorage.setItem("sidebarOpen", isSidebarOpen.value);
};
const handleResize = () => {
  screenWidth.value = window.innerWidth;
  if (screenWidth.value <= 830) {
    isSidebarOpen.value = false;
  } else {
    const stored = localStorage.getItem("sidebarOpen");
    if (stored !== null) {
      isSidebarOpen.value = stored === "true";
    }
  }
};

watch(screenWidth, () => handleResize());

onMounted(() => {
  const storedSidebarOpen = localStorage.getItem("sidebarOpen");
  if (storedSidebarOpen !== null) {
    isSidebarOpen.value = storedSidebarOpen === "true";
  }
  screenWidth.value = window.innerWidth;
  window.addEventListener("resize", handleResize);
  isMounted.value = true;
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});
</script>

<style scoped>
.layout {
  display: grid;
  grid-template-areas:
    "sidebar header"
    "sidebar content"
    "sidebar footer";
  grid-template-rows: 75px 1fr auto;
  min-height: 100vh;
  overflow: hidden;
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
