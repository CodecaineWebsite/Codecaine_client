<script setup>
import { ref, onMounted, watch, nextTick } from "vue";
import { useRouter } from "vue-router";
import api from "@/config/api.js";
import { useAuthStore } from "@/stores/useAuthStore";
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

const newComment = ref(""); // 新增留言的內容
const sending = ref(false); // 是否正在發送留言
const commentInput = ref(null);


async function insertMention(mentionText) {
  if (!authStore.user) {
    error.value = "請先登入後再提及其他用戶";
    return;
  }
  if (!newComment.value.includes(mentionText)) {
    newComment.value = newComment.value
      ? `${newComment.value} \n${mentionText}`
      : mentionText + " ";
  }
  nextTick(() => {
    commentInput.value?.focus();
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
    //哪來的
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
      content: newComment.value.trim(),
    });
    comments.value.unshift(res.data); // 將新留言添加到最前面
    newComment.value = ""; // 清空輸入框
    error.value = ""; // 清除錯誤訊息
  } catch (err) {
    error.value = "留言失敗，請稍後再試";
    console.error("留言失敗：", err);
  }
};
onMounted(fetchComments);
watch(() => props.penId, fetchComments); // 若 penId 有變也重新撈
</script>

<template>
  <div class="space-y-4">
    <!-- 留言輸入欄 -->
    <div
      v-if="!authStore.user"
      class="p-4 border rounded text-sm text-center space-y-2"
    >
      <p>Want to leave a comment or start your own work?</p>
      <div class="flex justify-center gap-4">
        <button
          @click="goSignup"
          class="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 transition"
        >
          Sign Up for Codecaine
        </button>
        <button
          @click="goLogin"
          class="border border-blue-500 text-blue-500 px-4 py-1 rounded hover:bg-blue-100 transition"
        >
          Log In
        </button>
      </div>
    </div>
    <div v-else class="flex items-center gap-2 p-4 border rounded">
      <img
        :src="authStore.userProfile?.profile_image_url || '/default-avatar.png'"
        alt="avatar"
        class="w-8 h-8 rounded-full object-cover"
      />
      <textarea
        ref="commentInput"
        v-model="newComment"
        placeholder="寫下你的留言..."
        rows="3"
        class="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      ></textarea>
      <button
        @click="submitComment(newComment)"
        :disabled="sending || !newComment.trim()"
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition disabled:opacity-50"
      >
        {{ sending ? "發送中..." : "發送" }}
      </button>
    </div>
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
