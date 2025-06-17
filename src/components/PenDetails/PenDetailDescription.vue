<template>
  <div v-if="shouldShow" class="space-y-2">
    <div
      v-if="pen.description"
      v-html="renderedDescription"
      class="prose prose-invert prose-sm"
    />
    <p v-else-if="isOwner" class="text-sm text-cc-3 font-bold p-2 border border-dashed border-cc-12 rounded-lg mb-4">
      <span class="italic">No description.</span> Pens with descriptions are more helpful and easier to
      find.
    </p>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { marked } from "marked";
import DOMPurify from "dompurify";

const props = defineProps({
  pen: Object,
  currentUserId: String,
});

const isOwner = computed(() => props.pen.user_id === props.currentUserId);
const shouldShow = computed(() => props.pen.description || isOwner);
const renderedDescription = computed(() => {
  const rawHtml = marked.parse(props.pen.description || "");
  return DOMPurify.sanitize(rawHtml);
});
</script>
