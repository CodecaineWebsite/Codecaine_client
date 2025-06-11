<template>
  <div class="group w-full bg-card-text text-white rounded-lg relative">
    <!-- 預覽 -->
    <div class="relativegroup">
      <!-- 圖片預覽 / iframe 預覽-->
      <iframe :src="previewIframeUrl" width="100%" loading="lazy"></iframe>

      <!-- 圖片右上角的方塊小連結 應該連結至pen的detail page，按下後跳出小視窗 -->
      <button
        @click="openDetailModal"
        class="detailPageLink absolute top-2 right-2 bg-black/50 rounded p-1 opacity-0 group-hover:opacity-100 transition"
      >
        <ExternalLinkIcon class="w-4 fill-current" />
      </button>
    </div>

    <!-- 卡片內容 -->
    <div class="p-4">
      <div class="flex items-center justify-between w-full">
        <div class="flex items-center gap-3">
          <!-- 左：頭像 -->
          <a :href="userPageLink" class="userPageLink shrink-0">
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
          <div class="relative">
            <button
              class="text-white text-xl font-bold hover:text-gray-300"
              @click="menuOpen = !menuOpen"
            >
              •••
            </button>
            <!-- 下拉選單 -->
            <div
              v-if="menuOpen"
              class="absolute right-0 mt-2 w-48 bg-card-menu text-sm rounded shadow-lg z-50 overflow-hidden border border-gray-700"
            >
              <!-- <a
                href="#"
                class="block px-4 py-2 hover-bg-card-hover flex items-center gap-2"
              >
                <FolderIcon />
                Add to Collection
              </a> -->
              <!-- <a
                href="#"
                class="block px-4 py-2 hover-bg-card-hover flex items-center gap-2"
              >
                <BookmarkIcon />
                Add to Bookmarks
              </a> -->
              <a
                href="#"
                class="block px-4 py-2 hover-bg-card-hover text-blue-400 flex items-center gap-2"
              >
                <CheckIcon />
                Follow {{ "@" + userName }}
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部統計按鈕 -->
      <div class="flex gap-2 mt-3">
        <button
          @click="liked = !liked"
          class="flex items-center gap-1 bg-card-button-primary hover-bg-card-hover text-white px-3 py-0.5 rounded-lg font-medium text-sm transition select-none"
        >
          <span>
            <HeartIcon
              class="w-4"
              :class="liked ? 'fill-cc-red' : 'fill-current'"
            />
          </span>
          <span>{{ liked ? likes + 1 : likes }}</span>
        </button>
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
import { ref } from "vue";
import { useRouter } from "vue-router";
import ExternalLinkIcon from "@/components/icons/ExternalLinkIcon.vue"; // 元件改名
import FolderIcon from "@/components/icons/FolderIcon.vue";
import BookmarkIcon from "@/components/icons/BookmarkIcon.vue";
import CheckIcon from "@/components/icons/CheckIcon.vue";
import ChatBubbleIcon from "@/components/icons/ChatBubbleIcon.vue";
import EyeIcon from "@/components/icons/EyeIcon.vue";
import HeartIcon from "@/components/icons/HeartIcon.vue";
import { useModalStore } from "@/stores/useModalStore";

const router = useRouter();
const modalStore = useModalStore();

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
const userProfileImage = props.pen.userProfileImage || "https://assets.codepen.io/t-1/user-default-avatar.jpg";
const isPro = props.pen.isPro || false;
// 作品預覽
const previewImageUrl = props.pen.imageUrl || "https://picsum.photos/id/684/600/400";
const previewIframeUrl = `${import.meta.env.VITE_URL_BASE}/${userName}/full/${workId}?mode=onlyPreview`; // iframe 的 src 位址範例

// 統計資料
const likes = props.pen.favorites_count;
const comments = props.pen.comments_count;
const views = props.pen.views_count;

// 連結
const editorPageLink = `/${userName}/pen/${workId}`; //:username/pen/:id
const userPageLink = `/profile/${userName}`;
const detailPageLink = `/${userName}/details/${workId}`;
const fullPageLink = `/${userName}/full/${workId}`;
const proLink = "/features/pro"; //目前還沒設定，先參考官方route暫定 /features/pro

// 元件狀態
const menuOpen = ref(false);
const liked = ref(false);

const goToDetailPage = () => {
  // router.push({ name: 'PenDetail', params: { username: userName, id: workId } });
  router.push(detailPageLink);
};

const goToFullPage = () => {
  // router.push({ name: 'PenFull', params: { username: userName, id: workId } });
  router.push(fullPageLink);
};

const openDetailModal = () => {
  modalStore.openModal(props.pen.id, "card");
};

/**
 * TODO:
 * 1.檢查 PenDetail,與 PenFull 頁面建立起來了沒 (detail還沒)
 * 2.設定imageUrl 的 fallback image
 * 3.iframe 預覽的 src 用 /full/:pen_id
 * 
 * API:
 * 按喜歡紐將作品加入收藏
 * 按追蹤將作者加入追蹤清單
 */
</script>
