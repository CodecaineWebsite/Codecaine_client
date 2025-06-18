<template>
  <tr class="group border-b border-gray-300 hover:bg-gray-900">
    <td class="py-2 px-4">
      <a :href="editorPageLink">{{ pen.title || "Untitled" }}</a>
    </td>
    <td class="py-2 px-4">
      <PenDetailsButton
        @open-detail-modal="openDetailModal"
        class="opacity-0 group-hover:opacity-100 transition"
      />
    </td>
    <td class="py-2 px-4">{{ formatDate(pen.created_at) }}</td>
    <td class="py-2 px-4">{{ formatDate(pen.updated_at) }}</td>
    <td class="py-2 px-4 flex">
      <div class="flex gap-2 mt-3">
        <FavoriteBtn :target-pen="workId" />
        <PenCommentButton
          :work-id="workId"
          :comments="pen.comments_count || 0"
          @openDetailModal="openDetailModal"
        />
        <PenViewButton :count="views" @goToFullPage="goToFullPage" />
      </div>
    </td>
    <td class="py-2 px-4">
      <div class="flex items-center gap-2">
        <PenCardDropdown
          :is-open="isOpen"
          :is-owner="isOwner"
          :is-pro="isPro"
          :is-private="isPrivate"
          :is-following="isFollowing"
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
import PenDetailsButton from "@/components/PenCards/PenDetailsButton.vue";
import FavoriteBtn from "@/components/FavoriteBtn.vue";
import PenCommentButton from "./PenCards/PenCommentButton.vue";
import PenViewButton from "./PenCards/PenViewButton.vue";
import PenCardDropdown from "@/components/PenCards/PenCardDropdown.vue";

const modalStore = useModalStore();
const authStore = useAuthStore();
const router = useRouter();
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
const editorPageLink = `/${userName}/pen/${workId}`;

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

const handleTogglePrivacy = async () => {
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
