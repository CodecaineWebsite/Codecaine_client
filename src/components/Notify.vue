<template>
  <div class="relative" @click="toggleDropdown">
    <button class="relative focus:outline-none">
      🔔
      <span
        v-if="notifyStore.unreadCount > 0"
        class="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full"
      >
        {{ notifyStore.unreadCount }}
      </span>
    </button>

    <div
      v-if="showDropdown"
      class="absolute right-0 mt-2 w-64 bg-white border border-gray-300 rounded shadow-lg z-50"
    >
      <ul>
        <li
          v-for="notification in notifyStore.notifications.slice(0, 7)"
          :key="notification.id"
          class="px-4 py-2 hover:bg-gray-100 cursor-pointer flex gap-2 items-start"
        >
          <img
            v-if="notification.sender && notification.sender.profile_image_url"
            :src="notification.sender.profile_image_url"
            class="w-8 h-8 rounded-full object-cover"
            alt="avatar"
          />
          <div class="flex-1">
            <div class="font-medium text-gray-800">
              {{
                notification.sender?.display_name ||
                notification.sender?.username ||
                "System"
              }}
            </div>
            <div class="text-sm text-gray-700">
              <template v-if="notification.type === 'comment'">
                Commented on
                <span class="font-semibold">{{ notification.pen?.title }}</span
                >:
                <span class="italic"
                  >"{{ notification.comment?.content }}"</span
                >
              </template>
              <template v-else-if="notification.type === 'favorite'">
                Favorited your pen
                <span class="font-semibold">{{ notification.pen?.title }}</span>
              </template>
              <template v-else-if="notification.type === 'follow'">
                Started following you
              </template>
              <template v-else>
                {{ notification.message || "New notification" }}
              </template>
            </div>
            <div class="text-xs text-gray-400">
              {{ formatDate(notification.created_at) }}
            </div>
          </div>
        </li>
        <li
          v-if="notifyStore.notifications.length === 0"
          class="px-4 py-2 text-gray-500"
        >
          No notifications yet
        </li>
        <li
          v-if="notifyStore.notifications.length >= 7"
          class="px-4 py-2 text-center"
        >
          <button
            class="text-blue-500 hover:underline cursor-pointer"
            @click="notify"
          >
            View all notifications
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useNotifyStore } from "@/stores/useNotifyStore";

const router = useRouter();
const notifyStore = useNotifyStore();
const showDropdown = ref(false);

const notify = () => router.push({ name: "notifications" });
const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString();
};

onMounted(() => {
  notifyStore.fetchNotifications();
});
</script>
