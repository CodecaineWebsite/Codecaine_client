<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

const props = defineProps({
  isOwner: Boolean,
  isPro: Boolean,
  isPrivate: Boolean,
  isFollowing: Boolean,
  userName: String,
  isLoggedIn: Boolean,
});
const emit = defineEmits(["follow", "togglePrivacy", "delete"]);

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});
onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
  <div v-if="isLoggedIn" class="relative" ref="dropdownRef">
    <!-- 三點按鈕 -->
    <button
      class="dropdown-toggle text-white text-xl font-bold hover:text-gray-300"
      @click.stop="toggleDropdown"
    >
      •••
    </button>

    <!-- 下拉選單 -->
    <div
      v-if="isOpen"
      class="absolute right-0 bottom-full mb-2 w-48 bg-card-menu text-sm rounded shadow-lg z-50 overflow-hidden border border-gray-700"
    >
      <button
        v-if="!isOwner"
        @click="emit('follow')"
        class="w-full px-4 py-2 hover:bg-cc-13 flex items-center gap-2"
      >
        Follow @{{ userName }}
      </button>

      <button
        v-if="isOwner"
        @click="emit('togglePrivacy')"
        class="w-full px-4 py-2 hover:bg-cc-13 flex items-center gap-2"
      >
        {{ isPrivate ? "Make Public" : "Make Private" }}
        <span v-if="!isPro" class="ml-1 bg-yellow-400 text-black text-[10px] font-bold px-1 py-[1px] rounded">
          PRO
        </span>
      </button>

      <button
        v-if="isOwner"
        @click="emit('delete')"
        class="w-full px-4 py-2 hover:bg-cc-red flex items-center gap-2"
      >
        Delete
      </button>
    </div>
  </div>
</template>
