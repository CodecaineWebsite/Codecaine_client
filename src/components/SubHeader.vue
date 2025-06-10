<template>
  <header
    class="bg-cc-20 text-cc-1 flex items-center justify-between px-4 py-2 relative border-b-3 border-cc-14"
  >
    <!-- 左側 Tabs -->
    <div class="flex items-center" v-if="authStore.idToken">
      <div class="flex items-center ml-2 space-x-px">
        <button
          v-for="tab in tabs"
          :key="tab"
          @click="goToPath('/' + tab.toLowerCase().replace(' ', '-'))"
          class="relative h-9 md:h-11 px-5 text-smmd:text-base bg-cc-14 text-cc-1 hover:text-cc-1 focus:outline-none first:rounded-l last:rounded-r whitespace-nowrap"
        >
          {{ tab }}
          <span
            class="absolute bottom-0 left-0 h-1 bg-cc-green transition-all duration-300"
            :class="activeTab === tab ? 'w-full' : 'w-0'"
          ></span>
        </button>
      </div>
    </div>

    <!-- 中間搜尋欄 -->
    <div
      v-if="!['search', 'search-category'].includes(route.name)"
      :class="[
        'flex-grow flex px-2',
        authStore.idToken ? 'justify-center' : 'justify-start',
      ]"
    >
      <div class="relative max-w-60 h-9 md:h-11">
        <i
          class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-cc-10"
        ></i>
        <form @submit.prevent="handleSearchSubmit">
          <input
            type="text"
            placeholder="Search Codecaine..."
            class="bg-cc-14 text-cc-1 pl-10 pr-4 py-2 rounded w-full h-9 md:h-11 placeholder-cc-10 focus:outline-none transition-all duration-300"
            v-model="searchKeyword"
            @focus="searchFocused = true"
            @blur="searchFocused = false"
          />
        </form>

        <!-- 搜尋選單 -->
        <div
          v-if="searchFocused"
          class="absolute left-0 mt-2 bg-cc-18 text-cc-1 rounded-md shadow-lg border border-cc-13 z-50 flex space-x-0.5 px-2 py-2"
        >
          <button v-if="authStore.idToken"
            @mousedown="selectSearchTab('your-work')"
            class="px-2.5 py-1.5 rounded bg-cc-14 text-cc-1 text-xs hover:bg-cc-13 transition transform active:translate-y-0.5 flex items-center"
          >
            <YourWorkIcon class="fill-current w-3 mr-1 text-cc-1" />
            Your Work
          </button>
          <button
            @mousedown="selectSearchTab('pens')"
            class="px-2.5 py-1.5 rounded bg-cc-14 text-cc-1 text-sm hover:bg-cc-13 transition flex items-center"
          >
            <PensIcon
              class="fill-current w-3 mr-1"
              :class="searchTab === 'pens' ? 'text-cc-pens' : 'text-cc-1'"
            />
            Pens
          </button>
        </div>
      </div>
    </div>

    <!-- 右側 -->
    <div class="flex items-center space-x-3">
      <!-- 未登入 -->
      <template v-if="!authStore.idToken">
        <button
          class="bg-green-500 text-cc-20 h-9 md:h-11 px-4 rounded hover:bg-green-400 font-semibold whitespace-nowrap"
          @click="goToPath('/signup')"
        >
          Sign Up
        </button>
        <button
          class="bg-cc-13 h-9 md:h-11 px-4 rounded hover:bg-cc-12 font-semibold whitespace-nowrap"
          @click="goToPath('/login')"
        >
          Log In
        </button>
      </template>

      <!-- 已登入 -->
      <template v-if="authStore.idToken">
        <UserMenu />
      </template>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "../stores/useAuthStore";

import UserMenu from "./UserMenu.vue";

import YourWorkIcon from "@/components/icons/YourWorkIcon.vue";
import PensIcon from "@/components/icons/PensIcon.vue";

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

const showMenu = ref(false);
const searchFocused = ref(false);
const searchTab = ref("pens");
const tabs = ["Your Work", "Following", "Trending"];

// 依路徑改變 activeTtab
const activeTab = computed(() => {
  const path = route.path;
  if (path.startsWith("/your-work")) return "Your Work";
  if (path.startsWith("/following")) return "Following";
  if (path.startsWith("/trending")) return "Trending";
  return ""; // 其他頁不亮任何 tab
});

const searchKeyword = ref("");

const handleSearchSubmit = () => {
  const trimmed = searchKeyword.value.trim().toLowerCase();

  router.push({
    path: "/search/pens",
    query: { q: trimmed },
  });
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



// 搜尋選項點擊
const selectSearchTab = (tab) => {
  searchTab.value = tab;
  if (tab === "your-work") goToPath("/your-work");
  else if (tab === "pens") goToPath({ path: "/search/pens", query: { q: "" } });
  else if (tab === "collections")
    goToPath({ path: "/search/collections", query: { q: "" } });
};
</script>
