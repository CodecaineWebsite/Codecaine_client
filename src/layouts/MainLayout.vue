<template>
  <div
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

    <!-- 如果網址是 details 且 query.modal 存在，就顯示 modal -->
    <PenDetailModal
      v-if="modalStore.showDetailModal"
      :pen-id="modalStore.penId"
      :from="modalStore.from"
      @close="modalStore.closeModal"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, watchEffect, onMounted, onUnmounted } from "vue";
import { useModalStore } from "@/stores/useModalStore";
import SubHeader from "@/components/SubHeader.vue";
import SubFooter from "@/components/SubFooter.vue";
import MainSidebar from "@/components/MainSidebar.vue";
import PenDetailModal from "@/components/PenDetailModal.vue";

const modalStore = useModalStore();

const isSidebarOpen = ref(
  localStorage.getItem("sidebarOpen") === "false" ? false : true
);
const screenWidth = ref(window.innerWidth);
const isCompactScreen = computed(() => screenWidth.value <= 830);

const layoutColumns = computed(() =>
  isSidebarOpen.value ? "160px 1fr" : "12px 1fr"
);

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value;
}

watch(isSidebarOpen, (val) => {
  if (screenWidth.value > 830) {
    localStorage.setItem("sidebarOpen", val);
  }
});

const handleResize = () => {
  screenWidth.value = window.innerWidth;
  if (screenWidth.value <= 830) {
    isSidebarOpen.value = false;
  } else {
    isSidebarOpen.value = true;
  }
};

watchEffect(() => {
  if (screenWidth.value <= 830) {
    isSidebarOpen.value = false;
  } else {
    isSidebarOpen.value = true;
  }
});

onMounted(() => {
  window.addEventListener("resize", handleResize);
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
