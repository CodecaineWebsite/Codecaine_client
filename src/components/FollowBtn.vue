<template>
  <button
    class="min-w-[75px]"
    @click="handleClick"
    @mouseenter="isHovering = true"
    @mouseleave="isHovering = false"
    :class="[
      'text-xs px-1 rounded cursor-pointer transition-colors duration-150 flex justify-center items-center',
      !isFollowing
        ? 'bg-green-500 text-black hover:text-white hover:bg-green-800'
        : isHovering
        ? 'bg-red-500 text-white hover:bg-red-700'
        : 'bg-gray-400 text-white',
    ]"
  >
    <span v-if="!isFollowing"><span>+</span> <span>Follow</span></span>
    <span v-else-if="isHovering"> <span>✕</span> <span>Unfollow</span></span>
    <span v-else><span>✓</span> <span>Following</span></span>
  </button>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "@/config/api";
import { useFollowStatus } from "@/composables/useFollowStatus";

const isHovering = ref(false);
const props = defineProps({
  targetUser: {
    type: [String, Number],
    required: true,
  },
});

const { isFollowing, setFollowing, checkFollow } = useFollowStatus(
  props.targetUser
);

const handleClick = async () => {
  try {
    if (!isFollowing.value) {
      const res = await api.post(`/api/follows/${props.targetUser}`);
      setFollowing(res.data.result);
    } else {
      const res = await api.delete(`/api/follows/${props.targetUser}`);
      setFollowing(res.data.result);
    }
  } catch (error) {
    console.error("fetch follow error ", error);
  }
};

onMounted(() => {
  checkFollow();
});
</script>
