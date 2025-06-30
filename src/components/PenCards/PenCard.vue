<template>
  <div class="group/pen w-full bg-card-text text-white rounded-lg relative">
    <!-- 預覽 -->
    <div class="relative aspect-video overflow-hidden rounded-md bg-black">
      <!-- iframe 預覽 -->
      <div class="absolute inset-0 origin-top-left scale-50 w-[200%] h-[200%]">
        <iframe
          ref="iframeEl"
          src="/preview-frame.html"
          sandbox="allow-scripts"
          referrerpolicy="no-referrer"
          class="h-full w-full bg-cc-1"
          title="Preview Frame"
        ></iframe>
      </div>

      <!-- 圖片右上角的方塊小連結 跳出 Modal -->
      <PenDetailsButton
        @open-detail-modal="openDetailModal"
        class="absolute top-2 right-2 opacity-100 lg:opacity-0 group-hover/pen:opacity-100 transition"
      />
    </div>

    <!-- 卡片內容 -->
    <div class="p-4">
      <div class="flex items-center justify-between w-full">
        <div class="flex items-center gap-3 min-w-0">
          <!-- 左：頭像 -->
          <a :href="userPageLink" class="shrink-0">
            <img
              :src="userProfileImage"
              class="w-10 h-10 rounded-sm object-cover"
              :alt="userDisplayName + ' 的頭像'"
            />
          </a>
          <!-- 中：標題與作者 -->
          <div class="flex-1 min-w-0 mr-2">
            <a
              :href="editorPageLink"
              class="block font-bold text-base text-white w-full max-w-full overflow-hidden whitespace-nowrap truncate"
            >
              {{ title }}
            </a>
            <div class="flex gap-2">
              <a
                :href="userPageLink"
                class="block text-sm text-gray-300 hover:underline truncate"
              >
                <span class="font-medium">{{
                  userDisplayName || userName
                }}</span>
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
            @toggle="$emit('toggle', pen.id)"
          />
        </div>
      </div>

      <!-- 底部統計按鈕 -->
      <div class="flex gap-2 mt-3">
        <PenFavoriteButton :target-pen="workId" />
        <PenCommentButton
          :work-id="workId"
          :comments="comments"
          @openDetailModal="openDetailModal"
        />
        <PenViewButton :count="views" @goToFullPage="goToFullPage" />
      </div>
    </div>
  </div>
</template>

<script setup>
import api from "@/config/api";
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import PenCardDropdown from "@/components/PenCards/PenCardDropdown.vue"; // 作品卡下拉選單元件

import PenDetailsButton from "@/components/PenCards/PenDetailsButton.vue";
import PenFavoriteButton from "@/components/PenCards/PenFavoriteButton.vue";
import PenCommentButton from "@/components/PenCards/PenCommentButton.vue";
import PenViewButton from "@/components/PenCards/PenViewButton.vue";
import { useModalStore } from "@/stores/useModalStore";
// import { useWorkStore } from "@/stores/useWorkStore.js"; // 作品狀態管理
import { useAuthStore } from "@/stores/useAuthStore.js"; // 使用者狀態管理
import { useMsgStore } from "@/stores/useMsgStore";
import { useToastStore } from "@/stores/useToastStore";
import { usePreviewStore } from "@/stores/usePreviewStore";
import { useFollowStatus } from "@/composables/useFollowStatus";

const msgStore = useMsgStore();
const toastStore = useToastStore();
const { showToast } = toastStore;
// const workStore = useWorkStore();
// const { updateCardPreviewSrc } = workStore;
const authStore = useAuthStore();
const previewStore = usePreviewStore();

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
const { isFollowing, checkFollow, handleFollowAction } = useFollowStatus(
  props.pen.username
);
// 作品預覽
const iframeEl = ref(null);

onMounted(() => {
  iframeEl.value.addEventListener("load", () => {
    const code = {
      html: props.pen.html_code || "",
      css: props.pen.css_code || "",
      javascript: `
        try {
          ${props.pen.js_code || ""}
        } catch (err) {
          console.error("User JS Error:", err);
        }
      `,
      htmlClass: props.pen.html_class || "",
      headStuff: props.pen.head_stuff || "",
      cdns: Array.isArray(props.pen.resources_js) ? props.pen.resources_js : [],
      links: Array.isArray(props.pen.resources_css)
        ? props.pen.resources_css
        : [],
    };

    previewStore.sendPreviewCode(iframeEl.value, code);
  });
});

// 統計資料
const comments = props.pen.comments_count;
const views = props.pen.views_count;

// 連結
const editorPageLink = `/${userName}/dose/${workId}`;
const userPageLink = `/${userName}`;
const proLink = "/settings/billing";

const isOwner = computed(() => authStore.userProfile?.username === userName);

const handleFollow = () => handleFollowAction(props.pen.username);

const handleDelete = () => {
  msgStore.open({
    title: "Are you sure you want to delete this Dose?",
    message: `
      <p class="mb-5">Here's what happens when you delete a Dose:</p>
      <ul class="list-disc list-outside pl-4">
        <li>This Dose will no longer be accessible on Codecaine.</li>
        <li>
          This Dose will be moved to the
          <a class="text-cc-blue underline" href="#" onclick="window.toDeleteLink?.()">Deleted Items section of Your Work</a>
          for 3 days.
        </li>
        <li>
          After 3 days, the Dose is permanently deleted.
          You can also manually delete it from your Deleted Items.
        </li>
      </ul>
    `,
    variant: "danger",
    confirmText: "I understand, delete my Dose",
    cancelText: "Cancel",
    confirming: false,
    loadingText: "Deleting...",
    onConfirm: async () => {
      try {
        msgStore.confirming = true;
        await api.put(`/api/pens/${workId}/trash`);
        emit("delete", workId);
      } catch (error) {
        showToast({
          message: "Delete failed, please try again later",
          variant: "danger",
        });
      } finally {
        msgStore.confirming = false;
        msgStore.close();
      }
    },
  });
};

const togglePrivacy = async () => {
  if (!isPro && isPrivate.value === false) {
    showToast({
      message: "Only Pro members can make doses private.",
    });
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
</script>
