<!-- components/SettingTextarea.vue -->
<template>
  <SettingCard>
    <div>
      <label :for="id">{{ label }}</label>
    </div>
    <div class="relative">
    <textarea
      :id="id"
      :placeholder="placeholder"
      :value="modelValue"
      @input="e => emit('update:modelValue', e.target.value)"
      v-bind="$attrs" 
      class="appearance-none w-full border border-gray-300 rounded-sm px-4 py-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-500 placeholder-gray-500"
    />

    </div>
  </SettingCard>
</template>

<script setup>
import SettingCard from "@/components/Editor/SettingCard.vue";
defineOptions({ inheritAttrs: false });
const props = defineProps({
  id: String,
  label: String,
  placeholder: String,
  modelValue: String,
})
const emit = defineEmits(["update:modelValue"]);
</script>
