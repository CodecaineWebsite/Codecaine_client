<script setup>
import { ref, onMounted, watch, nextTick } from "vue";
import { useRouter } from "vue-router";
import api from "@/config/api.js";
import { useAuthStore } from "@/stores/useAuthStore";
import CommentForm from "@/components/Comments/CommentForm.vue";
import CommentCard from "@/components/Comments/CommentCard.vue";

const router = useRouter();
const emit = defineEmits(["close"]);
const props = defineProps({
  penId: {
    type: Number,
    required: true,
  },
});
const goSignup = () => {
  emit("close");
  router.push("/signup");
};
const goLogin = () => {
  emit("close");
  router.push("/login");
};

const authStore = useAuthStore();
const comments = ref([]);
const loading = ref(false);
const error = ref("");
const commentFormRef = ref(null);

const newComment = ref(""); // 新增留言的內容
const sending = ref(false); // 是否正在發送留言
const commentInput = ref(null);

async function insertMention(username) {
  const mentionText = `@${username}`;
  const form = commentFormRef.value;

  if (!authStore.user) {
    error.value = "請先登入後再提及其他用戶";
    return;
  }
  if (!form?.newComment.includes(mentionText)) {
    form.newComment += form.newComment ? `\n${mentionText}` : `${mentionText} `;
  }
  nextTick(() => {
    form.commentInput?.focus();
  });
}

async function deleteComment(comment) {
  if (!authStore.user || authStore.user.uid !== comment.user.id) {
    error.value = "你沒有權限刪除這條留言";
    return;
  }
  if (!confirm("確定要刪除這條留言嗎？")) return;

  try {
    await api.delete(`/api/comments/${comment.id}`);
    comments.value = comments.value.filter((c) => c.id !== comment.id);
    error.value = ""; // 清除錯誤訊息
  } catch (err) {
    error.value = "刪除留言失敗，請稍後再試";
    console.error("刪除留言失敗：", err);
    alert("刪除留言失敗，請稍後再試");
  }
}

const fetchComments = async () => {
  if (!props.penId) return;
  loading.value = true;
  error.value = "";
  try {
    const res = await api.get("/api/comments", {
      params: { pen_id: props.penId },
    });
    comments.value = res.data;
    console.log("留言資料:", comments.value);
  } catch (err) {
    error.value = "留言載入失敗，請稍後再試";
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const submitComment = async (content) => {
  if (!authStore.user) {
    error.value = "請先登入後再留言";
    return;
  }
  if (!content.trim()) {
    error.value = "留言內容不能為空";
    return;
  }
  sending.value = true;

  try {
    const res = await api.post("/api/comments", {
      pen_id: props.penId,
      content: content.trim(),
    });
    comments.value.unshift(res.data);
    newComment.value = "";
    error.value = "";
  } catch (err) {
    if (err.response?.status === 429) {
      error.value = "你留言太快了，請稍後再試～";
    } else {
      error.value = "留言失敗，請稍後再試";
    }
    console.error("留言失敗：", err);
  } finally {
    sending.value = false;
    setTimeout(() => {
      sending.value = false;
    }, 2000);
    nextTick(() => {
      commentInput.value?.focus();
    });
  }
};
onMounted(fetchComments);
watch(() => props.penId, fetchComments); // 若 penId 有變也重新撈
</script>

<template>
  <div class="space-y-4">
    <!-- 留言輸入欄 -->
    <CommentForm
      :sending="sending"
      @submit="submitComment"
      @error="(msg) => (error = msg)"
      @close="emit('close')"
      ref="commentFormRef"
    />
    <p v-if="loading">載入留言中...</p>
    <p v-if="error" class="text-red-500">{{ error }}</p>
    <!-- 顯示留言卡 -->
    <CommentCard
      v-for="comment in comments"
      :key="comment.id"
      :comment="comment"
      @delete="(id) => (comments = comments.filter((c) => c.id !== id))"
      @update="
        (id, updated) => {
          const i = comments.findIndex((c) => c.id === id);
          if (i !== -1) comments[i] = updated;
        }
      "
      @mention="insertMention"
    />
    <!-- 如果沒有留言 -->
    <p v-if="comments.length === 0 && !loading">目前尚無留言</p>
  </div>
</template>
