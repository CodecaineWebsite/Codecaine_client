<script setup>
import { ref, nextTick, onMounted } from "vue";
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

function autoResize() {
  const el = commentInput.value;
  console.log(el)
  if (el) {
    el.style.height = "auto"; // reset
    console.log(el.scrollHeight)
    el.style.height = el.scrollHeight + "px"; // set to scrollHeight
    // autoResize目前不管用
  }
}

onMounted(() => {
  autoResize(); // 初始時也調整一次
});

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
    <div v-else class="flex flex-col items-center gap-2 p-4 rounded bg-cc-14 shadow-xl">
      <textarea
        ref="commentInput"
        v-model="newComment"
        placeholder="Leave a comment..."
        rows="3"
        class="w-full resize-none bg-cc-4 flex-1 px-3 py-2 rounded focus:outline-none focus:bg-cc-2"
        @input="autoResize"
        style="overflow:hidden; min-height:3rem;"
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
