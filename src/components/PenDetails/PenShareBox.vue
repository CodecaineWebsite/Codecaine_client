<template>
  <div
    class="bg-cc-14 text-cc-1 rounded px-4 py-2 flex items-center text-sm mb-4"
  >
    <span class="uppercase flex-1 text-center mr-2"> Share </span>
    <span class="flex-1 ml-1">
      <a
        href="#"
        @click.prevent="copyLink"
        class="block text-xs bg-cc-10 hover:bg-cc-11 px-2 py-1 rounded text-center transition whitespace-nowrap"
      >
        Copy Link
      </a>
    </span>
  </div>
</template>

<script setup>
import { useToastStore } from "@/stores/useToastStore";
const toastStore = useToastStore();
console.log(toastStore);

const props = defineProps({
  penId: {
    type: [String, Number],
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
});

function copyLink() {
  const url = `${window.location.origin}/${props.username}/dose/${props.penId}`;

  navigator.clipboard
    .writeText(url)
    .then(() => {
      toastStore.showToast({
        message: "Link copied!",
        variant: "success",
      });
    })
    .catch(() => {
      toastStore.showToast({
        message: "Copy failed, please manually copy the link.",
        variant: "danger",
      });
    });
}
</script>
