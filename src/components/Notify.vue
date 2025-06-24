<template>
  <div
    class="relative"
    @click="toggleDropdown">
    <!-- 鈴鐺圖示 -->
    <button class="relative focus:outline-none">
      🔔
      <span
        v-if="unreadCount > 0"
        class="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
        {{ unreadCount }}
      </span>
    </button>

    <!-- 下拉通知清單 -->
    <div
      v-if="showDropdown"
      class="absolute right-0 mt-2 w-64 bg-white border border-gray-300 rounded shadow-lg z-50">
      <ul>
        <li
          v-for="notification in notifications"
          :key="notification.id"
          class="px-4 py-2 hover:bg-gray-100 cursor-pointer">
          {{ notification.message }}
          <div class="text-xs text-gray-400">
            {{ formatDate(notification.created_at) }}
          </div>
        </li>
        <li
          v-if="notifications.length === 0"
          class="px-4 py-2 text-gray-500">
          目前沒有通知
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "@/config/api";

const notifications = ref([]);
const unreadCount = ref(0);
const showDropdown = ref(false);

function toggleDropdown() {
  showDropdown.value = !showDropdown.value;
}

// 格式化日期
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString();
}

async function fetchNotifications() {
  try {
    // 這裡用假的API，實際換成你後端的通知API
    const res = await api.get("/api/notify");
    console.log("Fetched notifications:", res);

    notifications.value = data;

    // 計算未讀數量 (假設 notification 有 is_read 屬性)
    unreadCount.value = data.filter((n) => !n.is_read).length;
  } catch (error) {
    console.error("Error fetching notifications:", error);
  }
}

onMounted(() => {
  fetchNotifications();
});
</script>

<style scoped>
/* 你可以加點樣式讓它看起來更好 */
</style>
