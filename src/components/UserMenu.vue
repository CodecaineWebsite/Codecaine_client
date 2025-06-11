<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/useAuthStore";
import { signOut } from "firebase/auth";
import { auth } from "@/config/firebase";

const authStore = useAuthStore();
const router = useRouter();

const showMenu = ref(false);
const menuRef = ref(null);

const toggleMenu = () => {
  showMenu.value = !showMenu.value;
};

const goToPath = (path) => {
  showMenu.value = false;
  router.push(path);
};

const handleLogout = async () => {
  await signOut(auth);
  authStore.clearToken();
  goToPath("/");
};

const handleClickOutside = (event) => {
  if (menuRef.value && !menuRef.value.contains(event.target)) {
    showMenu.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});
onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
  <div
    class="relative w-9 h-9 md:w-11 md:h-11"
    ref="menuRef">
    <img
      :src="
        authStore.userProfile?.profile_image_url ||
        `https://assets.codepen.io/t-1/user-default-avatar.jpg`
      "
      alt="user avatar"
      class="w-full h-full rounded cursor-pointer object-cover"
      @click="toggleMenu" />
    <div
      v-if="showMenu"
      class="absolute right-0 mt-2 w-56 bg-cc-17 text-cc-1 rounded-md shadow-lg border border-cc-13 z-50 overflow-hidden">
      <ul class="flex flex-col text-sm">
        <li>
          <button
            class="px-4 py-2 text-left hover:bg-cc-13 w-full"
            @click="goToPath('/your-work')">
            Your Work
          </button>
        </li>
        <li>
          <button
            class="px-4 py-2 text-left hover:bg-cc-13 w-full"
            @click="goToPath(`/${authStore.userProfile.username || 'me'}`)">
            Profile
          </button>
        </li>
        <hr class="border-cc-13 my-1 mx-4" />
        <li
          class="flex items-center px-4 py-2 hover:bg-cc-13 cursor-pointer"
          @click="goToPath('/pen')">
          <i class="fas fa-pen mr-2 w-4 text-cc-10"></i>
          <span>New Caine</span>
        </li>
        <hr class="border-cc-13 my-1 mx-4" />
        <li
          class="flex items-center px-4 py-2 hover:bg-cc-13 cursor-pointer"
          @click="goToPath('/settings')">
          <i class="fas fa-cog mr-2 w-4 text-cc-10"></i>
          <span>Settings</span>
        </li>
        <li
          class="flex items-center px-4 py-2 hover:bg-cc-red-dark text-cc-red cursor-pointer"
          @click="handleLogout">
          <i class="fas fa-sign-out-alt mr-2 w-4"></i>
          <span>Log Out</span>
        </li>
      </ul>
    </div>
  </div>
</template>
