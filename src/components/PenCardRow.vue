<template>
  <tr
    class="group w-full border-b border-cc-14 bg-cc-18 lg:bg-transparent grid [grid-template-columns:repeat(3,minmax(auto,1fr))_auto] items-center gap-x-2 gap-y-4 px-3 py-2 lg:table-row lg:px-0 lg:py-0 lg:gap-0 lg:border-none"
  >
    <td
      class="col-span-4 lg:table-cell py-1 px-2 text-cc-link bg-cc-18 whitespace-nowrap overflow-hidden truncate"
    >
      <a :href="editorPageLink">{{ pen.title || "Untitled" }}</a>
    </td>
    <td class="hidden lg:table-cell py-1 px-2 bg-cc-18 whitespace-nowrap">
      <PenDetailsButton
        @open-detail-modal="openDetailModal"
        class="opacity-0 group-hover:opacity-100 transition"
      />
    </td>
    <td
      class="lg:table-cell py-1 px-2 text-sm text-cc-9 bg-cc-18 whitespace-nowrap"
    >
      <div class="lg:hidden text-xs">Created on</div>
      <div>{{ formatDate(pen.created_at) }}</div>
    </td>
    <td
      class="lg:table-cell py-1 px-2 text-sm text-cc-9 bg-cc-18 whitespace-nowrap"
    >
      <div class="lg:hidden text-xs">Updated on</div>
      <div>{{ formatDate(pen.updated_at) }}</div>
    </td>
    <td class="lg:table-cell py-1 px-2 bg-cc-18 align-middle whitespace-nowrap">
      <div class="flex gap-2 items-center justify-center">
        <FavoriteBtn :target-pen="workId" />
        <PenCommentButton
          :work-id="workId"
          :comments="pen.comments_count || 0"
          @openDetailModal="openDetailModal"
        />
        <PenViewButton :count="views" @goToFullPage="goToFullPage" />
      </div>
    </td>
    <td
      class="w-fit lg:w-auto py-1 px-2 lg:table-cell bg-cc-18 whitespace-nowrap"
    >
      <div class="w-fit flex items-center gap-2 justify-center">
        <PenCardDropdown
          :is-open="isOpen"
          :is-owner="isOwner"
          :is-pro="isPro"
          :is-private="isPrivate"
          :is-following="isFollowing"
          :is-logged-in="authStore.user !== null"
          :user-name="userName"
          @follow="handleFollow"
          @togglePrivacy="handleTogglePrivacy"
          @delete="handleDelete"
          @toggle="() => emit('toggle', pen.id)"
        />
      </div>
    </td>
  </tr>
</template>
<script setup>
import { ref, computed } from "vue";
import { useModalStore } from "@/stores/useModalStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { useRouter } from "vue-router";
import { useToastStore } from "@/stores/useToastStore";
import PenDetailsButton from "@/components/PenCards/PenDetailsButton.vue";
import FavoriteBtn from "@/components/PenCards/PenFavoriteButton.vue";
import PenCommentButton from "./PenCards/PenCommentButton.vue";
import PenViewButton from "./PenCards/PenViewButton.vue";
import PenCardDropdown from "@/components/PenCards/PenCardDropdown.vue";

const toastStore = useToastStore();
const modalStore = useModalStore();
const authStore = useAuthStore();
const router = useRouter();
const { showToast } = toastStore;
const props = defineProps({
  pen: {
    type: Object,
    required: true,
  },
  isOpen: Boolean,
});

const emit = defineEmits(["toggle"]);

const workId = props.pen.id;
const isOwner = computed(
  () => authStore.userProfile?.username === props.pen.username
);
const isPrivate = ref(props.pen.is_private === true);
const isFollowing = ref(false);
const isPro = authStore.userProfile?.is_pro || false;
const userName = props.pen.username;
const views = props.pen.views_count;
const editorPageLink = `/${userName}/dose/${workId}`;

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

const handleTogglePrivacy = async () => {
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

const handleDelete = async () => {
  if (!confirm("Are you sure you want to delete this dose?")) return;

  try {
    await api.put(`/api/pens/${workId}/trash`);
    emit("delete", workId);
    console.log("Deleted successfully");
  } catch (error) {
    console.error("Delete failed", error);
    showToast({
      message: "Only Pro members can make doses private.",
    });
  }
};

const goToFullPage = () => {
  router.push(`/${userName}/full/${workId}`);
};

function formatDate(datetime) {
  return new Date(datetime).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const openDetailModal = () => {
  modalStore.openModal(props.pen.id, "card");
};
</script>
