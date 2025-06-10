<script setup>
import api from "../config/api";
import { ref, computed, watch, watchEffect, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import YourWorkIcon from "@/components/icons/YourWorkIcon.vue";
import PensIcon from "@/components/icons/PensIcon.vue";
import LeftArrowIcon from "@/components/icons/LeftArrowIcon.vue";
import RightArrowIcon from "@/components/icons/RightArrowIcon.vue";
import PenCardLayout from "@/components/PenCardLayout.vue";
import PaginationNav from "@/components/PaginationNav.vue";

const route = useRoute();
const router = useRouter();

// 搜尋狀態管理
const searchKeyword = ref("");
const keyword = ref("");
const searchResults = ref([]);
const totalPages = ref(1);
const currentPage = ref(1);
const totalCount = ref(0);
const isLoading = ref(false);

const inputKeyword = ref("");
// 搜尋參數

const activeTab = computed(() => route.params.category || "pens");

const tabColors = {
  pens: "#0EBEFF",
  projects: "#FFDD40",
  collections: "#AE63E4",
};

// 初次載入時觸發搜尋
onMounted(() => {
  const q = route.query.q || "";
  searchKeyword.value = q;
});

// 監聽網址變化發送 API 請求
watch(
  () => [route.params.category, route.query.q, route.query.page],
  async ([categoryParam, qRaw, pageRaw]) => {
    const category = categoryParam || "pens";
    const q = qRaw?.toString() || "";
    const page = parseInt(pageRaw) || 1;
    const isPageRawInvalid = isNaN(parseInt(pageRaw, 10));

    inputKeyword.value = q;
    searchKeyword.value = q.toLowerCase();

    if (!searchKeyword.value.trim()) {
      searchResults.value = [];
      totalCount.value = 0;
      return;
    }

    isLoading.value = true;

    try {
      const res = await api.get(`/api/search/${category}`, {
        params: {
          q: searchKeyword.value,
          page,
        },
      });

      searchResults.value = res.data.results || [];
      totalPages.value = res.data.totalPages || 1;
      totalCount.value = res.data.total || 0;

      if (isPageRawInvalid || res.data.currentPage !== page) {
        router.replace({
          path: `/search/${category}`,
          query: {
            q,
            page: res.data.currentPage,
          },
        });
      }
    } catch (err) {
      console.error("搜尋失敗", err);
      searchResults.value = [];
      totalCount.value = 0;
    } finally {
      isLoading.value = false;
    }
  },
  { immediate: true }
);

const onSearchSubmit = () => {
  currentPage.value = 1;
  searchKeyword.value = inputKeyword.value.toLowerCase();

  router.push({
    path: `/search/${route.params.category || "pens"}`,
    query: { q: inputKeyword.value },
  });
};

// 有無搜尋結果
const isContent = computed(() => searchResults.value.length > 0);

const isEmptySearchResult = computed(() => {
  return searchKeyword.value.trim() !== "" && searchResults.value.length === 0;
});

// 換頁方法
function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    updateRouteQuery();
  }
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
    updateRouteQuery();
  }
}

function updateRouteQuery() {
  router.push({
    path: `/search/${route.params.category || "pens"}`,
    query: {
      q: searchKeyword.value,
      page: currentPage.value,
    },
  });
}
</script>
<template>
  <main class="bg-cc-17">
    <div class="w-full max-w-[75rem] mx-auto px-8 pt-6 relative text-cc-1">
      <div class="px-3 pb-6">
        <div class="mb-6">
          <div
            class="flex flex-wrap items-stretch justify-between ps-2 pt-2.5 border-t-4 bg-cc-16 border-t-cc-pens"
            :style="{
              borderTopColor: tabColors[activeTab],
            }"
          >
            <div class="w-[300px] h-full mb-2">
              <form
                action=""
                class="bg-cc-13 focus-within:bg-cc-gray-mid rounded-md"
                @submit.prevent="onSearchSubmit"
              >
                <label for="#" class="relative group">
                  <i
                    class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-gray-200"
                  ></i>
                  <input
                    v-model="inputKeyword"
                    class="w-full h-full pl-10 pr-4 py-2 placeholder-gray-400 focus:outline-none group-focus-within:placeholder-gray-200"
                    autocomplete="off"
                    placeholder="Search Codecaine..."
                    type="text"
                    name="q"
                    value
                  />
                </label>
              </form>
            </div>

            <div class="flex space-x-2 pe-2 mb-2">
              <!-- 靜態按鈕 -->
              <a
                href="/your-work"
                class="px-3 py-1 h-full rounded bg-cc-gray-mid text-white text-sm hover:bg-cc-gray-mid transition transform active:translate-y-0.5 flex items-center"
              >
                <YourWorkIcon class="fill-current w-3 mr-1.5" />
                Your Work
              </a>
              <a
                href="/search/pens?q="
                class="px-3 py-1 rounded bg-cc-gray-mid text-white text-sm hover:bg-cc-gray-mid transition transform active:translate-y-0.5 flex items-center"
              >
                <PensIcon
                  class="fill-current w-3 mr-1.5"
                  :class="{ 'text-[#0EBEFF]': activeTab === 'pens' }"
                />
                Pens
              </a>
            </div>
          </div>
        </div>

        <div class="SearchPage_content">
          <!-- 搜尋結果 -->
          <div
            v-if="searchResults.length > 0"
            class="SearchPage_result_container"
          >
            <PenCardLayout :pens="searchResults" :mode="grid" />
            <!-- 翻頁按鈕 -->
            <PaginationNav
              :currentPage="currentPage"
              :totalPages="totalPages"
              @prev="prevPage"
              @next="nextPage"
            />
          </div>
          <!-- 搜尋前提示 -->
          <div
            v-else-if="searchKeyword === ''"
            class="max-w-xl p-8 mb-5 mx-auto bg-cc-14 text-center rounded"
          >
            <h1 class="mb-2 leading-[1.1] font-archivo text-4xl">Search</h1>
            <p>
              Enter a search term above to find for Codecaines or Collections.
            </p>
          </div>
          <!-- 搜尋結果為空的提示 -->
          <div
            v-else-if="isEmptySearchResult"
            class="max-w-xl p-8 mb-5 mx-auto bg-cc-14 text-center rounded"
          >
            <h1 class="mb-2 leading-[1.1] font-archivo text-4xl">No Results</h1>
            <p>
              Sorry, we couldn’t find any results matching “{{
                searchKeyword
              }}”.
            </p>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
<style scoped></style>

<!-- TODO: 準備載入中畫面 -->

<!-- TODO: 把切換 tab 的方式與顯示結果頁面的方式改成 RouterLink 跟 RouterView -->

<!-- TODO: 導入作品卡 -->
