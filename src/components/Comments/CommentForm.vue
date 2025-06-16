<script setup>
import { ref, nextTick } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/useAuthStore";

const emit = defineEmits(["submit", "error", "close"]);
const props = defineProps({
  sending: Boolean,
});

const router = useRouter();
const authStore = useAuthStore();
const newComment = ref("");
const commentInput = ref(null);

const goSignup = () => {
  emit("close");
  router.push("/signup");
};

const goLogin = () => {
  emit("close");
  router.push("/login");
};

const submit = () => {
  if (!authStore.user) {
    emit("error", "請先登入後再發表留言");
    return;
  }
  if (!newComment.value.trim()) {
    emit("error", "留言內容不能為空");
    return;
  }
  emit("submit", newComment.value.trim());
  newComment.value = "";
  nextTick(() => {
    commentInput.value?.focus();
  });
};

defineExpose({
  commentInput,
  newComment,
});
</script>

<template>
  <div>
    <!-- 未登入 -->
    <div
      v-if="!authStore.user"
      class="p-4 border rounded text-sm text-center space-y-2 bg-amber-200"
    >
      <p>Want to leave a comment or start your own work?</p>
      <div class="flex justify-center pag-4">
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
          Login
        </button>
      </div>
    </div>
    <!-- 已登入 -->
    <div v-else class="flex items-center gap-2 p-4 border rounded bg-red-100">
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
        @click="submit"
        :disabled="sending || !newComment.trim()"
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition disabled:opacity-50"
      >
        {{ sending ? "發送中..." : "發送" }}
      </button>
    </div>
  </div>
</template>
