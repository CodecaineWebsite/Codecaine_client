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

  return {
    notifications,
    loading,
    unreadCount,
    fetchNotifications,
  };
});
