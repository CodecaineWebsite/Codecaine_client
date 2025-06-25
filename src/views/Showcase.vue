<template>
  <div class="content mt-6">
    <PenCardLayout
      v-if="!isLoading && pens.length > 0"
      :pens="[...pens].sort(() => Math.random() - 0.5).slice(0, 6)"
      mode="grid"
      @pen-clicked="modalStore.openPenDetailModal($event)"
    />
    <div
      class="flex justify-center m-12 mb-24"
      v-if="!isLoading && pens.length > 0"
    >
      <button
        class="text-cc-1 p-4 bg-cc-14 rounded-md hover:bg-cc-13 transition-all cursor-pointer"
        @click="goAllCaines"
      >
        View All Caines
      </button>
    </div>
    <div
      class="justify-center flex m-12"
      v-else-if="!isLoading && pens.length === 0"
    >
      <p class="text-4xl bg-gray-800 p-12 rounded-lg">
        ⚠️ No Caines found.
        <a href="/dose" class="text-blue-200 hover:text-blue-400">
          Go create some first!
        </a>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import PenCardLayout from "@/components/PenCardLayout.vue";
import api from "@/config/api";

const router = useRouter();
const route = useRoute();
const pens = ref([]);
const isLoading = ref(true);

const goAllCaines = () => {
  router.push({ name: "dosesPublic" });
};
const fetchCaines = async () => {
  isLoading.value = true;
  try {
    const res = await api.get(
      `/api/usersCaines/${route.params.username}/public`
    );
    pens.value = res.data.results || [];
  } catch (error) {
    console.error("Failed to load Caines:", error);
    pens.value = [];
  } finally {
    isLoading.value = false;
  }
};

watch(
  () => route.params.username,
  (newUsername) => {
    if (newUsername) {
      fetchCaines();
    }
  }
);

onMounted(() => {
  fetchCaines();
});
</script>
