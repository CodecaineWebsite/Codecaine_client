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
import { useRoute } from "vue-router";

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
  const url = `${window.location.origin}/${props.username}/pen/${props.penId}`;

  navigator.clipboard
    .writeText(url)
    .then(() => {
      // 可換成 emit 或 toast
      alert("連結已複製！");
    })
    .catch(() => {
      alert("複製失敗，請手動複製連結");
    });
}
</script>