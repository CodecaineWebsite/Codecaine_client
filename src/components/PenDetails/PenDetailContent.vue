<script setup>
import { defineProps, computed } from "vue";
import CommentList from "@/components/Comments/CommentList.vue";
import { useAuthStore } from "@/stores/useAuthStore.js";
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
      <!-- 描述內容（若有）或提示 -->
      <div v-if="pen.description" class="space-y-2">
        <h2 class="font-semibold text-lg">Description</h2>
        <p class="text-sm text-gray-300 whitespace-pre-wrap">
          {{ pen.description }}
        </p>
      </div>
      <div v-else-if="isAuthor" class="text-sm text-yellow-400">
        No description. Pens with descriptions are more helpful and easier to
        find.
      </div>
      <!-- 標籤內容（若有）或提示 -->
      <div v-if="pen.tags?.length" class="space-y-2">
        <div class="flex flex-wrap gap-2">
          <span
            v-for="tag in pen.tags"
            :key="tag"
            class="bg-blue-800 px-2 py-1 rounded text-xs"
          >
            #{{ tag }}
          </span>
        </div>
      </div>
      <div v-else-if="isAuthor" class="text-sm text-yellow-400">
        No tags. Pens with tags are more helpful and easier to find.
      </div>
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
