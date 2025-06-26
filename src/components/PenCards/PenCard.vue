<template>
  <div class="group w-full bg-card-text text-white rounded-lg relative">
    <!-- 預覽 -->
    <div class="relative aspect-video overflow-hidden rounded-md bg-black">
      <!-- iframe 預覽 -->
      <div class="absolute inset-0 origin-top-left scale-50 w-[200%] h-[200%]">
        <iframe
          :src="iframeSrc"
          sandbox="allow-scripts"
          class="w-full h-full border-0"
          loading="lazy"></iframe>
      </div>

      <!-- 圖片右上角的方塊小連結 跳出 Modal -->
      <PenDetailsButton
        @open-detail-modal="openDetailModal"
        class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition" />
    </div>

    <!-- 卡片內容 -->
    <div class="p-4">
      <div class="flex items-center justify-between w-full">
        <div class="flex items-center gap-3 min-w-0">
          <!-- 左：頭像 -->
          <a
            :href="userPageLink"
            class="shrink-0">
            <img
              :src="userProfileImage"
              class="w-10 h-10 rounded-sm"
              :alt="userDisplayName + ' 的頭像'" />
          </a>
          <!-- 中：標題與作者 -->
          <div class="flex-1 min-w-0 mr-2">
            <a
              :href="editorPageLink"
              class="block font-bold text-base text-white w-full max-w-full overflow-hidden whitespace-nowrap truncate">
              {{ title }}
            </a>
            <div class="flex gap-2">
              <a
                :href="userPageLink"
                class="block text-sm text-gray-300 hover:underline truncate">
                <span class="font-medium">{{ userDisplayName }}</span>
              </a>
              <a
                v-if="isPro"
                :href="proLink"
                class="bg-yellow-400 text-black text-[10px] font-bold px-1 py-[1px] rounded hover:bg-yellow-300 transition inline-flex items-center justify-center">
                PRO
              </a>
            </div>
          </div>
        </div>
        <!-- 右：操作選單 -->
        <div class="flex items-center gap-2">
          <PenCardDropdown
            :is-open="isOpen"
            :is-owner="isOwner"
            :is-pro="isPro"
            :is-private="isPrivate"
            :is-following="isFollowing"
            :is-logged-in="authStore.user !== null"
            :user-name="userName"
            @follow="handleFollow"
            @togglePrivacy="togglePrivacy"
            @delete="handleDelete"
            @toggle="$emit('toggle', pen.id)" />
        </div>
      </div>

      <!-- 底部統計按鈕 -->
      <div class="flex gap-2 mt-3">
        <FavoriteBtn :target-pen="workId" />
        <PenCommentButton
          :work-id="workId"
          :comments="comments"
          @openDetailModal="openDetailModal" />
        <PenViewButton
          :count="views"
          @goToFullPage="goToFullPage" />
      </div>
    </div>
  </div>
</template>

<script setup>
import api from "@/config/api"; // API 請求配置
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import PenCardDropdown from "@/components/PenCards/PenCardDropdown.vue"; // 作品卡下拉選單元件

import PenDetailsButton from "@/components/PenCards/PenDetailsButton.vue";
import FavoriteBtn from "@/components/PenCards/PenFavoriteButton.vue";
import PenCommentButton from "@/components/PenCards/PenCommentButton.vue";
import PenViewButton from "@/components/PenCards/PenViewButton.vue";
import { useModalStore } from "@/stores/useModalStore";
import { useWorkStore } from "@/stores/useWorkStore.js"; // 作品狀態管理
import { useAuthStore } from "@/stores/useAuthStore.js"; // 使用者狀態管理
const workStore = useWorkStore();
const { updateCardPreviewSrc } = workStore;
const authStore = useAuthStore();

const router = useRouter();
const modalStore = useModalStore();

const emit = defineEmits(["delete", "privacy-changed", "toggle"]);

const props = defineProps({
  pen: {
    type: Object,
    required: true,
  },
  isOpen: Boolean,
});

// 作品資訊
const workId = props.pen.id;
const title = props.pen.title || "Untitled";
// 作者資訊
const userName = props.pen.username;
const userDisplayName = props.pen.user_display_name;
const userProfileImage = props.pen.profile_image || "/default-avatar.png";
const isPro = props.pen.is_pro || false;
const isPrivate = ref(props.pen.is_private === true);
const isFollowing = ref(false);
// 作品預覽
const iframeSrc = ref("");
const code = {
  html: props.pen.html_code || "",
  css: props.pen.css_code || "",
  javascript: props.pen.js_code || "",
  cdns: props.resources_js || [],
  links: props.resources_css || [],
};
onMounted(async () => {
  const newBlobUrl = updateCardPreviewSrc(code);
  iframeSrc.value = newBlobUrl;
});

// 統計資料
const comments = props.pen.comments_count;
const views = props.pen.views_count;

// 連結
const editorPageLink = `/${userName}/dose/${workId}`;
const userPageLink = `/${userName}`;
const proLink = "/features/pro"; //目前還沒設定，先參考官方route暫定 /features/pro

const isOwner = computed(() => authStore.userProfile?.username === userName);

const checkFollow = async () => {
  if (authStore.user === null || isOwner.value) {
    isFollowing.value = false;
    return;
  }
  try {
    const res = await api.get(`/api/follows/check/${userName}`);
    isFollowing.value = res.data.isFollowing;
  } catch (error) {
    console.error("check follow error", error);
  }
};
const handleFollow = async () => {
  try {
    if (!isFollowing.value) {
      const res = await api.post(`/api/follows/${props.pen.username}`);
      isFollowing.value = true;
    } else {
      const res = await api.delete(`/api/follows/${props.pen.username}`);
      isFollowing.value = false;
    }
  } catch (error) {
    console.error("follow/unfollow error", error);
  }
};

const handleDelete = async () => {
  if (!confirm("Are you sure you want to delete this dose?")) return;

  try {
    await api.put(`/api/pens/${workId}/trash`);
    emit("delete", workId);
    console.log("Deleted successfully");
  } catch (error) {
    console.error("Delete failed", error);
    alert("Delete failed, please try again later");
  }
};

const togglePrivacy = async () => {
  if (!isPro && isPrivate.value === false) {
    alert("Only Pro members can make doses private.");
    return;
  }
  try {
    const newPrivacy = !isPrivate.value;
    await api.patch(`/api/pens/${workId}/privacy`, {
      is_private: newPrivacy,
    });
    isPrivate.value = newPrivacy;
    emit("privacy-changed", { id: workId, is_private: newPrivacy });
  } catch (err) {
    console.error("Toggle privacy failed, please try again later", err);
  }
};

onMounted(() => {
  if (!isOwner.value) {
    checkFollow();
  }
});

const goToFullPage = () => {
  router.push(`/${userName}/full/${workId}`);
};

const openDetailModal = () => {
  modalStore.openModal(props.pen.id, "card");
};

// 需要改為用 store 管理收藏狀態，因為PenCard的收藏按鈕與Modal收藏按鈕狀態不同步
</script>
