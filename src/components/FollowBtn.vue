<template>
  <button
    @click="handleClick"
    @mouseenter="isHovering = true"
    @mouseleave="isHovering = false"
    :class="[
      'text-xs py-[2px] px-[5px] rounded-xs cursor-pointer transition-colors duration-150 flex justify-center items-center',
      !isFollowing
        ? 'bg-cc-follow-btn-bg text-black hover:text-white hover:bg-cc-follow-btn-hover-bg'
        : isHovering
        ? 'bg-red-500 text-white hover:bg-red-700'
        : 'bg-gray-400 text-white',
    ]"
  >
    <span v-if="!isFollowing" class="flex gap-1.5 justify-center items-center"
      ><span><Add class="w-2.5 h-2.5" /></span> <span>Follow</span></span
    >
    <span
      v-else-if="isHovering"
      class="flex gap-1.5 justify-center items-center w-17.5"
    >
      <span><Close class="w-2.5 h-2.5" /></span> <span>Unfollow</span></span
    >
    <span v-else class="flex gap-1 justify-center items-center w-17.5"
      ><span><CheckIcon class="w-2.5 h-2.5" /></span
      ><span>Following</span></span
    >
  </button>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useFollowStatus } from "@/composables/useFollowStatus";
import { useAuthStore } from "@/stores/useAuthStore";
import Add from "./icons/Add.vue";
import Close from "./icons/Close.vue";
import CheckIcon from "./icons/CheckIcon.vue";

const authStore = useAuthStore();
const isHovering = ref(false);
const props = defineProps({
  targetUser: {
    type: [String, Number],
    required: true,
  },
});

const { isFollowing, checkFollow, handleFollowAction } = useFollowStatus(
  props.targetUser
);

const handleClick = () => handleFollowAction(props.targetUser);

const checkStatus = () => {
  if (authStore.user) {
    checkFollow();
  }
};

onMounted(() => {
  checkStatus();
});
</script>
