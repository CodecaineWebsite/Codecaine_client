<template>
  <div class="group w-full bg-card-text text-white rounded-lg relative">
    <!-- 預覽 -->
    <div class="relative aspect-video overflow-hidden rounded-md bg-black">
      <!-- iframe 預覽 -->
      <div class="absolute inset-0 origin-top-left scale-50 w-[200%] h-[200%]">
        <iframe
          :src="previewIframeUrl"
          class="w-full h-full border-0"
          loading="lazy"
        ></iframe>
      </div>

      <!-- 圖片右上角的方塊小連結 跳出 Modal -->
      <button
        @click="openDetailModal"
        class="absolute top-2 right-2 bg-black/50 rounded p-1 opacity-0 group-hover:opacity-100 transition"
      >
        <ExternalLinkIcon class="w-4 fill-current" />
      </button>
    </div>

    <!-- 卡片內容 -->
    <div class="p-4">
      <div class="flex items-center justify-between w-full">
        <div class="flex items-center gap-3">
          <!-- 左：頭像 -->
          <a :href="userPageLink" class="shrink-0">
            <img
              :src="userProfileImage"
              class="w-10 h-10 rounded-sm"
              :alt="userDisplayName + ' 的頭像'"
            />
          </a>
          <!-- 中：標題與作者 -->
          <div class="flex-1 min-w-0 mr-2">
            <a
              :href="editorPageLink"
              class="block font-bold text-base text-white truncate"
            >
              {{ title }}
            </a>
            <div class="flex gap-2">
              <a
                :href="userPageLink"
                class="block text-sm text-gray-300 hover:underline truncate"
              >
                <span class="font-medium">{{ userDisplayName }}</span>
              </a>
              <a
                v-if="isPro"
                :href="proLink"
                class="bg-yellow-400 text-black text-[10px] font-bold px-1 py-[1px] rounded hover:bg-yellow-300 transition inline-flex items-center justify-center"
              >
                PRO
              </a>
            </div>
          </div>
        </div>
        <!-- 右：操作選單 -->
        <div class="flex items-center gap-2">
          <PenCardDropdown
            :is-owner="isOwner"
            :is-pro="isPro"
            :is-private="isPrivate"
            :is-following="isFollowing"
            :user-name="userName"
            @follow="handleFollow"
            @togglePrivacy="togglePrivacy"
            @delete="handleDelete"
          />
        </div>
      </div>

      <!-- 底部統計按鈕 -->
      <div class="flex gap-2 mt-3">
        <FavoriteBtn :target-pen="workId" />
        <!-- 改成開modal -->
        <button
          @click="openDetailModal"
          class="flex items-center gap-1 bg-card-button-primary hover-bg-card-hover text-white px-3 py-0.5 rounded-lg font-medium text-sm transition select-none"
        >
          <ChatBubbleIcon class="w-4 fill-current" />
          <span>{{ comments }}</span>
        </button>
        <button
          @click="goToFullPage"
          class="flex items-center gap-1 bg-card-button-primary hover-bg-card-hover text-white px-3 py-0.5 rounded-lg font-medium text-sm transition select-none"
        >
          <EyeIcon class="w-4 fill-current" />
          <span>{{ views }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import PenCardDropdown from "@/components/PenCardDropdown.vue"; // 作品卡下拉選單元件
import ExternalLinkIcon from "@/components/icons/ExternalLinkIcon.vue"; // 元件改名
import FolderIcon from "@/components/icons/FolderIcon.vue";
import BookmarkIcon from "@/components/icons/BookmarkIcon.vue";
import CheckIcon from "@/components/icons/CheckIcon.vue";
import ChatBubbleIcon from "@/components/icons/ChatBubbleIcon.vue";
import EyeIcon from "@/components/icons/EyeIcon.vue";
import HeartIcon from "@/components/icons/HeartIcon.vue";
import LockClosedIcon from "@/components/icons/LockClosedIcon.vue";
import UnlockIcon from "@/components/icons/UnlockIcon.vue";
import TrashCanIcon from "@/components/icons/TrashCanIcon.vue";
import FavoriteBtn from "@/components/FavoriteBtn.vue";
import { useModalStore } from "@/stores/useModalStore";
import api from "@/config/api"; // API 請求配置
import { useAuthStore } from "@/stores/useAuthStore.js"; // 使用者狀態管理
const authStore = useAuthStore();

const router = useRouter();
const modalStore = useModalStore();

const emit = defineEmits(["delete", "privacy-changed", "toggle"]);

const props = defineProps({
  pen: {
    type: Object,
    required: true,
  },
});

// 作品資訊
const workId = props.pen.id;
const title = props.pen.title || "Untitled";

// 作者資訊
const userName = props.pen.username;
const userDisplayName = props.pen.user_display_name;
const userProfileImage = props.pen.profile_image || "/default-avatar.png";
const isPro = authStore.userProfile.is_pro || false;
const isPrivate = ref(props.pen.is_private === true);
const isFollowing = ref(false);
// 作品預覽
const previewIframeUrl = `${
  import.meta.env.VITE_URL_BASE
}/${userName}/full/${workId}?mode=onlyPreview`; // iframe 的 src 位址範例

// 統計資料
const likes = props.pen.favorites_count;
const comments = props.pen.comments_count;
const views = props.pen.views_count;

// 連結
const editorPageLink = `/${userName}/pen/${workId}`;
const userPageLink = `/${userName}`;
const detailPageLink = `/${userName}/details/${workId}`;
const fullPageLink = `/${userName}/full/${workId}`;
const proLink = "/features/pro"; //目前還沒設定，先參考官方route暫定 /features/pro

// 元件狀態
const menuOpen = ref(false);

const isOwner = computed(() => authStore.userProfile?.username === userName);

const checkFollow = async () => {
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
    menuOpen.value = false;
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
    menuOpen.value = false;
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
    menuOpen.value = false;
    emit("privacy-changed", { id: workId, is_private: newPrivacy });
  } catch (err) {
    console.error("Toggle privacy failed, please try again later", err);
  }
};

onMounted(() => {
  checkFollow();
});
const goToDetailPage = () => {
  router.push(detailPageLink);
};

const goToFullPage = () => {
  router.push(fullPageLink);
};

const openDetailModal = () => {
  modalStore.openModal(props.pen.id, "card");
};

/**
 * TODO:
 * 1. 完成追蹤作者功能
 * 2. 若作品卡為使用者的作品，則顯示刪除按鈕
 * API:
 * 按追蹤將作者加入追蹤清單
 * 按刪除將作品從使用者的作品清單中刪除
 */
</script>
