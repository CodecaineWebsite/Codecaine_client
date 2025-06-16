<template>
  <div class="content mt-6">
    <PenCardLayout
      :pens="pens"
      mode="grid"
      @pen-clicked="modalStore.openPenDetailModal($event)"
    />
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

const fetchCaines = async () => {
  try {
    const res = await api.get(
      `/api/usersCaines/${route.params.username}/private`,
      {
        params: { page: page.value, pageSize },
      }
    );
    pens.value = res.data.results || [];
    totalPages.value = Math.ceil(res.data.total / pageSize);
    if (pens.value.length === 0) {
      console.warn("⚠️ No private Caines found.");
    }
  } catch (error) {
    console.error("❌ Failed to load private Caines:", error);
    pens.value = [];
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

onMounted(fetchCaines);
</script>
