<template>
  <header
    class="relative bg-cc-20 text-cc-1 w-full px-2 py-2 sm:px-4 sm:py-2 border-b-3 border-cc-14 flex items-center gap-2 sm:gap-4"
  >
    <!-- Logo + SidebarToggleIcon：830px 以下顯示 -->
    <div
      class="flex items-center space-x-2 flex-shrink-0 hidden max-[830px]:flex"
    >
      <button @click="goToHome">
        <LogoIcon alt="icon" class="w-10 h-10 text-white cursor-pointer" />
      </button>
      <button
        @click.stop="toggleDropdown; isMenuOpen = !isMenuOpen"
        class="w-9 h-9 flex items-center justify-center bg-cc-14 hover:bg-cc-13 rounded transition"
        title="Toggle Navigation"
      >
        <SidebarToggleIcon :expanded="isMenuOpen" />
      </button>
    </div>

    <!-- Tabs（登入 + 大於 634px） -->
    <div
      v-if="authStore.idToken && !isVerySmallScreen"
      class="flex items-center space-x-px flex-shrink-0"
    >
      <button
        v-for="tab in tabs"
        :key="tab"
        @click="goToPath('/' + tab.toLowerCase().replace(' ', '-'))"
        class="relative h-9 px-4 text-sm bg-cc-14 hover:text-cc-1 focus:outline-none first:rounded-l last:rounded-r"
      >
        {{ tab }}
        <span
          class="absolute bottom-0 left-0 h-1 bg-cc-green transition-all duration-300"
          :class="activeTab === tab ? 'w-full' : 'w-0'"
        ></span>
      </button>
    </div>

    <!-- 搜尋欄 -->
    <div class="flex-1 flex justify-center">
      <div class="relative h-9 ml-2 w-full min-w-0 max-w-[320px]">
        <i
          class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-cc-10"
        ></i>
        <form @submit.prevent="handleSearchSubmit">
          <input
            type="text"
            placeholder="Search Codecaine..."
            class="bg-cc-14 text-cc-1 pl-10 pr-4 py-2 rounded w-full h-full placeholder-cc-10 focus:outline-none"
            v-model="searchKeyword"
            @focus="searchFocused = true"
            @blur="searchFocused = false"
          />
        </form>

        <!-- 浮出搜尋選單 -->
        <div
          v-if="searchFocused"
          class="absolute left-0 mt-2 bg-cc-18 text-cc-1 rounded shadow-lg z-50 flex space-x-1 px-1 py-1"
        >
          <button
            v-if="authStore.idToken"
            @mousedown="selectSearchTab('your-work')"
            class="px-2 py-1 rounded bg-cc-14 text-cc-10 text-xs hover:bg-cc-13 hover:text-cc-5 transition flex items-center"
          >
            <YourWorkIcon class="fill-current w-3 mr-1 text-cc-10" />
            Your Work
          </button>
          <button
            @mousedown="selectSearchTab('doses')"
            class="px-2 py-1 rounded bg-cc-14 text-cc-10 text-sm hover:bg-cc-13 hover:text-cc-5 transition flex items-center"
          >
            <PensIcon
              class="fill-current w-3 mr-1"
              :class="searchTab === 'doses' ? 'text-cc-pens' : 'text-cc-10'"
            />
            Doses
          </button>
        </div>
      </div>
    </div>

    <!-- 登入按鈕 or 使用者選單 -->
    <div class="flex items-center space-x-3 flex-shrink-0 ml-auto">
      <template v-if="!authStore.idToken">
        <button
          class="bg-green-500 text-cc-20 h-9 px-4 rounded hover:bg-green-400 font-semibold"
          @click="goToPath('/signup')"
        >
          Sign Up
        </button>
        <button
          v-if="route.name !== 'login'"
          class="bg-cc-13 h-9 px-4 rounded hover:bg-cc-12 font-semibold"
          @click="goToPath('/login')"
        >
          Log In
        </button>
      </template>
      <template v-else>
        <Notify />
        <UserMenu />
      </template>
    </div>

    <!-- 下拉選單：830px 以下 -->
    <div
      v-if="isMenuOpen && isCompactScreen"
      ref="dropdownRef"
      class="absolute top-full left-2 mt-2 bg-cc-16 text-cc-1 w-[220px] rounded-md shadow-xl shadow-gray-950 z-50 py-2"
    >
      <div class="text-[10px] text-gray-400 px-4 mb-2">CREATE</div>
      <div
        @click="goToPath('/dose')"
        class="cursor-pointer rounded-md overflow-hidden mb-2 mx-2"
      >
        <div
          class="h-[2px] w-full bg-gradient-to-r from-[#4fcf70] via-[#fad648] via-[#a767e5] via-[#12bcfe] to-[#44ce7b]"
        ></div>
        <div
          class="bg-cc-14 hover:bg-[#1f2025] text-cc-1 text-sm px-4 py-3 font-medium text-center flex items-center justify-center gap-2"
        >
          <Layout class="w-4 h-4" />
          <div class="font-medium">
            {{ authStore.idToken ? "Dose" : "Start Coding" }}
          </div>
        </div>
      </div>

      <!-- 已登入：功能頁面 -->
      <div
        v-if="authStore.idToken"
        class="cursor-pointer hover:bg-cc-17 px-4 py-2 text-sm font-medium"
        @click="goToPath('/your-work')"
      >
        Your Work
      </div>
      <div
        v-if="authStore.idToken"
        class="cursor-pointer hover:bg-cc-17 px-4 py-2 text-sm font-medium"
        @click="goToPath('/following')"
      >
        Following
      </div>
      <div
        v-if="authStore.idToken"
        class="cursor-pointer hover:bg-cc-17 px-4 py-2 text-sm font-medium"
        @click="goToPath('/trending')"
      >
        Trending
      </div>

      <!-- 未登入：Search Doses -->
      <div
        v-if="!authStore.idToken"
        class="cursor-pointer hover:bg-cc-17 px-4 py-2 text-sm font-medium"
        @click="goToPath('/search')"
      >
        Search Doses
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { onClickOutside } from "@vueuse/core";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/useAuthStore";
import SidebarToggleIcon from "@/components/icons/SidebarToggleIcon.vue";
import UserMenu from "@/components/UserMenu.vue";
import YourWorkIcon from "@/components/icons/YourWorkIcon.vue";
import PensIcon from "@/components/icons/PensIcon.vue";
import LogoIcon from "@/components/icons/LogoIcon.vue";
import Notify from "@/components/Notify.vue";
import Layout from "@/assets/layout.vue";

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

const isMenuOpen = ref(false);
const screenWidth = ref(window.innerWidth);
const isCompactScreen = computed(() => screenWidth.value <= 830);
const isVerySmallScreen = computed(() => screenWidth.value <= 634);
const dropdownRef = ref(null);

const tabs = ["Your Work", "Following", "Trending"];
const searchKeyword = ref("");
const searchFocused = ref(false);
const searchTab = ref("doses");

const activeTab = computed(() => {
  const path = route.path;
  if (path.startsWith("/your-work")) return "Your Work";
  if (path.startsWith("/following")) return "Following";
  if (path.startsWith("/trending")) return "Trending";
  return "";
});

const goToHome = () => {
  router.push("/");
};

const goToPath = (pathOrLocation) => {
  isMenuOpen.value = false;
  const path =
    typeof pathOrLocation === "string"
      ? pathOrLocation
      : pathOrLocation.path || "";
  router.push(pathOrLocation);
};

const handleSearchSubmit = () => {
  const trimmed = searchKeyword.value.trim().toLowerCase();
  if (trimmed) {
    router.push({
      path: "/search/doses",
      query: { q: trimmed },
    });
  }
};

const selectSearchTab = (tab) => {
  searchTab.value = tab;
  if (tab === "your-work") goToPath("/your-work");
  else if (tab === "doses")
    goToPath({ path: "/search/doses", query: { q: "" } });
};

const handleResize = () => {
  screenWidth.value = window.innerWidth;
};

const toggleDropdown = async () => {
  isMenuOpen.value = !isMenuOpen.value;
};

onClickOutside(dropdownRef, () => {
  isMenuOpen.value = false;
});

onMounted(() => {
  window.addEventListener("resize", handleResize);
});
onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});
</script>
