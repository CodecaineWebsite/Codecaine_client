<template>
  <button
    @click="handleClick"
    class="flex items-center gap-1 bg-card-button-primary hover-bg-card-hover text-white px-3 py-0.5 rounded-lg font-medium text-sm transition select-none cursor-pointer"
  >
    <span>
      <HeartIcon
        class="w-4"
        :class="isLiked ? 'fill-cc-red' : 'fill-current'"
      />
    </span>
    <span> {{ favoritesCount }}</span>
  </button>
</template>

<script setup>
import { onMounted, computed, watch } from "vue";
import { useAuthStore } from "@/stores/useAuthStore";
import { useMsgStore } from "@/stores/useMsgStore";
import { useFavoritesStore } from "@/stores/useFavoritesStore";
import { useRouter } from "vue-router";
import HeartIcon from "@/components/icons/HeartIcon.vue";

const router = useRouter();
const msg = useMsgStore();
const authStore = useAuthStore();
const favoritesStore = useFavoritesStore();
const favorite = computed(() => favoritesStore.getFavorite(props.targetPen));
const isLiked = computed(() => favorite.value.isLiked);
const favoritesCount = computed(() => favorite.value.favoritesCount);
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
    await favoritesStore.toggleFavorite(props.targetPen);
  } catch (error) {
    console.error("fetch favorite error ", error);
  }
};

onMounted(async () => {
  console.log("targetPen on mount", props.targetPen);
  if (props.targetPen !== undefined) {
    const stored = favoritesStore.getFavorite(props.targetPen);
    if (stored.isLiked === undefined || stored.favoritesCount === undefined) {
      await favoritesStore.fetchFavoriteState(props.targetPen);
    }
  }
});

watch(
  () => props.targetPen,
  (newVal) => {
    if (newVal) {
      favoritesStore.fetchFavoriteState(newVal);
    }
  },
  { immediate: true }
);
</script>
