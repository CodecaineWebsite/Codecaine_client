<script setup>
import { computed } from "vue";
import { useAuthStore } from "@/stores/useAuthStore.js";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import CommentList from "@/components/Comments/CommentList.vue";
import PenDetailDescription from "@/components/PenDetails/PenDetailDescription.vue";
import PenDetailTags from "@/components/PenDetails/PenDetailTags.vue";
import PenShareBox from "@/components/PenDetails/PenShareBox.vue";
import PenTimestamps from "@/components/PenDetails/PenTimeStamp.vue";
import PenStats from "@/components/PenDetails/PenStats.vue";
dayjs.extend(utc);
dayjs.extend(timezone);

const authStore = useAuthStore();
const props = defineProps({
  pen: {
    type: Object,
    required: true,
  },
});
</script>
<template>
  <div
    class="grid gap-y-6 gap-x-8 p-8 max-w-screen-xl mx-auto grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,300px)] grid-rows-[auto_auto_1fr_auto]"
  >
    <div class="description-section col-span-1 row-span-2 space-y-4">
      <PenDetailDescription :pen="pen" :currentUserId="authStore.user?.uid" />
      <PenDetailTags :pen="pen" :currentUserId="authStore.user?.uid" />
      <CommentList :penId="pen.id" @close="$emit('close')" />
    </div>
    <!-- aside：右側 meta 區 -->
    <aside class="meta-section lg:col-start-2 lg:row-span-3 space-y-4">
      <PenShareBox :pen-id="pen.id" :username="pen.username" />
      <PenTimestamps :pen="pen" />
      <PenStats :likes="pen.favorites" :views="pen.views_count" />
    </aside>
  </div>
</template>
