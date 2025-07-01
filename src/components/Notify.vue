<template>
  <div class="relative" ref="dropdownRef">
    <button
      class="relative focus:outline-none cursor-pointer translate-y-1"
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
      class="absolute lg:right-0 lg:mt-2 lg:w-72 w-54 mt-7 -right-12 bg-[#23262f] border border-[#2C303A] rounded shadow-lg z-50"
    >
      <ul>
        <li
          v-for="n in notifyStore.notifications.slice(
            0,
            getNotificationLimit()
          )"
          class="px-4 lg:py-2 hover:bg-[#2C303A] cursor-pointer py-1 flex gap-2 items-start transition"
          @click="handleNotificationClick(n)"
        >
          <img
            v-if="n.sender && n.sender.profile_image_url"
            :src="n.sender.profile_image_url"
            class="w-8 h-8 object-cover rounded flex-shrink-0"
            alt="avatar"
          />
          <div class="flex-1 min-w-0">
            <div class="font-medium text-[#ececf1] flex items-center gap-1">
              <span class="truncate">
                {{ n.sender?.display_name || n.sender?.username || "System" }}
              </span>
              <span
                v-if="!n.is_read"
                class="ml-1 w-2 h-2 rounded-full bg-red-500 inline-block flex-shrink-0"
                title="Unread"
              ></span>
            </div>
            <div class="text-sm text-gray-300">
              <template v-if="n.type === 'comment'">
                Commented on
                <span class="font-semibold text-[#05DF72] break-words">
                  {{ truncateTitle(n.pen?.title) || "Untitled Dose" }} </span
                >:
                <span class="italic break-words"
                  >"{{ truncateContent(n.comment?.content) }}"</span
                >
              </template>
              <template v-else-if="n.type === 'favorite'">
                Favorited your dose
                <span class="font-semibold text-[#05DF72] break-words">
                  {{ truncateTitle(n.pen?.title) || "Untitled Dose" }}
                </span>
              </template>
              <template v-else-if="n.type === 'follow'">
                Started following you
              </template>
              <template v-else>
                <span class="break-words">{{
                  n.message || "New notification"
                }}</span>
              </template>
            </div>
            <div class="text-xs text-gray-500">
              {{ formatDate(n.created_at) }}
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
          v-if="notifyStore.notifications.length >= getNotificationLimit()"
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
import { onClickOutside } from "@vueuse/core";
import { useAuthStore } from "@/stores/useAuthStore";
import { navigateByNotification } from "@/utils/notify";
import BellIcon from "@/components/icons/BellIcon.vue";

const authStore = useAuthStore();
const router = useRouter();
const notifyStore = useNotifyStore();
const showDropdown = ref(false);
const dropdownRef = ref(null);

const getNotificationLimit = () => {
  return window.innerWidth < 1024 ? 4 : 7;
};

// 截斷標題長度
const truncateTitle = (title) => {
  if (!title) return "";
  const maxLength = window.innerWidth < 1024 ? 15 : 25; // 手機版更短
  return title.length > maxLength ? title.slice(0, maxLength) + "..." : title;
};

// 截斷評論內容長度
const truncateContent = (content) => {
  if (!content) return "";
  const maxLength = window.innerWidth < 1024 ? 20 : 30; // 手機版更短
  return content.length > maxLength
    ? content.slice(0, maxLength) + "..."
    : content;
};

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

const handleNotificationClick = (n) => {
  navigateByNotification(n, router, authStore);
};

onMounted(async () => {
  await notifyStore.fetchNotifications();
});

onClickOutside(dropdownRef, () => {
  showDropdown.value = false;
});
</script>
