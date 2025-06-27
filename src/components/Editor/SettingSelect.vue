<!-- components/SettingSelect.vue -->
<template>
  <SettingCard>
    <div>
      <label :for="id">{{ label }}</label>
    </div>
    <div class="relative">
      <select
        :id="id"
        :value="modelValue"
        @change="e => emit('update:modelValue', Number(e.target.value))"
        class="appearance-none w-full border border-gray-300 rounded-sm px-4 py-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-500"
      >
        <slot />
      </select>
      <div
        class="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 flex flex-col justify-around text-gray-500 text-xs leading-tight h-1/2"
      >
        <Arrow class="w-3 h-3 fill-current rotate-180" />
        <Arrow class="w-3 h-3 fill-current" />
      </div>
    </div>
  </SettingCard>
</template>

<script setup>
import SettingCard from './SettingCard.vue';
import Arrow from '@/assets/arrow.vue';
defineProps({
  id: String,
  label: String,
  modelValue: [String, Number],
});
const emit = defineEmits(["update:modelValue"]);
</script>
