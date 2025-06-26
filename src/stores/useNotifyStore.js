import { defineStore } from "pinia";
import { ref, computed } from "vue";
import api from "@/config/api";

export const useNotifyStore = defineStore("notify", () => {
  const notifications = ref([]);
  const loading = ref(false);
  const unreadCount = computed(
    () => notifications.value.filter((n) => !n.is_read).length
  );

  async function fetchNotifications() {
    loading.value = true;
    try {
      const res = await api.get("/api/notify");
      notifications.value = res.data || [];
    } catch (e) {
      notifications.value = [];
    } finally {
      loading.value = false;
    }
  }

  async function markAllAsRead() {
    try {
      await api.patch("/api/notify/read-all");
      notifications.value = notifications.value.map((n) => ({
        ...n,
        is_read: true,
      }));
    } catch (e) {
      console.error("Failed to mark notifications as read", e);
    }
  }

  return {
    notifications,
    loading,
    unreadCount,
    fetchNotifications,
    markAllAsRead,
  };
});
