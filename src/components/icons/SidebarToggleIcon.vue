<script setup>
defineProps({
  expanded: Boolean
});
</script>

<template>
  <div class="sidebar-toggle-icon" aria-hidden="true">
    <div class="lines">
      <span class="line short"></span>
      <span class="line medium"></span>
      <span class="line long"></span>
    </div>
    <svg
      viewBox="-122.9 121.1 105.9 61.9"
      xmlns="http://www.w3.org/2000/svg"
      class="arrow"
      :class="{ rotated: expanded }"
    >
      <path
        d="m-63.2 180.3 43.5-43.5c1.7-1.7 2.7-4 2.7-6.5s-1-4.8-2.7-6.5-4-2.7-6.5-2.7-4.8 1-6.5 2.7L-69.9 161l-37.2-37.2c-1.7-1.7-4-2.7-6.5-2.7s-4.8 1-6.5 2.6c-1.9 1.8-2.8 4.2-2.8 6.6 0 2.3.9 4.6 2.6 6.5 11.4 11.5 41 41.2 43 43.3l.2.2c3.6 3.6 10.3 3.6 13.9 0z"
        fill="currentColor"
      />
    </svg>
  </div>
</template>

<style scoped>
.sidebar-toggle-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1px;
}
.lines {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.line {
  height: 2px;
  background-color: white;
  border-radius: 1px;
}
.short {
  width: 6px;
}
.medium {
  width: 8px;
}
.long {
  width: 10px;
}

.arrow {
  width: 12px;
  height: 9px;
  color: white;
  transition: transform 0.25s ease;
}
.arrow.rotated {
  transform: rotate(180deg);
}
</style>
