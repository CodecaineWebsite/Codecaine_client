<template>
  <div class="content mt-6">
    <PenCardLayout
      v-if="!isLoading && pens.length > 0"
      :pens="pens"
      mode="grid"
      @pen-clicked="modalStore.openPenDetailModal($event)"
    />
    <div
      v-else-if="!isLoading && pens.length === 0"
      class="justify-center flex mt-12"
    >
      <p class="text-4xl bg-gray-800 p-12 rounded-lg">
        ⚠️ No Loved Caines found.
      </p>
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
import api from "@/config/api";
const router = useRouter();
const route = useRoute();
const pens = ref([]);
const page = ref(Number(route.query.page) || 1);
const pageSize = 6;
const totalPages = ref(0);
const isLoading = ref(true);

const fetchCaines = async () => {
  isLoading.value = true;
  try {
    const res = await api.get(`/api/favorites/${route.params.username}`, {
      params: { page: page.value, pageSize },
    });
    pens.value = res.data.results || [];
    totalPages.value = Math.ceil(res.data.total / pageSize);
  } catch (error) {
    console.error("❌ Failed to load Caines:", error);
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
