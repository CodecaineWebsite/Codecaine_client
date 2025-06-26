<template>
  <header
    v-if="pen"
    class="flex items-center justify-between px-4 pt-4 pb-3 bg-cc-14 rounded-t-[10px] shadow-[0_2px_5px_rgba(0,0,0,0.5)] relative z-[2]"
  >
    <!-- 左區：標題與作者 -->
    <div class="flex flex-1 flex-col min-w-[120px] pr-2 ml-4">
      <h1 class="text-xl font-bold text-white truncate max-w-full">
        {{ pen.title }}
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
          class="ml-1 bg-yellow-300 text-black text-[10px] font-bold px-1 py-[1px] rounded"
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
      <!-- ❤️ 收藏按鈕 -->
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

      <!-- <PenDetailDropdown
        class="dropdown-menu"
        :is-open="isDropdownOpen"
        :is-owner="authStore.userProfile?.username === pen.username"
        :is-pro="pen.is_pro"
        :is-private="pen.is_private"
        :is-following="false"
        :user-name="pen.username"
        :is-logged-in="Boolean(authStore.userProfile)"
        @toggle="toggleDropdown"
        @follow="onFollow"
        @togglePrivacy="onTogglePrivacy"
        @delete="onDelete"
      /> -->

      <button
        @click="goToEditor"
        class="inline-flex items-center justify-center relative text-base font-normal truncate cursor-pointer py-[7px] px-[10px] border border-transparent rounded bg-cc-13 hover:bg-cc-12 text-sm text-cc-1"
      >
        View in Editor
      </button>
    </div>
  </header>
</template>
<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from "vue";
import { useAuthStore } from "@/stores/useAuthStore";
import { useModalStore } from "@/stores/useModalStore";
import { useRouter, RouterLink } from "vue-router";
import api from "@/config/api";
import FollowBtn from "@/components/FollowBtn.vue";
import PenDetailDropdown from "@/components/PenDetails/PenDetailDropdown.vue";
import HeartIcon from "@/components/icons/HeartIcon.vue";

const props = defineProps({
  pen: {
    type: Object,
    required: true,
  },
});

const authStore = useAuthStore();
const modalStore = useAuthStore();
const router = useRouter();
const isLiked = ref(false);
const isDropdownOpen = ref(false);
const dropdownRef = ref(null);

const checkFavorite = async () => {
  if (!authStore.userProfile) return;
  const res = await api.get(`/api/favorites/check/${props.pen.id}/`);
  isLiked.value = res.data.liked;
  console.log(res.data);
};

const handleFavorite = async () => {
  if (!authStore.userProfile) {
    return router.push("/login");
  }

  try {
    if (!isLiked.value) {
      await api.post(`/api/favorites/`, { pen_id: props.pen.id });
      isLiked.value = true;
    } else {
      await api.delete(`/api/favorites/`, {
        data: { pen_id: props.pen.id },
      });
      isLiked.value = false;
    }
  } catch (error) {
    console.error("Favorite action failed:", error);
  }
};

// dropdown 開關
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

function closeDropdown() {
  isDropdownOpen.value = false;
}

function handleClickOutside(e) {
  if (
    !e.target.closest(".dropdown-toggle") &&
    !e.target.closest(".dropdown-menu")
  ) {
    closeDropdown();
  }
}

const goToEditor = () => {
  modalStore.closeModal();
  router.push(`/${props.pen.username}/dose/${props.pen.id}`);
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});
onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});

watch(
  () => props.pen,
  (newPen) => {
    if (newPen && authStore.userProfile) {
      checkFavorite();
    }
  },
  { immediate: true }
);

// emit 行為
const onFollow = () => {};
const onTogglePrivacy = () => {};
const onDelete = () => {};

// Dropdown 行為
</script>
