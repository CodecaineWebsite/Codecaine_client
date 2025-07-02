<template>
	<div
	class="relative editorSettingCard-linear-bgc py-3 px-4 w-full before:h-full before:w-1 before:bg-cc-13 before:content-[''] before:absolute before:top-0 before:left-0"
>
	<div class="flex justify-between">
	<label for="tags">Tags</label>
	<span class="text-xs align-text-bottom"
		>comma separated, max of five</span
	>
	</div>
	<div class="relative">
	<input
		id="tags"
		type="text"
		v-model="tagInput"
		@keyup.enter="addTag"
		class="w-full border border-gray-300 rounded-sm px-4 py-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-sm text-gray-500 placeholder-gray-500"
	/>
	</div>
	<div class="mt-2 flex flex-wrap gap-2">
	<EditorSmallButton
		v-for="(tag, index) in tags"
		:key="`${tag}-${index}`"
		class="mt-2 flex flex-wrap gap-2 bg-cc-13"
		>{{ tag }}
		<button
		@click="removeTag(index)"
		class="text-cc-9 hover:text-red-500"
		>
		✕
		</button>
	</EditorSmallButton>
	</div>
</div>
</template>
<script setup>
import { ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useWorkStore } from "@/stores/useWorkStore";
import EditorSmallButton from "@/components/Editor/EditorSmallButton.vue";
const workStore = useWorkStore();
const { currentWork } = storeToRefs(workStore);
const tags = ref(currentWork.value.tags);
const tagInput = ref("");
watch(
  tags,
  (newTags) => {
    workStore.updateTags(newTags);
  },
  { deep: true }
);
const addTag = async () => {
  if (!tagInput.value.trim()) return;
  const tag = tagInput.value.trim();
  if (tags.value.includes(tag)) {
    showToast({
      message: "This tag has already been added!",
      variant: "danger",
    });
    return;
  }
  if (tags.value.length >= 5) {
    showToast({
      message: "You can only add up to 5 tags.",
      variant: "danger",
    });
    return;
  }
  tags.value.push(tag);
  tagInput.value = "";
  await workStore.saveCurrentWork();
};
const removeTag = async (index) => {
  tags.value.splice(index, 1);
  await workStore.saveCurrentWork();
};
</script>