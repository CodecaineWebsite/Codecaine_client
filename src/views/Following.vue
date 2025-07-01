<template>
  <section class="px-6 py-4 relative">
    <!-- Toggle Switch -->
    <div class="max-w-[1140px] mx-auto mb-6">
      <div
        class="bg-cc-16 px-[18.75px] pt-[9.375px] pb-[7.5px] w-full rounded flex items-center"
      >
        <span :class="[!isTop ? 'text-white' : 'text-gray-400', 'text-sm mr-2']"
          >Recent</span
        >
        <label class="relative inline-block w-[30px] h-4 align-middle">
          <input type="checkbox" v-model="isTop" class="sr-only peer" />
          <span
            class="absolute inset-0 bg-cc-13 rounded-full peer-checked:bg-cc-13 transition"
          ></span>
          <span
            class="absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform peer-checked:translate-x-[14px]"
          ></span>
        </label>
        <span :class="[isTop ? 'text-white' : 'text-gray-400', 'text-sm ml-2']"
          >Top</span
        >
      </div>
    </div>
    <p
      v-if="
        pages.length === 1 && Array.isArray(pages[0]) && pages[0].length === 0
      "
      class="text-center text-gray-400 mt-8 text-sm"
    >
      You're not following anyone yet.
    </p>
    <div class="relative group">
      <!-- 卡片輪播 Swiper -->
      <Swiper
        :modules="[Navigation]"
        :observer="true"
        :observe-parents="true"
        :slides-per-view="1"
        :space-between="30"
        :navigation="{ nextEl: '.swiper-next', prevEl: '.swiper-prev' }"
        @slideChange="handleSlideChange"
        @swiper="onSwiperInit"
        class="w-full max-w-[1140px] mx-auto"
      >
        <SwiperSlide
          v-for="(group, index) in chunkedCards"
          :key="'group-' + index"
        >
          <div
            class="grid grid-cols-1 sm:grid-cols-2 max-w-[500px] sm:max-w-none gap-6 w-8/9 mx-auto"
          >
            <PenCard v-for="pen in group" :key="pen.id" :pen="pen" />
          </div>
        </SwiperSlide>
      </Swiper>

      <!-- 左右箭頭 -->
      <button
        class="h-full swiper-prev hidden relative sm:flex sm:absolute inset-y-0 left-0 z-[11] items-center justify-start group/swiper-prev"
      >
        <div
          class="sm:w-[38px] sm:h-[70px] -ml-2 relative z-10 w-[70px] h-[38px] rounded bg-[#2c2c2c] hover:bg-green-800 transition-colors flex items-center justify-center ring-0 group-hover/swiper-prev:ring-2 group-hover/swiper-prev:ring-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M15 19l-7-7 7-7" />
          </svg>
        </div>
      </button>

      <button
        class="h-full swiper-next hidden relative sm:flex sm:absolute inset-y-0 right-0 z-[11] flex items-center justify-end group/swiper-next"
      >
        <div
          class="relative w-[70px] h-[38px] -mr-2 z-10 sm:w-[38px] sm:h-[70px] rounded bg-[#2c2c2c] hover:bg-green-800 transition-colors flex items-center justify-center ring-0 group-hover/swiper-next:ring-2 group-hover/swiper-next:ring-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </button>
      <div class="flex sm:hidden justify-center mt-4 gap-4">
        <!-- Prev Button -->
        <button
          class="swiper-prev inline-block relative sm:flex sm:absolute inset-y-0 left-0 z-[11] items-center justify-start group"
        >
          <div
            class="sm:w-[38px] sm:h-[70px] relative z-10 ml-3 w-[70px] h-[38px] rounded bg-[#2c2c2c] hover:bg-green-800 transition-colors flex items-center justify-center ring-0 group-hover:ring-2 group-hover:ring-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M15 19l-7-7 7-7" />
            </svg>
          </div>
        </button>

        <!-- Next Button -->
        <button
          class="swiper-next inline-block relative sm:flex sm:absolute inset-y-0 right-0 z-[11] flex items-center justify-end group"
        >
          <div
            class="relative w-[70px] h-[38px] z-10 mr-3 sm:w-[38px] sm:h-[70px] rounded bg-[#2c2c2c] hover:bg-green-800 transition-colors flex items-center justify-center ring-0 group-hover:ring-2 group-hover:ring-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import api from "../config/api.js";
import { useAuthStore } from "@/stores/useAuthStore";
const authStore = useAuthStore();
import {
  ref,
  computed,
  watch,
  onMounted,
  onBeforeUnmount,
  nextTick,
} from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation } from "swiper/modules";
import { useToastStore } from "@/stores/useToastStore";
import "swiper/css";
import "swiper/css/navigation";
import PenCard from "@/components/PenCards/PenCard.vue";

const toastStore = useToastStore();
const { showToast } = toastStore;
const isTop = ref(false);

const pages = ref([]);
const loadedPages = ref(new Set());
const hasMore = ref(true);
const currentSort = computed(() => (isTop.value ? "top" : "recent"));
const atLastPage = ref(false);
const swiperInstance = ref(null);
const swiperRef = ref(null);

const onSwiperInit = (swiper) => {
  swiperInstance.value = swiper;
};
const loadPage = async (pageNum) => {
  if (!hasMore.value || loadedPages.value.has(pageNum)) return;
  try {
    const res = await api.get(`/api/following/pens`, {
      params: {
        page: pageNum,
        limit: 4,
        sort: currentSort.value,
      },
      headers: {
        Authorization: `Bearer ${authStore.idToken}`,
      },
    });
    const newCards = res.data.results || [];
    if (res.data.currentPage >= res.data.totalPages) {
      hasMore.value = false;
    }
    pages.value[pageNum - 1] = newCards;
    loadedPages.value.add(pageNum);
    nextTick(() => {
      swiperRef.value?.swiper?.update();
    });
  } catch (err) {
    showToast({
      message: "System error. Please try again later",
      variant: "danger",
    });
    hasMore.value = false;
  }
};

const handleSlideChange = async () => {
  const swiper = swiperInstance.value;
  if (!swiper) return;

  const index = swiper.activeIndex;
  const totalLoaded = pages.value.length;

  atLastPage.value = index === totalLoaded - 1;

  if (atLastPage.value && hasMore.value) {
    const nextPage = totalLoaded + 1;
    await loadPage(nextPage);
  }
};

const chunkedCards = computed(() =>
  pages.value.filter((page) => Array.isArray(page))
);

onMounted(async () => {
  await loadPage(1);
  await loadPage(2);
});

watch(isTop, async () => {
  pages.value = [];
  loadedPages.value.clear();
  hasMore.value = true;
  await loadPage(1);
  await loadPage(2);
});
</script>
