<template>
  <section class="px-6 py-4 relative group">
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
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <PenCard
            v-for="pen in group"
            :key="pen.id"
            :pen="pen"
            :is-open="openedDropdownId === pen.id"
            @delete="handleDeletePen"
            @privacy-changed="handlePrivacyChanged"
            @toggle="toggleDropdown"
          />
        </div>
      </SwiperSlide>
    </Swiper>

    <!-- 左右箭頭 -->
    <button
      class="swiper-prev absolute inset-y-0 left-0 z-[11] w-[90px] flex items-center justify-start group"
    >
      <div
        class="relative z-10 ml-3 w-[38px] h-[70px] rounded bg-cc-14 hover:bg-cc-green-dark transition-colors flex items-center justify-center ring-0 group-hover:ring-2 group-hover:ring-white"
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
      <span
        class="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
      ></span>
    </button>

    <button
      class="swiper-next absolute inset-y-0 right-0 z-[11] w-[90px] flex items-center justify-end group"
    >
      <div
        class="relative z-10 mr-3 w-[38px] h-[70px] rounded bg-cc-14 hover:bg-cc-green-dark transition-colors flex items-center justify-center ring-0 group-hover:ring-2 group-hover:ring-white"
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
      <span
        class="absolute inset-0 bg-gradient-to-l from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
      ></span>
    </button>
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
import "swiper/css";
import "swiper/css/navigation";
import PenCard from "@/components/PenCards/PenCard.vue";

const isTop = ref(false);

const pages = ref([]);
const loadedPages = ref(new Set());
const hasMore = ref(true);
const currentSort = computed(() => (isTop.value ? "top" : "recent"));
const atLastPage = ref(false);
const swiperInstance = ref(null);
const swiperRef = ref(null);

const openedDropdownId = ref(null);

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
      console.log("Loaded the last page.");
    }
    pages.value[pageNum - 1] = newCards;
    loadedPages.value.add(pageNum);
    console.log(`Loaded page ${pageNum}`, newCards);
    nextTick(() => {
      swiperRef.value?.swiper?.update();
    });
  } catch (err) {
    console.error(`Failed to retrieve data for page ${pageNum}`, err);
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

function handleDeletePen(deletedId) {
  const index = props.pens.findIndex((pen) => pen.id === deletedId);
  if (index !== -1) {
    props.pens.splice(index, 1);
  }
}

function handleClickOutside(event) {
  // 點擊不是按鈕或選單內容時，關閉 dropdown
  if (
    !event.target.closest(".dropdown-toggle") &&
    !event.target.closest(".dropdown-menu")
  ) {
    openedDropdownId.value = null;
  }
}

function handlePrivacyChanged({ id, is_private }) {
  console.log("handlePrivacyChanged", id, is_private);
  if (props.filter === "private" && !is_private) {
    const index = props.pens.findIndex((pen) => pen.id === id);
    if (index !== -1) {
      props.pens.splice(index, 1);
    }
  }
  if (props.filter === "public" && is_private) {
    const index = props.pens.findIndex((pen) => pen.id === id);
    if (index !== -1) {
      props.pens.splice(index, 1);
    }
  }
}

function toggleDropdown(id) {
  if (openedDropdownId.value === id) {
    // 如果點的是已經開啟的那一筆，就關掉
    openedDropdownId.value = null;
  } else {
    // 否則就打開這一筆
    openedDropdownId.value = id;
  }
}

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});
onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>
