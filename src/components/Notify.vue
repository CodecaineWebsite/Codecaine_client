<template>
  <div class="relative">
    <button
      class="relative focus:outline-none cursor-pointer"
      @click="toggleDropdown"
    >
      <BellIcon />
      <span
        v-if="notifyStore.unreadCount > 0"
        class="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full shadow"
      >
        {{ notifyStore.unreadCount }}
      </span>
    </button>

    <div
      v-if="showDropdown"
      class="absolute right-0 mt-2 w-72 bg-[#23262f] border border-[#2C303A] rounded shadow-lg z-50"
    >
      <ul>
        <li
          v-for="notification in notifyStore.notifications.slice(0, 7)"
          class="px-4 py-2 hover:bg-[#2C303A] cursor-pointer flex gap-2 items-start transition"
        >
          <img
            v-if="notification.sender && notification.sender.profile_image_url"
            :src="notification.sender.profile_image_url"
            class="w-8 h-8 object-cover rounded"
            alt="avatar"
          />
          <div class="flex-1">
            <div class="font-medium text-[#ececf1] flex items-center gap-1">
              {{
                notification.sender?.display_name ||
                notification.sender?.username ||
                "System"
              }}
              <span
                v-if="!notification.is_read"
                class="ml-1 w-2 h-2 rounded-full bg-red-500 inline-block"
                title="Unread"
              ></span>
            </div>
            <div class="text-sm text-gray-300">
              <template v-if="notification.type === 'comment'">
                Commented on
                <span class="font-semibold text-[#05DF72]">{{
                  notification.pen?.title || "Untitled Pen"
                }}</span
                >:
                <span class="italic"
                  >"{{ notification.comment?.content }}"</span
                >
              </template>
              <template v-else-if="notification.type === 'favorite'">
                Favorited your pen
                <span class="font-semibold text-[#05DF72]">{{
                  notification.pen?.title
                }}</span>
              </template>
              <template v-else-if="notification.type === 'follow'">
                Started following you
              </template>
              <template v-else>
                {{ notification.message || "New notification" }}
              </template>
            </div>
            <div class="text-xs text-gray-500">
              {{ formatDate(notification.created_at) }}
            </div>
          </div>
        </li>
        <li
          v-if="notifyStore.notifications.length === 0"
          class="px-4 py-2 text-gray-400 text-center"
        >
          No notifications yet
        </li>
        <li
          v-if="notifyStore.notifications.length >= 7"
          class="px-4 py-2 text-center bg-gray-700 cursor-pointer transition text-[#05DF72] font-semibold group hover:text-white"
          @click="notify"
        >
          <button class="text-inherit cursor-pointer">
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
import BellIcon from "@/components/icons/BellIcon.vue";

const router = useRouter();
const notifyStore = useNotifyStore();
const showDropdown = ref(false);

const notify = () => {
  showDropdown.value = !showDropdown.value;
  router.push({ name: "notifications" });
};
const toggleDropdown = async () => {
  await notifyStore.fetchNotifications();
  await notifyStore.markAllAsRead();
  showDropdown.value = !showDropdown.value;
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString();
};

onMounted(async () => {
  await notifyStore.fetchNotifications();
});
</script>
