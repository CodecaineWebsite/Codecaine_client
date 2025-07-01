<template>
  <button
    @click="$emit('openDetailModal')"
    class="bg-black/50 rounded p-1 cursor-pointer"
  >
    <ExternalLinkIcon class="w-4 fill-current" />
  </button>
</template>

<script setup>
import ExternalLinkIcon from "@/components/icons/ExternalLinkIcon.vue";
defineEmits(["openDetailModal"]);
</script>
