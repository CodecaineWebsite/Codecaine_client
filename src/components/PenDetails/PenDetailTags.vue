<template>
  <div v-if="shouldShow" class="space-y-2">
    <div v-if="tags.length > 0" class="flex flex-wrap gap-2">
      <span
        v-for="tag in tags"
        :key="tag"
        class="bg-cc-13 px-2 py-0.5 text-xs text-cc-link rounded-full hover:bg-cc-10 hover:text-cc-1 transition-colors"
      >
        {{ tag }}
      </span>
    </div>
    <p v-else-if="isOwner" class="text-sm text-cc-3 font-bold p-2 border border-dashed border-cc-12 rounded-lg mb-4">
      <span class="italic">No tags.</span> Pens with tags are more helpful and easier to find.
    </p>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  pen: Object,
  currentUserId: String,
});

const tags = computed(() => props.pen.tags || []);
const isOwner = computed(() => props.pen.user_id === props.currentUserId);
const shouldShow = computed(() => tags.value.length > 0 || isOwner.value);
</script>