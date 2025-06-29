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
  if (el) {
    el.style.height = "auto"; // reset
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
    emit("error", "Please log in before posting a comment.");
    return;
  }
  if (!newComment.value.trim()) {
    emit("error", "Comment content cannot be empty.");
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
      class="p-4 my-1.5 rounded text-sm text-center space-y-2 bg-cc-17"
    >
      <p class="text-cc-1 font-bold mb-4">Want to leave a comment or start your own work?</p>
      <div class="flex justify-center gap-2">
        <button
          @click="goSignup"
          class=" bg-cc-green text-cc-20 text-sm px-4 py-2 rounded hover:bg-cc-green-dark hover:text-cc-1 transition"
        >
          Sign Up for Codecaine
        </button>
        <button
          @click="goLogin"
          class="bg-cc-13 text-white text-sm px-4 py-2 rounded hover:bg-cc-12 transition"
        >
          Log in
        </button>
      </div>
    </div>
    <!-- 已登入 -->
    <div v-else class="flex flex-col items-center gap-2 rounded">
      <textarea
        ref="commentInput"
        v-model="newComment"
        placeholder="Leave a comment..."
        rows="3"
        class="w-full resize-none bg-cc-4 flex-1 px-3 py-2 rounded focus:outline-none focus:bg-cc-2 text-sm"
        @input="autoResize"
        style="overflow:hidden; min-height:3rem;"
      ></textarea>
      <button
        @click="submit"
        :disabled="sending || !newComment.trim()"
        class="ml-auto bg-cc-13 text-white text-sm px-4 py-2 rounded hover:bg-cc-12 transition disabled:text-cc-8 disabled:cursor-not-allowed disabled:bg-cc-10 disabled:hover:bg-cc-10"
      >
        {{ sending ? "Sending..." : "Comment" }}
      </button>
    </div>
  </div>
</template>


