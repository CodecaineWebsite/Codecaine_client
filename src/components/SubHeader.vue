<template>
  <header
    class="bg-cc-20 text-cc-1 flex items-center justify-between px-4 py-2 relative border-b-3 border-cc-14">
    <!-- 左側 Tabs -->
    <div
      class="flex items-center"
      v-if="authStore.idToken">
      <div class="flex ml-2 space-x-px">
        <button
          v-for="tab in tabs"
          :key="tab"
          @click="setActiveTab(tab)"
          class="relative px-5 py-3 text-lg bg-cc-14 text-cc-1 hover:text-cc-1 focus:outline-none first:rounded-l-md last:rounded-r-md">
          {{ tab }}
          <span
            class="absolute bottom-0 left-0 h-1 bg-cc-green transition-all duration-300"
            :class="activeTab === tab ? 'w-full' : 'w-0'"></span>
        </button>
      </div>
    </div>

    <!-- 中間搜尋欄 -->
    <div
      v-if="!['search', 'search-category'].includes(route.name)"
      :class="[
        'flex-grow flex px-2',
        authStore.idToken ? 'justify-center' : 'justify-start',
      ]">
      <div class="relative w-60">
        <i
          class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-cc-10"></i>
        <input
          type="text"
          placeholder="Search CodePen..."
          class="bg-cc-14 text-cc-1 pl-10 pr-4 py-2 rounded-md w-full placeholder-cc-10 focus:outline-none transition-all duration-300"
          @focus="searchFocused = true"
          @blur="searchFocused = false" />

        <!-- 搜尋選單 -->
        <div
          v-if="searchFocused"
          class="absolute left-0 mt-2 bg-cc-18 text-cc-1 rounded-md shadow-lg border border-cc-13 z-50 flex space-x-0.5 px-2 py-2">
          <button
            @click="selectSearchTab('your-work')"
            class="px-2.5 py-1.5 rounded bg-cc-14 text-cc-1 text-xs hover:bg-cc-13 transition transform active:translate-y-0.5 flex items-center">
            <YourWorkIcon class="fill-current w-3 mr-1 text-cc-1" />
            Your Work
          </button>
          <button
            @click="selectSearchTab('pens')"
            class="px-2.5 py-1.5 rounded bg-cc-14 text-cc-1 text-sm hover:bg-cc-13 transition flex items-center">
            <PensIcon
              class="fill-current w-3 mr-1"
              :class="searchTab === 'pens' ? 'text-cc-pens' : 'text-cc-1'" />
            Pens
          </button>
          <button
            @click="selectSearchTab('collections')"
            class="px-2.5 py-1.5 rounded bg-cc-14 text-cc-1 text-sm hover:bg-cc-13 transition flex items-center">
            <CollectionsIcon class="fill-current w-3 mr-1 text-cc-1" />
            Collections
          </button>
        </div>
      </div>
    </div>

    <!-- 右側 -->
    <div class="flex items-center space-x-3">
      <!-- 未登入 -->
      <template v-if="!authStore.idToken">
        <button
          class="bg-green-500 text-cc-20 px-4 py-2 rounded-md hover:bg-green-400 font-semibold"
          @click="goToPath('/signup')">
          Sign Up
        </button>
        <button
          class="bg-cc-13 px-4 py-2 rounded-md hover:bg-cc-12 font-semibold"
          @click="goToPath('/login')">
          Log In
        </button>
      </template>

      <!-- 已登入 -->
      <template v-if="authStore.idToken">
        <div
          class="relative"
          ref="menuRef">
          <img
            :src="
              authStore.userProfile?.profile_image_url || '/default-avatar.png'
            "
            alt="user avatar"
            class="w-12 h-12 rounded-md cursor-pointer object-cover"
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
                  @click="
                    goToPath(`/${authStore.userProfile?.username || 'me'}`)
                  ">
                  Profile
                </button>
              </li>
              <hr class="border-cc-13 my-1 mx-4" />
              <li
                class="flex items-center px-4 py-2 hover:bg-cc-13 cursor-pointer"
                @click="goToPath('/pen')">
                <i class="fas fa-pen mr-2 w-4 text-cc-10"></i>
                <span>New Pen</span>
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
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "../stores/useAuthStore";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";

import YourWorkIcon from "@/components/icons/YourWorkIcon.vue";
import PensIcon from "@/components/icons/PensIcon.vue";
import ProjectsIcon from "@/components/icons/ProjectsIcon.vue";
import CollectionsIcon from "@/components/icons/CollectionIcon.vue";

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

const showMenu = ref(false);
const menuRef = ref(null);
const searchFocused = ref(false);
const searchTab = ref("pens");
const tabs = ["Your Work", "Following", "Trending"];
const activeTab = ref("Your Work");

const toggleMenu = () => {
  showMenu.value = !showMenu.value;
};

// 支援物件與字串導向
const goToPath = (pathOrLocation) => {
  showMenu.value = false;

  const path =
    typeof pathOrLocation === "string"
      ? pathOrLocation
      : pathOrLocation.path || "";

  if (path === "/your-work") activeTab.value = "Your Work";
  else if (path === "/following") activeTab.value = "Following";
  else if (path === "/trending") activeTab.value = "Trending";
  else activeTab.value = "";

  router.push(pathOrLocation);
};

// 主選單 tab 點擊
const setActiveTab = (tab) => {
  if (tab === "Your Work") goToPath("/your-work");
  else if (tab === "Following") goToPath("/following");
  else if (tab === "Trending") goToPath("/trending");
};

// 搜尋選項點擊
const selectSearchTab = (tab) => {
  searchTab.value = tab;

  if (tab === "your-work") goToPath("/your-work");
  else if (tab === "pens") goToPath({ path: "/search/pens", query: { q: "" } });
  else if (tab === "collections")
    goToPath({ path: "/search/collections", query: { q: "" } });
};

// 登出
const handleLogout = async () => {
  await signOut(auth);
  authStore.clearToken();
  goToPath("/");
};

// 點擊外部時關閉使用者選單
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
