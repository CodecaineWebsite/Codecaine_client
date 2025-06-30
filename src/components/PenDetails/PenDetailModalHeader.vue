<template>
  <header
    v-if="pen"
    class="flex items-center justify-between px-4 pt-4 pb-3 bg-cc-14 rounded-t-[10px] shadow-[0_2px_5px_rgba(0,0,0,0.5)] relative z-[2]"
  >
    <!-- 左區：標題與作者 -->
    <div class="flex flex-1 flex-col min-w-[120px] pr-2 ml-4">
      <h1 class="text-xl font-bold text-white truncate max-w-full">
        {{ pen?.title || 'Untitled' }}
      </h1>
      <div class="flex items-center gap-1 text-sm text-cc-9">
        <RouterLink
          :to="`/${pen.username}`"
          class="flex-shrink truncate max-w-full hover:underline"
        >
          {{ pen.display_name }}
        </RouterLink>
        <span
          v-if="pen.is_pro"
          class="ml-1 bg-cc-yellow text-black text-[10px] font-bold px-1 py-[1px] rounded text-xs"
        >
          PRO
        </span>
        <FollowBtn
          v-if="
            authStore.userProfile &&
            pen.username !== authStore.userProfile.username
          "
          :target-user="pen.username"
        />
      </div>
    </div>

    <!-- 右區：按鈕區 -->
    <div class="flex shrink-0 -mt-[0.125rem] gap-2 items-center">
      <button
        @click="handleFavorite"
        class="inline-flex items-center justify-center relative text-base font-normal truncate cursor-pointer py-[7px] px-[10px] border border-transparent rounded bg-cc-13 hover:bg-cc-12"
        :title="isLiked ? 'Unlike' : 'Like'"
      >
        <HeartIcon
          class="w-5 h-5"
          :class="isLiked ? 'fill-cc-red' : 'fill-white'"
        />
      </button>
      <!-- 暫時隱藏元件 功能做好再開啟 -->
      <PenDetailDropdown
        :is-owner="authStore.userProfile?.username === pen.username"
        :is-pro="pen.is_pro"
        :is-private="pen.is_private"
        :is-following="false"
        :user-name="pen.username"
        @follow="onFollow"
        @togglePrivacy="onTogglePrivacy"
        @delete="onDelete"
      />

      <button
        @click="goToEditor"
        class="inline-flex items-center justify-center relative font-normal truncate cursor-pointer py-[7px] px-[10px] border border-transparent rounded bg-cc-13 hover:bg-cc-12 text-sm text-cc-1"
      >
        View in Editor
      </button>
    </div>
  </header>
</template>
<script setup>
import { ref, watch } from "vue";
import { useAuthStore } from "@/stores/useAuthStore";
import { useModalStore } from "@/stores/useModalStore";
import { useToastStore } from "@/stores/useToastStore";
import { useFavoritesStore } from "@/stores/useFavoritesStore";
import { useRouter, RouterLink } from "vue-router";
import FollowBtn from "@/components/FollowBtn.vue";
import ProTag from "@/components/Editor/ProTag.vue";
import PenDetailDropdown from "@/components/PenDetails/PenDetailDropdown.vue";
import HeartIcon from "@/components/icons/HeartIcon.vue";

const props = defineProps({
  pen: {
    type: Object,
    required: true,
  },
});

const router = useRouter();
const authStore = useAuthStore();
const modalStore = useModalStore();
const favoritesStore = useFavoritesStore();
const isLiked = ref(false);

const handleFavorite = async () => {
  if (!authStore.user) {
    modalStore.closeModal();
    return router.push("/login");
  }

  try {
    await favoritesStore.toggleFavorite(props.pen.id);
  } catch (error) {
    showToast({
      message: "Action failed",
      variant: "danger"
    });
  }
};


const goToEditor = () => {
  modalStore.closeModal();
  router.push(`/${props.pen.username}/dose/${props.pen.id}`);
};


watch(
  () => props.pen,
  (newPen) => {
    if (newPen && authStore.user) {
      favoritesStore.fetchFavoriteState(newPen.id);
    }
  },
  { immediate: true }
);

// emit 行為
const onFollow = () => {};
const onTogglePrivacy = () => {};
const onDelete = () => {};

</script>
