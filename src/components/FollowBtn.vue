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
    ]"
  >
    <span v-if="!isFollowing">+ Follow</span>
    <span v-else-if="isHovering">✕ Unfollow</span>
    <span v-else>✓ Following</span>
  </button>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "@/config/api";

const props = defineProps({
  currentUser: {
    //可移除此prop留下targetUser就好
    type: [String, Number],
    required: true,
  },
  targetUser: {
    type: [String, Number],
    required: true,
  },
});

console.log(props); //這是可重複利用元件 拿來提醒目前使用者是誰/及目標追蹤的使用者是誰 在你載入元件的頁面會提醒

const isHovering = ref(false);
const isFollowing = ref(false);

const checkFollow = async () => {
  try {
    const res = await api.get(`/api/follows/check/${props.targetUser}`);
    isFollowing.value = res.data.isFollowing;
  } catch (error) {
    console.error("fetch follow error ", error);
  }
};
const handleClick = async () => {
  try {
    if (isFollowing.value == false) {
      const res = await api.post(`/api/follows/${props.targetUser}`);
      isFollowing.value = res.data.result;
    } else if (isFollowing.value == true) {
      const res = await api.delete(`/api/follows/${props.targetUser}`);
      isFollowing.value = res.data.result;
    }
  } catch (error) {
    console.error("fetch follow error ", error);
  }
};
onMounted(() => {
  checkFollow();
});
</script>
