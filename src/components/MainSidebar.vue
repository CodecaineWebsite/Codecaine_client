<template>
  <div>
    <button
      @click="toggleSidebar"
      class="fixed top-4 flex items-center justify-center w-4 h-7 bg-[#5A5F73] text-amber-50 rounded-r cursor-pointer z-50 transition-all duration-400 hover:opacity-100 ease-in-out"
      :style="isSidebarOpen ? 'left: 160px;' : 'left: 0;'"
      :class="[
        isSidebarOpen
          ? isSidebarHover
            ? 'opacity-100'
            : 'opacity-0'
          : 'opacity-100',
      ]"
    >
      <span :class="{ 'rotate-180': isSidebarOpen }">➤</span>
    </button>
    <header
      class="relative top-0 left-0 h-full transition-all duration-400 sidebar text-amber-50 z-50 ease-in-out w-[160px]"
      :class="isSidebarOpen ? 'translate-x-0' : ' -translate-x-[100%] '"
      @mouseenter="isSidebarHover = true"
      @mouseleave="isSidebarHover = false"
    >
      <div class="absolute top-4 -right-4 z-10 h-full">
        <div
          @click="toggleSidebar"
          class="sidebar-dragger absolute w-3 right-[5px] -top-[15px] h-full opacity-25 -z-10 cursor-pointer text-zinc-950 animate-dragger-up"
          :class="{ hidden: isSidebarOpen }"
        ></div>
      </div>

      <div class="h-full overflow-y-auto overflow-x-hidden">
        <div>
          <div class="w-full h-12 px-3 flex items-center justify-center mt-4">
            <CodecaineIcon
              class="w-[150px] h-auto cursor-pointer"
              @click="goHome"
            />
          </div>
        </div>
        <nav v-if="authStore.idToken">
          <div class="flex flex-col py-3 px-4 text-lg text-cc-1">
            <h2
              class="cursor-pointer text-[9px] pb-3 relative create"
              @click="goYourWork"
            >
              CREATE
            </h2>
            <ul
              class="bg-cc-14 font-medium text-base text-left mb-1 block w-full transition duration-200 ease-in-out cursor-pointer rounded-b-md"
            >
              <li
                class="cursor-pointer btn p-3 px-4 flex items-center gap-3 group hover:bg-gray-100 transition-colors duration-300"
                @click="goDose"
              >
                <Layout
                  class="w-4 h-4 text-cc-10 group-hover:text-cc-blue transition-colors duration-300"
                />
                <div
                  class="text-cc-1 transition-colors duration-300 font-medium"
                >
                  Dose
                </div>
              </li>
            </ul>
          </div>
          <div class="mt-1.5">
            <div
              class="text-base font-medium p-3 px-4 cursor-pointer btn text-cc-1"
              @click="goYourWork"
            >
              Your Work
            </div>
          </div>
          <div class="mt-1.5">
            <div
              class="text-base font-medium p-3 px-4 cursor-pointer btn text-cc-1"
              @click="goFollowing"
            >
              Following
            </div>
            <div
              class="text-base font-medium p-3 px-4 cursor-pointer btn text-cc-1"
              @click="goTrending"
            >
              Trending
            </div>
          </div>
        </nav>
        <nav v-if="!authStore.idToken">
          <div class="flex flex-col py-3 px-4 text-cc-1">
            <h2 class="text-[9px] pb-2">Try Our Online Editor</h2>
            <ul
              class="bg-[#2c303a] font-medium text-left mb-1 block w-full transition duration-200 ease-in-out cursor-pointer rounded-b-md"
            >
              <li
                class="cursor-pointer bg-black start text-center"
                @click="goDose"
              >
                <span class="bg-black block px-3 py-3">Start Coding</span>
              </li>
            </ul>
          </div>
          <div class="mt-1.5">
            <div class="text-xl p-3 px-4 cursor-pointer btn" @click="goSearch">
              Search Doses
            </div>
          </div>
        </nav>
      </div>
    </header>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/useAuthStore";
import { useLocalStorage } from "@vueuse/core";
import CodecaineIcon from "@/components/icons/CodecaineIcon.vue";
import Layout from "@/assets/layout.vue";

const authStore = useAuthStore();
const router = useRouter();
const isSidebarHover = ref(false);

const isSidebarOpen = useLocalStorage("sidebarOpen", true);
const emit = defineEmits(["toggle"]);
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
  emit("toggle", isSidebarOpen.value);
};

const goYourWork = () => {
  router.push("/your-work");
};
const goFollowing = () => {
  router.push("/following");
};
const goTrending = () => {
  router.push("/trending");
};
const goDose = () => {
  router.push("/dose");
};
const goHome = () => {
  router.push("/");
};
const goSearch = () => {
  router.push("/search");
};
</script>

<style scoped>
.sidebar {
  background-color: #1e1f26;
}

.btn:hover {
  background-color: #131417;
}

.inner-sidebar:hover {
  animation: fadeOut 0.5s ease-in-out infinite;
}

h1 {
  background-image: url(../assets/codepain.png);
  background-size: contain;
}

.create:hover {
  background: linear-gradient(
    90deg,
    #6495ed,
    #f2c464,
    #c51077,
    #34c759,
    #6495ed,
    #f2c464,
    #c51077,
    #34c759,
    #6495ed
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: rainbow 4s linear infinite;
}

.create::after {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  content: "";
  height: 3px;
  border-radius: 5px 5px 0 0;
  z-index: 1;
  background-image: linear-gradient(
    90deg,
    #4567b7,
    #f7dc6f,
    #9c3f8f,
    #34c759,
    #4567b7,
    #f7dc6f,
    #9c3f8f,
    #34c759,
    #4567b7
  );
  background-size: 200% auto;
}
.create:hover::after {
  animation: rainbow 4s linear infinite;
}

.start {
  border: 2px solid transparent;
  border-top: 3px solid transparent;
  border-bottom: 3px solid transparent;
  border-radius: 6px;
  background: linear-gradient(
    115deg,
    #4fcf70,
    #fad648,
    #a767e5,
    #12bcfe,
    #44ce7b
  );
}
.start:hover {
  animation: rainbowLogout 2.5s linear infinite;
}

.sidebar-dragger {
  background: repeating-linear-gradient(
    45deg,
    hsl(226.15deg, 12.04%, 57.65%),
    hsl(226.15deg, 12.04%, 57.65%) 2px,
    hsl(228deg, 12.2%, 40.2%) 0,
    hsl(228deg, 12.2%, 40.2%) 4px
  );
  transition: opacity 0.7s ease-in-out;
}
.sidebar-dragger:hover {
  opacity: 0.5;
}

@keyframes fadeOut {
  0% {
    top: -15px;
  }
  100% {
    top: -30px;
  }
}

@keyframes rainbow {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 200px 0;
  }
}

@keyframes rainbowLogout {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: -200px 0;
  }
}

@keyframes dragger-up {
  0% {
    top: -15px;
  }
  100% {
    top: -40px;
  }
}
.animate-dragger-up {
  animation: dragger-up 1.2s linear infinite;
  position: absolute;
}
</style>
