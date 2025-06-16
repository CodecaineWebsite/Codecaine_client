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

  if (!form?.newComment.includes(mentionText)) {
    form.newComment += form.newComment ? `\n${mentionText}` : `${mentionText} `;
  }
  nextTick(() => {
    form.commentInput?.focus();
  });
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
  <div class="space-y-4 p-4 rounded bg-cc-14 shadow-xl">
    <!-- 留言輸入欄 -->
    <CommentForm
      :sending="sending"
      @submit="submitComment"
      @error="(msg) => (error = msg)"
      @close="emit('close')"
      ref="commentFormRef"
    />
    <p v-if="loading">Loading...</p>
    <p v-if="error" class="text-cc-red font-bold text-sm">{{ error }}</p>
    <p v-if="!loading" class="text-cc-1 font-bold uppercase">{{ comments.length }} COMMENTS</p>
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
      @close="emit('close')"
    />
  </div>
</template>
