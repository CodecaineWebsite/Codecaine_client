<script setup>
import { defineProps, computed } from "vue";
import { useAuthStore } from "@/stores/useAuthStore.js";
import CommentList from "@/components/Comments/CommentList.vue";
import PenDetailDescription from "@/components/PenDetails/PenDetailDescription.vue";
import PenDetailTags from "@/components/PenDetails/PenDetailTags.vue";
const authStore = useAuthStore();
const props = defineProps({
  pen: {
    type: Object,
    required: true,
  },
});
const isAuthor = computed(() => authStore.user?.uid === props.pen.user_id);
</script>
<template>
  <div
    class="grid gap-y-6 gap-x-8 p-8 max-w-screen-xl mx-auto grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,300px)] grid-rows-[auto_auto_1fr_auto]"
  >
    <!-- 描述與標籤區塊 -->
    <div class="description-section col-span-1 row-span-2 space-y-4">
      <PenDetailDescription :pen="pen" :currentUserId="authStore.user?.uid" />
      <PenDetailTags :pen="pen" :currentUserId="authStore.user?.uid" />
    </div>
    <!-- aside：右側 meta 區 -->
    <aside class="meta-section lg:col-start-2 lg:row-span-3 space-y-4">
      <!-- Share, likes, time, view 等 -->
    </aside>
  </div>
  <!-- 留言區塊 -->
  <div class="comment-section col-span-1 row-start-3 space-y-4">
    <CommentList :penId="pen.id" @close="$emit('close')" />
  </div>
</template>
