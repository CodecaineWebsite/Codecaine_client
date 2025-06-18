<template>
  <div class="relative" ref="dropdownRef">
    <button
      class="text-white text-xl font-bold hover:text-gray-300"
      @click.stop="toggle"
    >
      •••
    </button>
    <div
      v-if="menuOpen"
      class="absolute right-0 mt-2 w-48 bg-card-menu text-sm rounded shadow-lg z-50 overflow-hidden border border-gray-700"
    >
      <!-- 追蹤 -->
      <button
        v-if="!isOwner"
        @click="handleFollow"
        class="block w-full px-4 py-2 hover:bg-card-13 flex items-center gap-2"
      >
        <CheckIcon />
        <span v-if="!isFollowing">Follow @{{ userName }}</span>
        <span v-else>Unfollow @{{ userName }}</span>
      </button>

      <!-- 切換公開／私密 -->
      <button
        v-if="isOwner"
        @click="handleTogglePrivacy"
        class="block w-full text-left px-4 py-2 hover:bg-cc-13 flex items-center gap-2"
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
        class="block w-full text-left px-4 py-2 hover:bg-cc-13 flex items-center gap-2"
      >
        <TrashCanIcon class="w-4 fill-current" />
        Delete
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import CheckIcon from "@/components/icons/CheckIcon.vue";
import LockClosedIcon from "@/components/icons/LockClosedIcon.vue";
import UnlockIcon from "@/components/icons/UnlockIcon.vue";
import TrashCanIcon from "@/components/icons/TrashCanIcon.vue";

// props
const props = defineProps({
  isOwner: Boolean,
  isPro: Boolean,
  isPrivate: Boolean,
  isFollowing: Boolean,
  userName: String,
});

// emits
const emit = defineEmits([
  "follow",
  "togglePrivacy",
  "delete"
]);

const menuOpen = ref(false);
const dropdownRef = ref(null);

const toggle = () => {
  menuOpen.value = !menuOpen.value;
};

const close = () => {
  menuOpen.value = false;
};

const handleClickOutside = (event) => {
  if (menuOpen.value && dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    close();
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});
onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});

const handleFollow = () => {
  emit("follow");
  close();
};

const handleTogglePrivacy = () => {
  emit("togglePrivacy");
  close();
};

const handleDelete = () => {
  emit("delete");
  close();
};
</script>
