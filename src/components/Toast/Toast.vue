<template>
  <div
    :class="[
      'p-4 border-l-4 rounded bg-black text-white shadow-lg transition-transform duration-300 ease-out',
      variantClass,
    ]"
    @mouseenter="clearTimer"
    @mouseleave="startTimer"
  >
    <div class="flex justify-between items-center">
      <span>{{ message }}</span>
      <button @click="$emit('close')" class="ml-4 text-white">&times;</button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from 'vue';
const props = defineProps({
  message: String,
  variant: String,
  duration: Number,
  id: String,
});
const emit = defineEmits(['close']);

let timer;
function startTimer() {
  timer = setTimeout(() => emit('close'), props.duration);
}
function clearTimer() {
  clearTimeout(timer);
}
onMounted(startTimer);
onBeforeUnmount(clearTimer);

const variantClass = computed(() => {
  switch (props.variant) {
    case 'danger':
      return 'border-cc-red';
    case 'success':
      return 'border-cc-green';
    default:
      return 'border-cc-yellow';
  }
});
</script>
