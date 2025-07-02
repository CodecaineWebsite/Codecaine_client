
<template>
  <SettingCard>
    <div>
      <label :for="id">{{ label }}</label>
    </div>
    <div class="relative">
      <input
        :id="id"
        :placeholder="placeholder"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        class="appearance-none w-full border border-gray-300 rounded-sm px-4 py-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-500 placeholder-gray-500"
      />
      <slot />
    </div>
  </SettingCard>
</template>

<script setup>
import SettingCard from "@/components/Editor/SettingCard.vue";
defineProps({
  id: String,
  label: String,
  placeholder: String,
  modelValue: String,
});
defineEmits(["update:modelValue"]);
</script>
