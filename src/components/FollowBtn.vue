<template>
  <button
    class="min-w-[75px]"
    @click="handleClick"
    @mouseenter="isHovering = true"
    @mouseleave="isHovering = false"
    :class="[
      'text-xs px-1 py-1 rounded cursor-pointer transition-colors duration-150',
      !isFollowing
        ? 'bg-green-500 text-black hover:text-white hover:bg-green-800'
        : isHovering
        ? 'bg-red-500 text-white hover:bg-red-700'
        : 'bg-gray-400 text-white',
    ]">
    <span v-if="!isFollowing">+ Follow</span>
    <span v-else-if="isHovering">✕ Unfollow</span>
    <span v-else>✓ Following</span>
  </button>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import api from "@/config/api";

const props = defineProps({
  currentUser: {
    type: [String, Number],
    required: true,
  },
  targetUser: {
    type: [String, Number],
    required: true,
  },
});

console.log(props);

const emit = defineEmits(["update"]);

const isHovering = ref(false);
const isFollowing = ref(null);

const handleClick = async () => {
  isFollowing.value = !isFollowing.value;
  emit("update", isFollowing.value);
  const res = await api.post(`/api/follows/${props.targetUser}`);
  console.log(res.data);
  // 你可以在這裡呼叫 follow/unfollow API，例如：
  // followUserAPI(props.targetUser.id) or unfollowUserAPI(...)
};
</script>
