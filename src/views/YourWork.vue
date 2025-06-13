<template>
  <div class="bg-cc-17 text-cc-1 min-h-screen flex flex-col relative">
    <div class="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
      <!-- Tabs Header -->
      <div
        class="flex items-center space-x-6 text-sm font-semibold pt-4 pb-1 text-[16.5px]"
      >
        <button
          v-for="tab in tabs"
          :key="tab"
          @click="activeTab = tab"
          :class="[
            activeTab === tab
              ? 'text-cc-1 font-semibold'
              : 'text-cc-10 hover:text-cc-1',
          ]"
        >
          {{ tab }}
        </button>

        <!-- New Pen -->
        <div class="ml-auto">
          <button
            class="bg-cc-13 px-3 py-1 text-sm hover:bg-cc-12 rounded-md flex items-center space-x-2"
            @click="goPen"
          >
            <!-- 按下後應導去Pen頁面 -->
            <PensIcon class="fill-current w-4 h-4 text-cc-1" />
            <span>New Pen</span>
          </button>
        </div>
      </div>

      <!-- Search + Filter Bar -->
      <div>
        <div
          v-if="activeTab === 'Deleted'"
          class="border-t-2 border-danger mt-1 mb-4"
        ></div>

        <div
          v-else
          class="border-t-2 border-panel bg-panel px-3 py-2 flex flex-col space-y-3 lg:flex-row lg:justify-between lg:items-center lg:space-y-0 text-sm mb-4"
        >
          <!-- Left Controls -->
          <div class="flex items-stretch space-x-2 relative">
            <!-- Search -->
            <div class="flex rounded overflow-hidden">
              <input
                v-model="searchQuery"
                @keyup.enter="handleSearch"
                type="text"
                placeholder="Search for..."
                class="bg-input text-cc-1 text-sm px-3 py-1 placeholder-cc-9 focus:outline-none rounded-l"
              />
              <button
                @click="handleSearch"
                class="bg-button text-cc-1 text-sm px-4 py-1 border border-l-0 border-default bg-button-hover rounded-r"
              >
                Search
              </button>
            </div>

            <!-- Filters -->
            <div
              class="relative flex items-stretch"
              ref="filtersDropdownRef"
              @click.stop
            >
              <button
                @click="toggleFilters"
                class="flex items-center space-x-2 bg-button text-cc-1 text-sm px-3 py-1 bg-button-hover rounded"
              >
                <FiltersIcon class="fill-current w-4 h-4 text-cc-1" />
                <span>{{ filters.privacy !== 'all' ? filters.privacy : 'Filters' }}</span>
              </button>

              <div
                v-if="showFilters"
                ref="filtersRef"
                class="absolute top-full left-0 bg-cc-16 rounded shadow-md p-4 w-56 z-50"
              >
                <h3 class="text-sm font-semibold text-cc-1 mb-3">Filters</h3>
                <div class="mb-3">
                  <label class="block text-sm mb-1">Privacy</label>
                  <select
                    v-model="filters.privacy"
                    class="w-full px-2 py-1 bg-input text-cc-1 border border-default rounded"
                  >
                    <option value="all">All</option>
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Tags 按鈕-->
            <div
              v-if="activeTab === 'Pens'"
              ref="tagsDropdownRef"
              @click.stop
              :class="[
                ' relative flex items-stretch space-x-2 bg-button text-cc-1 text-sm px-3 bg-button-hover',
                showTags ? 'rounded-tl rounded-tr rounded-bl' : 'rounded',
              ]"
            >
              <!-- Toggle 開關 -->
              <button
                @click="showTags = !showTags"
                class="flex items-center space-x-2 text-cc-1"
              >
                <TagsIcon class="fill-current w-4 h-4" />
              </button>

              <!-- Tags 輸入與選單 -->
              <div class="relative flex items-center">
                <!-- 展開中顯示輸入框 + 下拉選單 -->
                <div v-if="showTags" class="relative h-full flex items-center">
                  <div class="flex items-center gap-2">
                    <input
                      v-model="tagInput"
                      type="text"
                      placeholder="Search tags..."
                      class="w-full text-sm text-cc-1 px-2 focus:outline-none"
                    />
                    <button
                      v-if="selectedTag"
                      @click="clearSelectedTag"
                      class="text-sm text-cc-9 hover:text-white"
                    >
                      ✕
                    </button>
                  </div>

                  <ul
                    class="absolute top-full left-0 max-h-48 overflow-auto bg-cc-14 rounded-b-md w-[calc(100%+12px)] z-50"
                  >
                    <li
                      v-for="tag in filteredTags"
                      :key="tag"
                      class="px-2 py-0.5 cursor-pointer bg-cc-17 hover:bg-cc-12"
                      @click="selectTag(tag)"
                    >
                      {{ tag }}
                    </li>
                  </ul>
                </div>

                <!-- 沒展開時顯示選到的 tag 或字樣 -->
                <div
                  v-else
                  class="flex items-center gap-2 cursor-pointer"
                  @click="openTagMenu"
                >
                  <span class="text-sm">
                    {{ selectedTag || "Tags" }}
                  </span>
                  <button
                    v-if="selectedTag"
                    @click.stop="clearSelectedTag"
                    class="text-sm text-cc-9 hover:text-white"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Controls -->
          <div class="flex items-stretch space-x-2">
            <!-- View Mode -->
            <div class="inline-flex rounded overflow-hidden">
              <button
                :class="[
                  'px-3 py-2',
                  viewMode === 'grid'
                    ? 'bg-grid-active'
                    : 'bg-button bg-list-hover',
                ]"
                @click="viewMode = 'grid'"
              >
                <GridIcon
                  class="fill-current w-4 h-4"
                  :class="{
                    'text-cc-1': viewMode === 'grid',
                    'text-cc-10': viewMode !== 'grid',
                  }"
                />
              </button>
              <button
                :class="[
                  'px-3 py-2 border-l border-default',
                  viewMode === 'table'
                    ? 'bg-grid-active'
                    : 'bg-button bg-list-hover',
                ]"
                @click="viewMode = 'table'"
              >
                <ListIcon
                  class="fill-current w-4 h-4"
                  :class="{
                    'text-cc-1': viewMode === 'table',
                    'text-cc-10': viewMode !== 'table',
                  }"
                />
              </button>
            </div>

            <!-- Sort Dropdown -->
            <select
              v-model="sortOption"
              class="bg-dropdown text-cc-1 px-3 py-1 border border-cc-1 rounded-md focus:outline-none"
            >
              <option class="text-cc-20" value="created">Date Created</option>
              <option class="text-cc-20" value="updated">Date Updated</option>
              <option class="text-cc-20" value="popular">Popularity</option>
            </select>

            <!-- Sort Direction -->
            <div
              class="inline-flex rounded-md overflow-hidden border border-default"
            >
              <button
                :class="[
                  'px-3 py-2',
                  sortDirection === 'desc'
                    ? 'bg-grid-active'
                    : 'bg-button bg-list-hover',
                ]"
                @click="sortDirection = 'desc'"
              >
                <DescIcon
                  class="fill-current w-4 h-4"
                  :class="{
                    'text-cc-1': sortDirection === 'desc',
                    'text-cc-10': sortDirection !== 'desc',
                  }"
                />
              </button>
              <button
                :class="[
                  'px-3 py-2 border-l border-default',
                  sortDirection === 'asc'
                    ? 'bg-grid-active'
                    : 'bg-button bg-list-hover',
                ]"
                @click="sortDirection = 'asc'"
              >
                <AscIcon
                  class="fill-current w-4 h-4"
                  :class="{
                    'text-cc-1': sortDirection === 'asc',
                    'text-cc-10': sortDirection !== 'asc',
                  }"
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="flex items-center justify-center mt-6">
        <div
          v-if="activeTab === 'Deleted'"
          class="flex flex-col lg:flex-row w-full gap-4"
        >
          <div class="flex-1 space-y-4">
            <!-- 有刪除作品時 -->
            <DeletedPenCard
              v-for="pen in pens"
              :key="pen.id"
              :pen="pen"
              @restore="restorePen(pen.id)"
              @delete="deletePen(pen.id)"
            />
            <div
              v-if="pens.length === 0"
              class="flex-1 bg-page text-cc-1 p-6 rounded-md"
            >
              <h2 class="text-lg font-semibold mb-4">
                You don't have any Deleted Items.
              </h2>
              <p class="text-sm leading-relaxed text-cc-9">
                If you want to save our world, you must hurry. We don't know how
                much longer we can withstand the nothing.
              </p>
              <p class="mt-3 italic text-cc-10 text-sm">
                — Southern Oracle, The Neverending Story
              </p>
            </div>
          </div>
          <!-- 沒有任何刪除作品時顯示 -->

          <div
            class="w-full lg:w-64 bg-page text-cc-1 p-6 rounded flex flex-col items-start"
          >
            <div class="flex items-center text-lg font-bold mb-2">
              <span class="mr-2">🕒 3 Days</span>
            </div>
            <p class="text-sm text-cc-9">
              You’ll be able to restore a Deleted Item for 3 days after you
              delete it. After that, it’s gone forever.
            </p>
          </div>
        </div>

        <div v-else class="w-full">
          <div v-if="pens.length > 0">
            <PenCardLayout :pens="pens" :mode="viewMode" />
            <PaginationNav
              :currentPage="page"
              :totalPages="Math.ceil(total / 10)"
              @prev="page--"
              @next="page++"
            />
          </div>
          <div
            v-else
            class="border border-dashed border-cc-13 px-10 py-10 text-center rounded-md"
          >
            <p class="text-lg font-semibold mb-4">{{ emptyStateMessage }}</p>
            <button
              @click="goPen"
              class="bg-cc-green text-cc-20 font-medium px-4 py-2 hover:bg-cc-green-dark rounded-md"
            >
              Go make one!
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  computed,
  onMounted,
  onBeforeUnmount,
  watch,
  nextTick,
} from "vue";
import { useRouter } from "vue-router";

import api from "@/config/api.js";
import PenCardLayout from "@/components/PenCardLayout.vue";
import DeletedPenCard from "@/components/DeletedPenCard.vue";
import PaginationNav from "@/components/PaginationNav.vue";

import PensIcon from "@/components/icons/PensIcon.vue";
import FiltersIcon from "@/components/icons/FiltersIcon.vue";
import TagsIcon from "@/components/icons/TagsIcon.vue";
import GridIcon from "@/components/icons/GridIcon.vue";
import ListIcon from "@/components/icons/ListIcon.vue";
import DescIcon from "@/components/icons/DescIcon.vue";
import AscIcon from "@/components/icons/AscIcon.vue";

const router = useRouter();

const pens = ref([]);
const total = ref(0);
const page = ref(1);
const hasNextPage = ref(false);

const searchQuery = ref("");

// Tabs
const tabs = ["Pens", "Deleted"];
const activeTab = ref("Pens");

// Filters
const showFilters = ref(false);
const filters = ref({
  privacy: "all",
});

// View/sort state
const sortOption = ref("created");
const sortDirection = ref("desc");
const viewMode = ref("grid");

// Tags
const tags = ref([]);
const showTags = ref(false);
const tagInput = ref("");
const selectedTag = ref("");

const tagsDropdownRef = ref(null);
const filtersDropdownRef = ref(null);

function handleClickOutside(event) {
  // Tags dropdown
  if (
    showTags.value &&
    tagsDropdownRef.value &&
    !tagsDropdownRef.value.contains(event.target)
  ) {
    showTags.value = false;
  }

  // Filters dropdown
  if (
    showFilters.value &&
    filtersDropdownRef.value &&
    !filtersDropdownRef.value.contains(event.target)
  ) {
    showFilters.value = false;
  }
}

function openTagMenu() {
  nextTick(() => {
    showTags.value = true;
  });
}

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});

const filteredTags = computed(() => {
  if (!tagInput.value.trim()) return tags.value;
  return tags.value.filter((tag) =>
    tag.toLowerCase().includes(tagInput.value.toLowerCase())
  );
});

function selectTag(tag) {
  selectedTag.value = tag;
  tagInput.value = tag;
  showTags.value = false;
  page.value = 1;
  loadPens();
}

function clearSelectedTag() {
  selectedTag.value = "";
  tagInput.value = "";
  page.value = 1;
  loadPens();
}

// Methods
function goPen() {
  router.push("/pen");
}

function toggleFilters() {
  showFilters.value = !showFilters.value;
}

// Empty state message
const emptyStateMessage = computed(() => {
  switch (activeTab.value) {
    case "Pens":
      return "No Pens.";
    default:
      return "Nothing here.";
  }
});

function handleSearch() {
  page.value = 1;
  showFilters.value = false;
  showTags.value = false;
  loadPens();
}

// 打API
async function loadPens() {
  try {
    const { data } = await api.get("/api/my/pens", {
      params: {
        q: searchQuery.value, // 搜尋關鍵字
        privacy: filters.value.privacy, // privacy: all/public/private
        tag: selectedTag.value, // 只傳一個 tag，選第一個
        sort: sortOption.value, // created / updated / popular
        order: sortDirection.value, // asc / desc
        view: viewMode.value, // grid / table
        page: page.value, // 第幾頁
      },
    });

    console.log("回傳資料：", data.results);
    pens.value = data.results;
    total.value = data.total;
    hasNextPage.value = data.hasNextPage;
  } catch (err) {
    console.error("載入作品失敗", err);
  }
}

// TODO: 取得垃圾桶Pens API
async function loadDeletedPens() {
  // 先以loadPens測試
  loadPens();
}
async function loadTags() {
  try {
    const { data } = await api.get("/api/my/tags");
    tags.value = data;
  } catch (err) {
    console.error("載入使用者 tags 失敗", err);
  }
}

onMounted(() => {
  loadTags();
  if (activeTab.value === "Pens") {
    loadPens();
  }

  if (activeTab.value === "Deleted") {
    loadDeletedPens();
  }
});

watch(
  [activeTab, filters, selectedTag, sortOption, sortDirection, viewMode],
  () => {
    page.value = 1;
    if (activeTab.value === "Pens") loadPens();
  },
  { deep: true }
);

watch(page, () => {
  if (activeTab.value === "Pens") loadPens();
});

watch(activeTab, () => {
  if (activeTab.value === "Deleted") {
    loadDeletedPens();
  } else {
    loadPens();
  }
});

async function deletePen(penId) {
  try {
    // 呼叫永久刪除 API
    // DELETE /api/pens/:id
    // await api.delete(`/api/pens/${penId}`);

    // 從 pens 列表移除這筆
    pens.value = pens.value.filter((pen) => pen.id !== penId);

    console.log("刪除成功", penId);
  } catch (err) {
    console.error("刪除失敗", err);
    // TODO: 加一個 toast 通知使用者
  }
}

async function restorePen(penId) {
  try {
    // 呼叫還原 API
    // await api.put(`/api/pens/${penId}/restore`);

    // 從目前 pens 中移除這筆，因為已經不是 deleted 狀態
    pens.value = pens.value.filter((pen) => pen.id !== penId);

    console.log("還原成功", penId);
  } catch (err) {
    console.error("還原失敗", err);
    // TODO: 可以加 toast 顯示錯誤訊息
  }
}

/**
 * deletePen()
 * 與
 * restorePen()
 * 還沒實作
 */

/**
 * createPen() 只是跳轉頁面，這個 function 要改名
 * tag 搜尋還沒實作
 * deleted 分頁還沒實作
 */
</script>
