<template>
  <a href="">
    <div
      class="flex flex-row items-center gap-1 bg-gray-700 h-[60px] rounded-md group hover:text-white p-1"
    >
      <div class="w-12 h-12 overflow-hidden p-1">
        <img src="/default-avatar.png" class="w-full object-cover rounded-md" />
      </div>
      <div class="overflow-hidden">
        <div class="text-xl truncate max-w-30">
          {{ props.displayName ? props.displayName : props.username }}
        </div>
        <div class="text-blue-300 text-xs group-hover:text-white">
          @{{ props.username }}
        </div>
      </div>
    </div>
  </a>
</template>

<script setup>
//調整檔案大寫
const props = defineProps({
  username: {
    type: String,
    required: true,
  },
  displayName: {
    type: String,
  },
  profileImage: {
    type: null,
  },
});
</script>
