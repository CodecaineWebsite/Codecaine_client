<template>
  <div class="content mt-6">
    <PenCardLayout
      :pens="[...pens].sort(() => Math.random() - 0.5).slice(0, 6)"
      mode="grid"
      @pen-clicked="modalStore.openPenDetailModal($event)" />
    <div class="flex justify-center m-12 mb-24">
      <button
        class="text-cc-1 p-4 bg-cc-14 rounded-md hover:bg-cc-13 transition-all cursor-pointer"
        @click="goAllCaines">
        View All Caines
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useRouter } from "vue-router";
import PenCardLayout from "@/components/PenCardLayout.vue";
import api from "@/config/api";
const router = useRouter();
const goAllCaines = () => {
  router.push({ name: "cainesPublic" });
};
const pens = ref([]);

onMounted(async () => {
  const res = await api.get("/api/my/pens");
  console.log("🚀 載入我的 Caines 成功：", res.data);
  pens.value = res.data.results || [];
  if (pens.value.length === 0) {
    console.warn("⚠️ 沒有找到任何 Caines，請先創建一些！");
  }
  // 這裡可以模擬 API 載入後再更新
  // setTimeout(() => {
  //   pens.value = 真正的API資料;
  // }, 2000);
});
</script>
