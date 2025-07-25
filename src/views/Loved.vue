<template>
  <div class="content mt-6">
    <PenCardLayout
      v-if="!isLoading && pens.length > 0"
      :pens="pens"
      :mode="viewMode"
      @pen-clicked="modalStore.openPenDetailModal($event)"
    />
    <div
      v-else-if="!isLoading && pens.length === 0"
      class="max-w-xl p-8 mb-5 mx-auto bg-cc-14 text-center rounded"
    >
      <h1 class="mb-2 leading-[1.1] font-archivo text-4xl">
        No Loved Doses found.
        
      </h1>
      <a href="/dose" class="text-blue-200 hover:text-blue-400">
          Go create some first!
        </a>
    </div>
    <PaginationNav
      :currentPage="page"
      :totalPages="totalPages"
      @prev="page--"
      @next="page++"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import PenCardLayout from "@/components/PenCardLayout.vue";
import PaginationNav from "@/components/PaginationNav.vue";
import { useLocalStorage } from "@vueuse/core";
import api from "@/config/api";
import { useToastStore } from "@/stores/useToastStore";

const toastStore = useToastStore();
const router = useRouter();
const route = useRoute();
const viewMode = useLocalStorage("dosesViewMode", "grid");
const pens = ref([]);
const page = ref(Number(route.query.page) || 1);
const totalPages = ref(0);
const isLoading = ref(true);
const { showToast } = toastStore;

const fetchCaines = async () => {
  isLoading.value = true;
  try {
    const res = await api.get(`/api/favorites/${route.params.username}`, {
      params: {
        page: page.value,
        view: viewMode.value,
      },
    });
    pens.value = res.data.results || [];
    totalPages.value = res.data.totalPages || 0;
  } catch (error) {
    showToast({
      message: "Failed to load Doses. Please try again later",
      variant: "danger",
    });
    pens.value = [];
  } finally {
    isLoading.value = false;
  }
};

watch(page, (newPage) => {
  router.replace({
    query: { ...route.query, page: newPage },
  });
  fetchCaines();
});

watch(viewMode, () => {
  page.value = 1;
  router.replace({
    query: {
      ...route.query,
      page: 1,
      viewMode: viewMode.value,
    },
  });
  fetchCaines();
});

watch(
  () => route.params.username,
  () => {
    page.value = Number(route.query.page) || 1;
    fetchCaines();
  }
);

onMounted(() => {
  fetchCaines();
});
</script>
