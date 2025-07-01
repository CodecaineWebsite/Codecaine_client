<template>
  <button
    @click="$emit('openDetailModal')"
    class="cursor-pointer flex items-center gap-1 bg-card-button-primary hover-bg-card-hover text-white px-3 py-0.5 rounded-lg font-medium text-sm transition select-none"
  >
    <ChatBubbleIcon class="w-4 fill-current" />
    <span>{{ comments }}</span>
  </button>
</template>
<script setup>
import ChatBubbleIcon from "@/components/icons/ChatBubbleIcon.vue";
defineProps({
  comments: {
    type: Number,
    default: 0,
  },
});
defineEmits(["openDetailModal"]);
</script>
