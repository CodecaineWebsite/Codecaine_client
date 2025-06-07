<template>
  <nav class="flex justify-center items-center mt-20 mb-12 gap-3">
    <button
      v-if="currentPage > 1"
      @click="$emit('prev')"
      class="px-4 py-3 bg-[#444857] hover:bg-[#5A5F73] rounded-sm flex gap-1"
    >
      <LeftArrowIcon class="fill-current w-2" />
      Prev
    </button>

    <button
      v-if="currentPage < totalPages"
      @click="$emit('next')"
      class="px-4 py-3 bg-[#444857] hover:bg-[#5A5F73] rounded-sm flex gap-1"
    >
      Next
      <RightArrowIcon class="fill-current w-2" />
    </button>
  </nav>
</template>

<script setup>
import LeftArrowIcon from "@/components/icons/LeftArrowIcon.vue";
import RightArrowIcon from "@/components/icons/RightArrowIcon.vue";

defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
});
</script>
