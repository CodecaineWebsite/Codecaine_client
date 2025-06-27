<script setup>
import { ref, computed } from "vue";
import api from "@/config/api";
import { useAuthStore } from "@/stores/useAuthStore";
import { useToastStore } from "@/stores/useToastStore";
import { useMsgStore } from "@/stores/useMsgStore";
import { useRouter } from "vue-router";
import { marked } from "marked";
import DOMPurify from "dompurify";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import PenIcon from "@/components/icons/PenIcon.vue";
import TrashCanIcon from "@/components/icons/TrashCanIcon.vue";
import { useToastStore } from "@/stores/useToastStore";

dayjs.extend(relativeTime);
dayjs.extend(utc);

const toastStore = useToastStore();
const { showToast } = toastStore;
const router = useRouter();
const msgStore = useMsgStore();
const props = defineProps({
  comment: Object,
});
const emit = defineEmits(["delete", "update"]);
const showActions = ref(false);

const authStore = useAuthStore();

const editing = ref(false);
const editContent = ref(props.comment.content);

const isOwner = authStore.user?.uid === props.comment.user?.id;

const usernameRegex = /(^|\s)@([a-zA-Z0-9_]+)/g;

const parsedContent = computed(() => {
  let content = props.comment.content.replace(/\n/g, "  \n");

  content = content.replace(usernameRegex, (match, space, username) => {
    return `${space}[@${username}](/${username})`;
  });

  const rawHTML = marked.parse(content);
  return DOMPurify.sanitize(rawHTML);
});

const startEdit = () => {
  editing.value = true;
  editContent.value = props.comment.content;
};

const cancelEdit = () => {
  editing.value = false;
  editContent.value = "";
};

const submitEdit = async () => {
  if (!editContent.value.trim()) return;
  try {
    const res = await api.put(`/api/comments/${props.comment.id}`, {
      content: editContent.value.trim(),
    });
    emit("update", props.comment.id, res.data);
    cancelEdit();
  } catch (err) {
    showToast({
      message: "Failed to update comment. Please try again later.",
      variant: "danger",
    });
  }
};

const deleteComment = () => {
  msgStore.open({
    title: "Delete Confirmation",
    message: "This will permanently delete this Comment.",
    variant: "danger",
    confirmText: "I understand, delete the comment.",
    cancelText: "Cancel",
    confirming: false,
    loadingText: "Deleting...",
    onConfirm: async () => {
      try {
        msgStore.confirming = true;
        await api.delete(`/api/comments/${props.comment.id}`);
        emit("delete", props.comment.id);
      } catch (err) {
        showToast({
          message: "Failed to delete comment. Please try again later.",
          variant: "danger",
        });
      } finally {
        msgStore.confirming = false;
        msgStore.close(); // 最後關掉 modal
      }
    },
  });
};

const toggleActions = () => {
  showActions.value = !showActions.value;
};

const goToProfile = () => {
  const username = props.comment.user?.username;
  if (username) {
    emit("close");
    router.push(`/${username}`);
  }
};
const createdTimeAgo = computed(() => {
  return dayjs.utc(props.comment.created_at).local().fromNow();
});
</script>

<template>
  <div class="rounded group" @click="toggleActions">
    <div
      class="grid grid-cols-[40px_1fr_44px] grid-rows-[18px_12px] relative gap-x-2 mb-4"
    >
      <img
        :src="comment.user?.profile_image_url || '/default-avatar.png'"
        alt="avatar"
        class="w-8 h-8 rounded object-cover overflow-hidden col-start-1 row-span-2"
      />
      <div
        @click="goToProfile"
        class="overflow-hidden whitespace-nowrap text-ellipsis text-sm text-cc-link font-semibold col-start-2 row-start-1"
      >
        {{ comment.user?.display_name || "unknown user" }}
        <span class="text-cc-link"
          >(@{{ comment.user?.username || "unknown" }})</span
        >
      </div>
      <div class="text-cc-8 text-xs leading-[15px] col-start-2 row-start-2">
        {{ createdTimeAgo }}
      </div>
      <button
        @click="emit('mention', `@${comment.user?.username} `)"
        class="text-cc-1 bg-cc-13 py-0.5 rounded-xs text-xs hover:bg-cc-12 col-start-3 row-start-1 self-start"
      >
        Reply
      </button>
    </div>
    <div v-if="editing">
      <textarea
        v-model="editContent"
        rows="3"
        class="w-full resize-none bg-cc-4 flex-1 px-3 py-2 rounded focus:outline-none focus:bg-cc-2 text-sm"
      ></textarea>
      <div class="mt-1 flex gap-2">
        <button
          @click="submitEdit"
          class="ml-auto bg-cc-13 text-white text-sm px-4 py-2 rounded hover:bg-cc-12 transition"
        >
          Update
        </button>
        <button
          @click="cancelEdit"
          class="bg-cc-13 text-white text-sm px-4 py-2 rounded hover:bg-cc-12 transition"
        >
          Cancel
        </button>
      </div>
    </div>
    <div
      v-else
      class="break-words hyphens-auto text-base ml-[14px] mr-[14px] pl-6 pt-[10px] pb-[20px] border-l-2 border-cc-13"
    >
      <div
        class="prose prose-invert prose-sm max-w-none text-sm pb-4"
        v-html="parsedContent"
      ></div>
      <div
        v-if="isOwner"
        class="ml-auto space-x-2 text-xs transform transition-all duration-300 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"
        :class="{
          'opacity-100 translate-y-0': showActions,
          'opacity-0 translate-y-2': !showActions,
        }"
      >
        <button
          @click="startEdit"
          class="text-cc-1 bg-cc-13 px-1.5 py-0.5 rounded-xs text-xs hover:bg-cc-green hover:text-cc-20 col-start-3 row-start-1 self-start justify-items-center"
        >
          <PenIcon class="inline w-2.5 h-2.5 mr-1 fill-current" />
          Edit
        </button>
        <button
          @click="deleteComment"
          class="text-cc-1 bg-cc-13 px-1.5 py-0.5 rounded-xs text-xs hover:bg-cc-red hover:text-cc-20 col-start-3 row-start-1 self-start justify-items-center"
        >
          <TrashCanIcon class="inline w-3 h-3 mr-1 fill-current" />
          Delete
        </button>
      </div>
    </div>
  </div>
</template>
