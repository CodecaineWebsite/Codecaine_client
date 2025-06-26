<!-- components/SettingCard.vue -->
<template>
  <div
    class="relative editorSettingCard-linear-bgc py-3 px-4 w-full before:h-full before:w-1 before:bg-cc-13 before:content-[''] before:absolute before:top-0 before:left-0"
  >
    <label :for="id">{{ label }}</label>
    <slot />
  </div>
</template>
<script setup>
	defineProps({
	id: String,
	label: String,
	});
</script>