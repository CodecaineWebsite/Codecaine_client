<template>
  <div v-if="shouldShow" class="space-y-2">
    <div v-if="tags.length > 0" class="flex flex-wrap gap-2">
      <span
        v-for="tag in tags"
        :key="tag"
        class="bg-cc-13 px-2 py-1 text-sm rounded"
      >
        {{ tag }}
      </span>
    </div>
    <p v-else-if="isOwner" class="text-sm text-cc-7">
      No tags. Pens with tags are more helpful and easier to find.
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
const isOwner = computed(() => props.pen.user?.id === props.currentUserId);
const shouldShow = computed(() => tags.value.length > 0 || isOwner.value);
</script>