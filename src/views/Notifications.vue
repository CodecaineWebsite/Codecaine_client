<template>
  <div class="max-w-2xl mx-auto py-8 px-4 w-full">
    <h1 class="text-2xl font-bold mb-6 text-white">All Notifications</h1>
    <div v-if="notifyStore.loading" class="text-center text-gray-400 py-8">
      Loading...
    </div>
    <ul v-else>
      <li
        v-for="n in pagedNotifications"
        class="flex gap-3 items-start p-4 mb-2 rounded-lg transition bg-[#23262f] hover:bg-[#2C303A] border border-transparent hover:border-[#05DF72] cursor-pointer"
        :class="{ 'opacity-80': n.is_read }"
        @click="handleNotificationClick(n)"
      >
        <img
          v-if="n.sender && n.sender.profile_image_url"
          :src="n.sender.profile_image_url"
          class="w-10 h-10 rounded object-cover mt-1"
          alt="avatar"
        />
        <div class="flex-1">
          <div class="font-medium text-gray-100">
            {{ n.sender?.display_name || n.sender?.username || "System" }}
          </div>
          <div class="text-sm text-gray-300">
            <template v-if="n.type === 'comment'">
              Commented on
              <span class="font-semibold">{{
                n.pen?.title || "Untitled Dose"
              }}</span
              >:
              <span class="italic">"{{ n.comment?.content }}"</span>
            </template>
            <template v-else-if="n.type === 'favorite'">
              Favorited your pen
              <span class="font-semibold">{{
                n.pen?.title || "Untitled Dose"
              }}</span>
            </template>
            <template v-else-if="n.type === 'follow'">
              Started following you
            </template>
            <template v-else>
              {{ n.message || "New notification" }}
            </template>
          </div>
          <div class="text-xs text-gray-500 mt-1">
            {{ formatDate(n.created_at) }}
            <span v-if="!n.is_read" class="ml-2 text-[#05DF72] font-bold"
              >● Unread</span
            >
          </div>
        </div>
      </li>
      <li
        v-if="pagedNotifications.length === 0"
        class="text-gray-400 text-center py-8"
      >
        No notifications yet
      </li>
    </ul>
    <PaginationNav
      v-if="totalPages > 1"
      :current-page="page"
      :total-pages="totalPages"
      @prev="page--"
      @next="page++"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useNotifyStore } from "@/stores/useNotifyStore";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/useAuthStore";
import { navigateByNotification } from "@/utils/notify";
import PaginationNav from "@/components/PaginationNav.vue";

const authStore = useAuthStore();
const notifyStore = useNotifyStore();

const router = useRouter();
const page = ref(1);
const pageSize = 8;
const totalPages = computed(() =>
  Math.ceil(notifyStore.notifications.length / pageSize)
);

const pagedNotifications = computed(() => {
  const start = (page.value - 1) * pageSize;
  return notifyStore.notifications.slice(start, start + pageSize);
});

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString();
};
const handleNotificationClick = (n) => {
  navigateByNotification(n, router, authStore);
};

onMounted(async () => {
  await notifyStore.fetchNotifications();
});
</script>
