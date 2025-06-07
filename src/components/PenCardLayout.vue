<template>
  <!-- grid layout -->
  <div
    class="grid [grid-template-columns:repeat(auto-fill,minmax(30%,1fr))] gap-12"
  >
    <penCard
      v-for = "card in pens"
      :pen = "card"
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
