<template>
  <div class="inline-flex rounded overflow-hidden">
    <button
      :class="[
        'px-3 py-2',
        viewMode === 'grid' ? 'bg-grid-active' : 'bg-button bg-list-hover',
      ]"
      @click="changeViewMode('grid')"
    >
      <GridIcon
        class="fill-current w-4 h-4"
        :class="{
          'text-cc-1': viewMode === 'grid',
          'text-cc-10': viewMode !== 'grid',
        }"
      />
    </button>
    <button
      :class="[
        'px-3 py-2 border-l border-default',
        viewMode === 'table' ? 'bg-grid-active' : 'bg-button bg-list-hover',
      ]"
      @click="changeViewMode('table')"
    >
      <ListIcon
        class="fill-current w-4 h-4"
        :class="{
          'text-cc-1': viewMode === 'table',
          'text-cc-10': viewMode !== 'table',
        }"
      />
    </button>
  </div>
</template>

<script setup>
import { ref } from "vue";
import GridIcon from "@/components/icons/GridIcon.vue";
import ListIcon from "@/components/icons/ListIcon.vue";

const emit = defineEmits(["update:viewMode"]);
const viewMode = ref("grid");

const changeViewMode = (mode) => {
  viewMode.value = mode;
  emit("update:viewMode", mode);
};
</script>
