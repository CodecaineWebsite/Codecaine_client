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

        <!-- New Dose button -->
        <div class="ml-auto">
          <button
            class="bg-cc-13 px-2 py-1 text-xs hover:bg-cc-12 rounded-xs flex items-center space-x-2"
            @click="goDose"
          >
            <PensIcon class="fill-current w-3 h-3 text-cc-1" />
            <span>New Dose</span>
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
          <div class="flex flex-wrap items-stretch gap-2 relative">
            <!-- Search -->
            <div class=" flex rounded overflow-hidden">
              <input
                v-model="searchQuery"
                @keyup.enter="handleSearch"
                type="text"
                placeholder="Search for..."
                class="min-w-0 bg-input text-cc-1 text-sm px-3 py-1 placeholder-cc-9 focus:outline-none rounded-l"
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
                <span>{{
                  filters.privacy !== "all" ? filters.privacy : "Filters"
                }}</span>
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
              v-if="activeTab === 'Doses'"
              ref="tagsDropdownRef"
              @click.stop
              :class="[
                ' relative flex items-stretch space-x-2 bg-button text-cc-1 text-sm px-3 py-1 bg-button-hover',
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
                    class="absolute top-[calc(100%+0.25rem)] left-0 max-h-48 overflow-auto bg-cc-14 rounded-b-md w-[calc(100%+12px)] z-50"
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
            <ViewModeChange />

            <!-- Sort Dropdown -->
            <select
              v-model="sortOption"
              class="bg-dropdown text-cc-4 px-3 py-1 rounded focus:outline-none"
            >
              <option class="text-cc-20" value="created">Date Created</option>
              <option class="text-cc-20" value="updated">Date Updated</option>
              <option class="text-cc-20" value="popular">Popularity</option>
            </select>

            <!-- Sort Direction -->
            <div
              class="inline-flex rounded overflow-hidden border border-default"
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
              @restore="restoreDose(pen.id)"
              @delete="deleteDose(pen.id)"
            />
            <!-- 沒有任何刪除作品時顯示 -->
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
            <PenCardLayout
              :pens="pens"
              :mode="viewMode"
              :filter="filters.privacy"
            />
            <PaginationNav
              :currentPage="page"
              :totalPages="totalPages"
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
              @click="goDose"
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
import ViewModeChange from "@/components/ViewModeChange.vue";
import PensIcon from "@/components/icons/PensIcon.vue";
import FiltersIcon from "@/components/icons/FiltersIcon.vue";
import TagsIcon from "@/components/icons/TagsIcon.vue";
import DescIcon from "@/components/icons/DescIcon.vue";
import AscIcon from "@/components/icons/AscIcon.vue";
import { useToastStore } from "@/stores/useToastStore";
import { useLocalStorage } from "@vueuse/core";

const toastStore = useToastStore();
const router = useRouter();
const { showToast } = toastStore;
// data
const pens = ref([]);
const tags = ref([]);
const total = ref(0);
const page = ref(1);
const totalPages = ref(1);
const hasNextPage = ref(false);

// Tabs
const tabs = ["Doses", "Deleted"];
const activeTab = ref("Doses");

// Search + Filters bar
const searchQuery = ref("");
const showFilters = ref(false);
const filters = ref({
  privacy: "all",
});
const viewMode = useLocalStorage("dosesViewMode", "grid");
const sortOption = ref("created");
const sortDirection = ref("desc");
const showTags = ref(false);
const tagInput = ref("");
const selectedTag = ref("");

// Dropdown refs
const tagsDropdownRef = ref(null);
const filtersDropdownRef = ref(null);

function handleClickOutside(event) {
  if (
    showTags.value &&
    tagsDropdownRef.value &&
    !tagsDropdownRef.value.contains(event.target)
  ) {
    showTags.value = false;
  }

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

const emptyStateMessage = computed(() => {
  switch (activeTab.value) {
    case "Doses":
      return "No Doses.";
    default:
      return "Nothing here.";
  }
});

function selectTag(tag) {
  selectedTag.value = tag;
  tagInput.value = tag;
  showTags.value = false;
  page.value = 1;
  loadDoses();
}

function clearSelectedTag() {
  selectedTag.value = "";
  tagInput.value = "";
  page.value = 1;
  loadDoses();
}

function goDose() {
  router.push("/dose");
}

function toggleFilters() {
  showFilters.value = !showFilters.value;
}

function handleSearch() {
  page.value = 1;
  showFilters.value = false;
  showTags.value = false;
  loadDoses();
}

async function loadDoses() {
  try {
    const { data } = await api.get("/api/my/pens", {
      params: {
        q: searchQuery.value,
        privacy: filters.value.privacy,
        tag: selectedTag.value,
        sort: sortOption.value,
        order: sortDirection.value,
        view: viewMode.value,
        page: page.value,
      },
    });

    pens.value = data.results;
    total.value = data.total;
    totalPages.value = data.totalPages;
    hasNextPage.value = data.hasNextPage;
  } catch (err) {
    showToast({
      message: "Failed to load pens. Please try again later.",
      variant: "danger",
    });
  }
}

async function loadDeletedDoses() {
  try {
    const { data } = await api.get("/api/pens/trash");

    pens.value = data;
  } catch (err) {
    showToast({
      message: "Failed to load deleted pens. Please try again later.",
      variant: "danger",
    });
  }
}
async function loadTags() {
  try {
    const { data } = await api.get("/api/my/tags");
    tags.value = data;
  } catch (err) {
    // 應該可以不加 toast，因為這個功能不是很重要
    console.error("Failed to load tags:", err);
  }
}

onMounted(() => {
  loadTags();
  if (activeTab.value === "Doses") {
    loadDoses();
  }
  if (activeTab.value === "Deleted") {
    loadDeletedDoses();
  }
});

watch(
  [activeTab, filters, selectedTag, sortOption, sortDirection, viewMode],
  () => {
    page.value = 1;
    if (activeTab.value === "Doses") loadDoses();
  },
  { deep: true }
);

watch(page, () => {
  if (activeTab.value === "Doses") loadDoses();
});

watch(activeTab, () => {
  pens.value = [];
  if (activeTab.value === "Deleted") {
    loadDeletedDoses();
  } else {
    loadDoses();
  }
});

async function deleteDose(penId) {
  try {
    await api.delete(`/api/pens/${penId}/`);
    pens.value = pens.value.filter((pen) => pen.id !== penId);
  } catch (err) {
    showToast({
      message: "Failed to delete. Please try again later.",
      variant: "danger",
    });
  }
}

async function restoreDose(penId) {
  try {
    await api.put(`/api/pens/${penId}/restore`);
    pens.value = pens.value.filter((pen) => pen.id !== penId);
  } catch (err) {
    showToast({
      message: "Failed to restore. Please try again later.",
      variant: "danger",
    });
  }
}

/**
 * TODO:
 * 頁面載入中狀態
 * 加上 toast 通知
 * 加上錯誤處理
 * 這頁太長了需要考慮拆分元件
 */
</script>
