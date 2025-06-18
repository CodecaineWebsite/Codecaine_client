<template>
  <section class="px-6 py-4 relative group">
    <!-- <h2 class="text-orange-500 font-bold mb-4">Trending</h2> -->

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
        <div class="grid grid-cols-2 gap-6">
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

    <!-- Prev Button -->
    <button
      class="swiper-prev absolute inset-y-0 left-0 z-[11] w-[90px] flex items-center justify-start group"
    >
      <div
        class="relative z-10 ml-3 w-[38px] h-[70px] rounded bg-[#2c2c2c] hover:bg-green-800 transition-colors flex items-center justify-center ring-0 group-hover:ring-2 group-hover:ring-white"
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
      class="swiper-next absolute inset-y-0 right-0 z-[11] w-[90px] flex items-center justify-end group"
    >
      <div
        class="relative z-10 mr-3 w-[38px] h-[70px] rounded bg-[#2c2c2c] hover:bg-green-800 transition-colors flex items-center justify-center ring-0 group-hover:ring-2 group-hover:ring-white"
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
    <!-- <p v-if="!hasMore && atLastPage" class="text-center text-gray-400 mt-8">
      That's all the trending works for now!
    </p> -->
  </section>
</template>

<script setup>
import { nextTick } from "vue";
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import api from "@/config/api";
import PenCard from "@/components/PenCards/PenCard.vue";

const swiperRef = ref(null);
const pages = ref([]);
const loadedPages = ref(new Set()); // 防止重複載入
const swiperInstance = ref(null);
const hasMore = ref(true);
const atLastPage = ref(false);

const openedDropdownId = ref(null);

const onSwiperInit = (swiper) => {
  swiperInstance.value = swiper;
  console.log("Swiper instance 初始化完成：", swiper);
};
// 載入特定頁數資料
const loadPage = async (pageNum) => {
  if (!hasMore.value || loadedPages.value.has(pageNum)) return;
  try {
    const res = await api.get(`/api/trending/pens?page=${pageNum}&limit=4`);
    const newCards = res.data.results || [];

    if (res.data.currentPage >= res.data.totalPages) {
      hasMore.value = false;
      console.log("🚧 已載入到最後一頁，不會再載入更多");
    }

    pages.value[pageNum - 1] = newCards;
    loadedPages.value.add(pageNum);
    console.log(`📦 已載入第 ${pageNum} 頁`, newCards);

    nextTick(() => {
      swiperRef.value?.swiper?.update();
    });
  } catch (err) {
    console.error(`❌ 無法取得第 ${pageNum} 頁資料`, err);
    hasMore.value = false; // 防止一直 retry
  }
};

// 當滑動頁面時觸發：自動載入下一頁
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

// 預載入前兩頁
onMounted(async () => {
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
