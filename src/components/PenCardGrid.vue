<template>
  <div
    class="grid [grid-template-columns:repeat(auto-fill,minmax(30%,1fr))] gap-12"
  >
    <penCard
      v-for="card in pens"
      :key="card.id"
      :title="card.title"
      :description="card.description"
      :userName="card.username"
      :userDisplayName="card.user_display_name"
      :favorites_count="card.favorites_count"
      :comments_count="card.comments_count"
      :views_count="card.views_count"
    />
  </div>
</template>

<script setup>
import penCard from "./penCard.vue";
defineProps({
  pens: {
    type: Array,
    required: true,
  },
});
</script>
