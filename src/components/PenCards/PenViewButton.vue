<template>
  <button
    @click="$emit('goToFullPage')"
    class="flex items-center gap-1 bg-card-button-primary hover-bg-card-hover text-white px-3 py-0.5 rounded-lg font-medium text-sm transition select-none"
  >
    <EyeIcon class="w-4 fill-current" />
    <span>{{ count }}</span>
  </button>
</template>

<script setup>
import EyeIcon from "@/components/icons/EyeIcon.vue";

defineProps({
  count: {
    type: Number,
    default: 0,
  },
});

defineEmits(["open"]);
</script>