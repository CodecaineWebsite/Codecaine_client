<template>
  <div v-if="shouldShow" class="space-y-2">
    <div
      v-if="pen.description"
      v-html="renderedDescription"
      class="prose dark:prose-invert"
    />
    <p v-else-if="isOwner" class="text-sm text-cc-7">
      No description. Pens with descriptions are more helpful and easier to
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
