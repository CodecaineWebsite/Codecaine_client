<template>
  <div
    v-show="isMounted"
    class="layout transition-all duration-400 ease-in-out"
    :style="{ gridTemplateColumns: layoutColumns }"
  >
    <!-- Sidebar：830px 以下隱藏 -->
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

    <!-- Modal 詳細頁 -->
    <PenDetailModal
      v-if="modalStore.showDetailModal"
      :pen-id="modalStore.penId"
      :from="modalStore.from"
      @close="modalStore.closeModal"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import { useModalStore } from "@/stores/useModalStore";
import SubHeader from "@/components/SubHeader.vue";
import SubFooter from "@/components/SubFooter.vue";
import MainSidebar from "@/components/MainSidebar.vue";
import PenDetailModal from "@/components/PenDetailModal.vue";

const modalStore = useModalStore();

const isMounted = ref(false); // 解決初始化樣式問題
const screenWidth = ref(window.innerWidth);
const isCompactScreen = computed(() => screenWidth.value <= 830);

// Sidebar 狀態：預設一律為 true，並根據寬度調整
const isSidebarOpen = ref(true);

const layoutColumns = computed(() =>
  isSidebarOpen.value ? "160px 1fr" : "12px 1fr"
);

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value;
  localStorage.setItem("sidebarOpen", isSidebarOpen.value);
}

const handleResize = () => {
  screenWidth.value = window.innerWidth;
  if (screenWidth.value <= 830) {
    isSidebarOpen.value = false;
  } else {
    isSidebarOpen.value = true;
  }
};

watch(screenWidth, () => handleResize());

onMounted(() => {
  window.addEventListener("resize", handleResize);

  // 初始化：螢幕寬度超過 830 則預設開啟 sidebar
  handleResize();
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
