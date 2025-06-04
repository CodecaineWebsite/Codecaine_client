<template>
  <div
    class="group w-full aspect-[16/9] bg-card-text text-white rounded-lg shadow-md transition-all duration-300 ease-in-out transform scale-95 translate-y-1 hover:scale-100 hover:translate-y-0 hover:shadow-2xl relative"
  >
    <!-- 預覽圖片 -->
    <div class="relativegroup">
      <img
        :src="imageUrl"
        alt="Card Preview"
        class="w-full aspect-video object-cover"
      />
      <!-- 圖片右上角的方塊小連結 應該連結至pen的detail page並跳出小視窗 -->
      <a
        :href="detailPageLink"
        target="_blank"
        class="detailPageLink absolute top-2 right-2 bg-black/50 rounded p-1 opacity-0 group-hover:opacity-100 transition"
      >
        <ExternalLinkIcon />
      </a>
    </div>

    <!-- 卡片內容 -->
    <div class="p-4">
      <div class="flex items-center justify-between w-full">
        <!-- 左：頭像與資訊 -->
        <div class="flex items-center gap-3">
          <a :href="userPageLink" target="_blank" class="userPageLink">
            <img
              :src="userProfileImage"
              class="w-10 h-10 rounded-full shrink-0"
              :alt="userDisplayName + ' 的頭像'"
            />
          </a>
          <div>
            <a
              :href="editorPageLink"
              target="_blank"
              class="editorPageLink block font-bold text-base text-white"
            >
              {{ title }}
            </a>
            <a
              :href="userPageLink"
              target="_blank"
              class="authorPageLink block text-sm text-gray-300 hover:underline"
            >
              <span class="font-medium">{{ userDisplayName }}</span>
            </a>
          </div>
        </div>

        <!-- PRO 與操作選單 -->
        <div class="flex items-center gap-2">
          <a
            :href="proLink"
            target="_blank"
            class="inline-block bg-yellow-400 text-black text-[10px] font-bold px-1.5 py-[1px] rounded hover:bg-yellow-300 transition"
          >
            PRO
          </a>
          <div class="relative">
            <button
              class="text-white text-xl font-bold hover:text-gray-300"
              @click="menuOpen = !menuOpen"
            >
              •••
            </button>
            <div
              v-if="menuOpen"
              class="absolute right-0 mt-2 w-48 bg-card-menu text-sm rounded shadow-lg z-50 overflow-hidden border border-gray-700"
            >
              <a
                href="#"
                class="block px-4 py-2 hover-bg-card-hover flex items-center gap-2"
              >
                <FolderIcon />
                Add to Collection
              </a>
              <a
                href="#"
                class="block px-4 py-2 hover-bg-card-hover flex items-center gap-2"
              >
                <BookmarkIcon />
                Add to Bookmarks
              </a>
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
          class="flex items-center gap-1 bg-card-secondary text-white px-3 py-0.5 rounded-lg font-medium text-sm transition select-none"
        >
          <span :class="liked ? 'text-pink-400' : 'text-white'">
            <HeartFilledIcon v-if="liked" />
            <HeartIcon v-else />
          </span>
          <span>{{ liked ? likes + 1 : likes }}</span>
        </button>

        <button
          @click="goToDetailPage"
          class="flex items-center gap-1 bg-card-button-primary hover-bg-card-hover text-white px-3 py-0.5 rounded-lg font-medium text-sm"
        >
          <ChatBubbleIcon />
          <span>{{ comments }}</span>
        </button>
        <!-- 這裡不用 goToAnalyticPage 這個連結會連到的是 /:user_name/full/:id -->
        <button
          @click="goToFullPage"
          class="flex items-center gap-1 bg-card-button-primary hover-bg-card-hover text-white px-3 py-0.5 rounded-lg font-medium text-sm"
        >
          <EyeIcon />
          <span>{{ views }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from 'vue-router';
import ExternalLinkIcon from "@/components/icons/ExternalLinkIcon.vue"; // 元件改名
import FolderIcon from "@/components/icons/FolderIcon.vue";
import BookmarkIcon from "@/components/icons/BookmarkIcon.vue";
import CheckIcon from "@/components/icons/CheckIcon.vue";
import ChatBubbleIcon from "@/components/icons/ChatBubbleIcon.vue";
import EyeIcon from "@/components/icons/EyeIcon.vue";
import HeartIcon from "@/components/icons/HeartIcon.vue";
import HeartFilledIcon from "@/components/icons/HeartFilledIcon.vue";

const router = useRouter();
// 1. 傳入 props
const props = defineProps({
  // 作品資訊
  id: Number,
  title: String,
  imageUrl: { // 預覽圖
    type: String,
    default: "https://picsum.photos/600/400", // 無法取得作品預覽圖時的備用圖,這個不需要傳props,寫死就好
  },
  
  // 作者資訊
  userName: String,
  userDisplayName: String,
  userProfileImage: String, 
  // 統計資料
  favorites_count: Number,
  comments_count: Number,
  views_count: Number,
});

// 作品資訊
const workId = props.id;
const title = props.title;
const imageUrl = props.imageUrl;
// 作者資訊
const userName = props.userName;
const userDisplayName = props.userDisplayName;
const userProfileImage = props.userProfileImage;
// 統計資料
const likes = props.favorites_count;
const comments = props.comments_count;
const views = props.views_count;


// 連結
const editorPageLink = `/${userName}/pen/${workId}`; //:username/pen/:id
const userPageLink = `/${userName}`; //目前還沒設定，先參考官方route暫定 /:username
const detailPageLink = `/${userName}/details/${workId}`; //目前還沒設定，先參考官方route暫定 /:username/details/:id
const fullPageLink = `/${userName}/full/${workId}` // 設定了嗎
const proLink = "/features/pro"; //目前還沒設定，先參考官方route暫定 /features/pro

// 元件狀態
const menuOpen = ref(false);
const liked = ref(false);


const goToDetailPage = () => {
  wrouter.push(detailPageLink);
};

const goToFullPage = () => {
  wrouter.push(fullPageLink);
};
// TODO: 如果預覽要用iframe預覽，props該傳什麼欄位
// TODO: 設定imageUrl 的 fallback image
</script>
