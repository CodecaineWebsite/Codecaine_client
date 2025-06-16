<template>
  <header class="relative bg-cc-20 text-cc-1 w-full px-4 py-2 border-b-3 border-cc-14 flex items-center gap-4">
    <!-- Logo + SidebarToggleIcon：830px 以下顯示 -->
    <div class="flex items-center space-x-2 flex-shrink-0 hidden max-[830px]:flex">
      <img 
        src="https://blog.codepen.io/wp-content/uploads/2012/06/Button-Fill-White-Large.png" 
        class="w-8 h-8" 
        alt="logo" 
      />
      <button 
        @click="isMenuOpen = !isMenuOpen"
        class="w-10 h-10 flex items-center justify-center bg-cc-14 hover:bg-cc-13 rounded transition"
        title="Toggle Navigation"
      >
        <SidebarToggleIcon :expanded="isMenuOpen" />
      </button>
    </div>

    <!-- Tabs（634px 以上顯示） -->
    <div v-if="authStore.idToken && !isVerySmallScreen" class="flex items-center space-x-px flex-shrink-0">
      <button
        v-for="tab in tabs"
        :key="tab"
        @click="goToPath('/' + tab.toLowerCase().replace(' ', '-'))"
        class="relative h-9 px-4 text-sm bg-cc-14 hover:text-cc-1 focus:outline-none first:rounded-l last:rounded-r"
      >
        {{ tab }}
        <span class="absolute bottom-0 left-0 h-1 bg-cc-green transition-all duration-300" :class="activeTab === tab ? 'w-full' : 'w-0'"></span>
      </button>
    </div>

    <!-- 搜尋欄 + 浮出選單 -->
    <div class="relative h-9 mx-auto w-full max-w-[320px]">
      <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-cc-10"></i>
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

      <!-- 浮出選單 -->
      <div
        v-if="searchFocused"
        class="absolute left-0 mt-2 bg-cc-18 text-cc-1 rounded-md shadow-lg border border-cc-13 z-50 flex space-x-0.5 px-2 py-2"
      >
        <button
          v-if="authStore.idToken"
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
          <PensIcon class="fill-current w-3 mr-1" :class="searchTab === 'pens' ? 'text-cc-pens' : 'text-cc-1'" />
          Pens
        </button>
      </div>
    </div>

    <!-- 使用者選單 / 登入 -->
    <div class="flex items-center space-x-3 flex-shrink-0 ml-auto">
      <template v-if="!authStore.idToken">
        <button class="bg-green-500 text-cc-20 h-9 px-4 rounded hover:bg-green-400 font-semibold" @click="goToPath('/signup')">
          Sign Up
        </button>
        <button class="bg-cc-13 h-9 px-4 rounded hover:bg-cc-12 font-semibold" @click="goToPath('/login')">
          Log In
        </button>
      </template>
      <template v-else>
        <UserMenu />
      </template>
    </div>

    <!-- 下拉選單（830px 以下） -->
    <div
      v-if="isMenuOpen && authStore.idToken && isCompactScreen"
      class="absolute top-full left-2 mt-2 bg-[#1e1f26] text-white w-[220px] rounded-md shadow-xl border border-[#3c3f4a] z-50 py-2"
    >
      <div class="text-[10px] text-gray-400 px-4 mb-2">CREATE</div>
    <div 
      @click="goToPath('/pen')"
      class="cursor-pointer rounded-md overflow-hidden mb-2 mx-2">
      <div
      class="h-[2px] w-full bg-gradient-to-r from-[#4fcf70] via-[#fad648] via-[#a767e5] via-[#12bcfe] to-[#44ce7b]"
      ></div>
    <div
      class="bg-[#2c303a] hover:bg-[#1f2025] text-white text-sm px-4 py-3 font-medium"
    >
      ✏️ Caine
    </div>
      </div>
      <div class="mt-1.5 cursor-pointer hover:bg-[#131417] px-4 py-2 text-sm" @click="goToPath('/your-work')">Your Work</div>
      <div class="mt-1.5 cursor-pointer hover:bg-[#131417] px-4 py-2 text-sm" @click="goToPath('/following')">Following</div>
      <div class="mt-1.5 cursor-pointer hover:bg-[#131417] px-4 py-2 text-sm" @click="goToPath('/trending')">Trending</div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useAuthStore } from "@/stores/useAuthStore"
import UserMenu from "./UserMenu.vue"
import YourWorkIcon from "@/components/icons/YourWorkIcon.vue"
import PensIcon from "@/components/icons/PensIcon.vue"
import SidebarToggleIcon from "@/components/icons/SidebarToggleIcon.vue"

const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()

const isMenuOpen = ref(false)
const screenWidth = ref(window.innerWidth)
const isCompactScreen = computed(() => screenWidth.value <= 830)
const isVerySmallScreen = computed(() => screenWidth.value <= 634)

const tabs = ["Your Work", "Following", "Trending"]
const searchKeyword = ref("")
const searchFocused = ref(false)
const searchTab = ref("pens")

const activeTab = computed(() => {
  const path = route.path
  if (path.startsWith("/your-work")) return "Your Work"
  if (path.startsWith("/following")) return "Following"
  if (path.startsWith("/trending")) return "Trending"
  return ""
})

const goToPath = (pathOrLocation) => {
  isMenuOpen.value = false
  const path = typeof pathOrLocation === "string" ? pathOrLocation : pathOrLocation.path || ""
  router.push(pathOrLocation)
}

const handleSearchSubmit = () => {
  const trimmed = searchKeyword.value.trim().toLowerCase()
  if (trimmed) {
    router.push({
      path: "/search/pens",
      query: { q: trimmed },
    })
  }
}

const selectSearchTab = (tab) => {
  searchTab.value = tab
  if (tab === "your-work") goToPath("/your-work")
  else if (tab === "pens") goToPath({ path: "/search/pens", query: { q: "" } })
}

const handleResize = () => {
  screenWidth.value = window.innerWidth
}

onMounted(() => {
  window.addEventListener("resize", handleResize)
})
onUnmounted(() => {
  window.removeEventListener("resize", handleResize)
})
</script>
