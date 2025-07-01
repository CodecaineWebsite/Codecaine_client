<template>
  <div v-if="authStore.user" class="relative" ref="dropdownRef">
    <button
      class="text-white text-xl font-bold hover:text-gray-300 cursor-pointer"
      @click="toggleDropdown"
    >
      •••
    </button>
    <div
      v-if="showDropdown"
      class="absolute right-0 bottom-full mb-2 w-48 bg-card-menu text-sm rounded shadow-lg z-50 overflow-hidden border border-gray-700"
    >
      <!-- 追蹤 -->
      <button
        v-if="!isOwner"
        @click="handleFollow"
        class="w-full px-4 py-2 hover:bg-cc-13 flex items-center gap-2 cursor-pointer"
      >
        <CheckIcon />
        <span v-if="isFollowing">Unfollow @{{ userName }}</span>
        <span v-else>Follow @{{ userName }}</span>
      </button>

      <!-- 切換公開／私密 -->
      <button
        v-if="isOwner"
        @click="handleTogglePrivacy"
        class="w-full text-left px-4 py-2 hover:bg-cc-13 flex items-center gap-2 cursor-pointer"
      >
        <component
          :is="isPrivate ? UnlockIcon : LockClosedIcon"
          class="w-4 fill-current"
        />
        {{ isPrivate ? "Make Public" : "Make Private" }}
        <span
          v-if="!isPro"
          class="ml-1 bg-yellow-400 text-black text-[10px] font-bold px-1 py-[1px] rounded transition inline-flex items-center justify-center"
        >
          PRO
        </span>
      </button>

      <!-- 刪除 -->
      <button
        v-if="isOwner"
        @click="handleDelete"
        class="w-full text-left px-4 py-2 hover:bg-cc-red flex items-center gap-2 cursor-pointer"
      >
        <TrashCanIcon class="w-4 fill-current" />
        Delete
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { onClickOutside } from "@vueuse/core";
import { useAuthStore } from "@/stores/useAuthStore";
import CheckIcon from "@/components/icons/CheckIcon.vue";
import LockClosedIcon from "@/components/icons/LockClosedIcon.vue";
import UnlockIcon from "@/components/icons/UnlockIcon.vue";
import TrashCanIcon from "@/components/icons/TrashCanIcon.vue";

const authStore = useAuthStore();
const showDropdown = ref(false);
const dropdownRef = ref(null);

const props = defineProps({
  isOwner: Boolean,
  isPro: Boolean,
  isPrivate: Boolean,
  isFollowing: Boolean,
  userName: String,
});

// emits
const emit = defineEmits(["follow", "togglePrivacy", "delete"]);

const handleFollow = () => {
  emit("follow");
};

const handleTogglePrivacy = () => {
  emit("togglePrivacy");
};

const handleDelete = () => {
  emit("delete");
};
const toggleDropdown = async () => {
  showDropdown.value = !showDropdown.value;
};
onClickOutside(dropdownRef, () => {
  showDropdown.value = false;
});
</script>
