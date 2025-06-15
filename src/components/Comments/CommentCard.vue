<script setup>
import { ref, computed } from "vue";
import api from "@/config/api";
import { useAuthStore } from "@/stores/useAuthStore";
import { marked } from "marked";
import DOMPurify from "dompurify";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";

dayjs.extend(relativeTime);
dayjs.extend(utc);

const props = defineProps({
  comment: Object,
});
const emit = defineEmits(["delete", "update"]);

const createdTimeAgo = computed(() => {
  return dayjs.utc(props.comment.created_at).local().fromNow();
});

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
    console.error("編輯失敗", err);
    alert("留言編輯失敗，請稍後再試");
  }
};

const deleteComment = async () => {
  if (!confirm("確定要刪除這則留言嗎？")) return;
  try {
    await api.delete(`/api/comments/${props.comment.id}`);
    emit("delete", props.comment.id);
  } catch (err) {
    console.error("刪除失敗", err);
    alert("留言刪除失敗，請稍後再試");
  }
};
</script>

<template>
  <div class="p-4 border rounded">
    <div class="flex items-center gap-2 mb-2">
      <img
        :src="comment.user?.profile_image_url || '/default-avatar.png'"
        alt="avatar"
        class="w-8 h-8 rounded-full object-cover"
      />
      <div class="text-sm text-cc-13">
        <span class="font-semibold">{{
          comment.user?.display_name || "未知用戶"
        }}</span>
        <span class="text-cc-8"
          >(@{{ comment.user?.username || "unknown" }})</span
        >
        <span class="text-cc-8 text-xs">• {{ createdTimeAgo }}</span>
      </div>

      <div v-if="isOwner" class="ml-auto space-x-2 text-xs">
        <button @click="startEdit" class="text-blue-500 hover:underline">
          編輯
        </button>
        <button @click="deleteComment" class="text-red-500 hover:underline">
          刪除
        </button>
      </div>
      <button
      @click="emit('mention', `@${comment.user?.username} `)"
      class="text-sm text-blue-500 hover:underline"
    >
      回覆
    </button>
    </div>
    

    <div v-if="editing">
      <textarea
        v-model="editContent"
        rows="3"
        class="w-full p-2 border rounded text-sm mt-2"
      ></textarea>
      <div class="mt-1 flex gap-2">
        <button
          @click="submitEdit"
          class="px-3 py-1 bg-blue-600 text-white rounded"
        >
          儲存
        </button>
        <button @click="cancelEdit" class="px-3 py-1 bg-gray-300 rounded">
          取消
        </button>
      </div>
    </div>

    <!-- <p v-else class="text-sm whitespace-pre-line">{{ comment.content }}</p> -->
    <div
      v-else
      class="prose prose-sm max-w-none text-sm"
      v-html="parsedContent"
    ></div>
  </div>
</template>
