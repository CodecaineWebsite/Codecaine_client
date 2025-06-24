<template>
  <button
    @click="handleClick"
    class="flex items-center gap-1 bg-card-button-primary hover-bg-card-hover text-white px-3 py-0.5 rounded-lg font-medium text-sm transition select-none cursor-pointer">
    <span>
      <HeartIcon
        class="w-4"
        :class="isLiked ? 'fill-cc-red' : 'fill-current'" />
    </span>
    <span> {{ favoritesCount }}</span>
  </button>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/stores/useAuthStore";
import { useMsgStore } from "@/stores/useMsgStore";
import { useRouter } from "vue-router";
import HeartIcon from "@/components/icons/HeartIcon.vue";
import api from "@/config/api";

const msg = useMsgStore();
const authStore = useAuthStore();
const router = useRouter();
const isLiked = ref(false);
const favoritesCount = ref(0);
const props = defineProps({
  targetPen: {
    type: [String, Number],
    required: true,
  },
});

const handleClick = async () => {
  if (!authStore.user) {
    msg.open({
      title: "Please log in",
      message: "You must be logged in to favorite this work.",
      variant: "warning",
      confirmText: "Go to Login",
      cancelText: "Cancel",
      onConfirm: () => {
        router.push("/login");
      },
    });
    return;
  }

  try {
    if (isLiked.value == false) {
      const res = await api.post(`/api/favorites/`, {
        pen_id: props.targetPen,
      });
      isLiked.value = true;
      favoritesCount.value += 1;
    } else if (isLiked.value == true) {
      const res = await api.delete(`/api/favorites/`, {
        data: {
          pen_id: props.targetPen,
        },
      });
      isLiked.value = false;
      favoritesCount.value -= 1;
    }
  } catch (error) {
    console.error("fetch favorite error ", error);
  }
};
const checkFavorite = async () => {
  if (!authStore.user) {
    isLiked.value = false;
    return;
  }
  const res = await api.get(`/api/favorites/check/${props.targetPen}/`);
  isLiked.value = res.data.liked;
};
const countFavorite = async () => {
  const res = await api.get(`/api/favorites/count/${props.targetPen}/`);
  favoritesCount.value = res.data.favoritesCount || 0;
};

onMounted(() => {
  checkFavorite();
  countFavorite();
});
</script>
