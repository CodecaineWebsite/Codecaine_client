<template>
  <a :href="`/${props.username}/doses/showcase`" class="no-underline">
    <div
      class="flex flex-row items-center gap-1 bg-gray-700 h-[60px] rounded-md group hover:text-white p-1"
    >
      <div class="w-12 h-12 overflow-hidden p-1 rounded-lg">
        <img
          :src="props.profileImage ? props.profileImage : '/default-avatar.png'"
          :alt="`Profile image of ${props.username}`"
          class="w-full object-cover h-full rounded"
        />
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
