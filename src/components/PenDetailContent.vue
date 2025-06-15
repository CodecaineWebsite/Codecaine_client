<script setup>
import { defineProps } from "vue";
import CommentList from "@/components/Comments/CommentList.vue";
const props = defineProps({
  pen: {
    type: Object,
    required: true,
  },
});
</script>
<template>
  <div>
    <CommentList :penId="pen.id" @close="$emit('close')"/>
  </div>
</template>
