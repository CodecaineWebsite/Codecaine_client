<template>
  <section class="px-6 py-4 relative">
    <div class="relative group">
      <Swiper
        :modules="[Navigation]"
        :observer="true"
        :observe-parents="true"
        :slides-per-view="1"
        :space-between="30"
        :navigation="{ nextEl: '.swiper-next', prevEl: '.swiper-prev' }"
        class="w-full max-w-[1140px] mx-auto"
        @slideChange="handleSlideChange"
        @swiper="onSwiperInit"
        ref="swiperRef"
      >
        <SwiperSlide
          v-for="(group, index) in chunkedCards"
          :key="'group-' + index"
        >
          <div
            class="grid grid-cols-1 sm:grid-cols-2 max-w-[500px] sm:max-w-none gap-6 w-8/9 mx-auto"
          >
            <PenCard
              v-for="pen in group"
              :key="pen.id"
              :pen="pen"
              @delete="reloadTrending"
              @privacy-changed="reloadTrending"
            />
          </div>
        </SwiperSlide>
      </Swiper>

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
import { nextTick } from "vue";
import { ref, computed, onMounted } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation } from "swiper/modules";
import { useToastStore } from "@/stores/useToastStore";
import "swiper/css";
import "swiper/css/navigation";
import api from "@/config/api";
import PenCard from "@/components/PenCards/PenCard.vue";

const toastStore = useToastStore();
const { showToast } = toastStore;

const swiperRef = ref(null);
const pages = ref([]);
const loadedPages = ref(new Set()); // 防止重複載入
const swiperInstance = ref(null);
const hasMore = ref(true);
const atLastPage = ref(false);

const onSwiperInit = (swiper) => {
  swiperInstance.value = swiper;
};

const loadPage = async (pageNum) => {
  if (!hasMore.value || loadedPages.value.has(pageNum)) return;
  try {
    const res = await api.get(`/api/trending/pens?page=${pageNum}&limit=4`);
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
  if (!swiper || !hasMore.value) return;

  const currentIndex = swiper.activeIndex ?? 0;
  const totalLoaded = pages.value.length;

  atLastPage.value = currentIndex === totalLoaded - 1;

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
async function reloadTrending() {
  pages.value = [];
  loadedPages.value.clear();
  hasMore.value = true;
  atLastPage.value = false;
  await loadPage(1);
  await loadPage(2);
  nextTick(() => {
    swiperRef.value?.swiper?.slideTo(0);
    swiperRef.value?.swiper?.update();
  });
}
</script>
