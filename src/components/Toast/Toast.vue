<template>
  <div
    :class="[
      'px-1.5 py-0.5 border-2 rounded bg-black text-white text-sm shadow-lg transition-all duration-300 ease-out',
      variantClass,
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4',
    ]"
    @mouseenter="pauseAutoClose"
    @mouseleave="resumeAutoClose"
  >
    <div class="flex justify-between items-center">
      <span>{{ message }}</span>
      <button @click="$emit('close')" class="ml-2 text-white">&times;</button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, computed, ref } from "vue";
const props = defineProps({
  message: String,
  variant: String,
  duration: {
    type: Number,
    default: 3000,
  },
  id: String,
});
const emit = defineEmits(["close"]);
const isVisible = ref(false);
let autoCloseTimer = null;
let fadeOutTimer = null;

const TRANSITION_DURATION = props.duration || 300;

function startEnterAnimation() {
  setTimeout(() => {
    isVisible.value = true;
  }, 50);
}
function resumeAutoClose() {
  autoCloseTimer = setTimeout(() => handleClose(), props.duration);
}
function pauseAutoClose() {
  clearTimeout(autoCloseTimer);
}

function handleClose() {
  isVisible.value = false;

  fadeOutTimer = setTimeout(() => {
    emit("close");
  }, TRANSITION_DURATION); // 需與 transition 時間一致
}

onMounted(() => {
  startEnterAnimation();
  resumeAutoClose();
});
onBeforeUnmount(() => {
  clearTimeout(autoCloseTimer);
  clearTimeout(fadeOutTimer);
});

const variantClass = computed(() => {
  switch (props.variant) {
    case "danger":
      return "border-cc-red";
    case "success":
      return "border-cc-green";
    case "warning":
      return "border-cc-green";
    default:
      return "border-cc-yellow";
  }
});
</script>
