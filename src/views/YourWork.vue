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
            @click="createPen"
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
          class="border-t-2 border-panel bg-panel px-3 py-2 flex justify-between items-center text-sm mb-4"
        >
          <!-- Left Controls -->
          <div class="flex items-center space-x-2 relative">
            <!-- Search -->
            <div class="flex rounded-md overflow-hidden">
              <input
                type="text"
                placeholder="Search for..."
                class="bg-input text-cc-1 text-sm px-3 py-1 border border-default placeholder-cc-9 focus:outline-none rounded-l-md"
              />
              <button
                class="bg-button text-cc-1 text-sm px-4 py-1 border border-l-0 border-default bg-button-hover rounded-r-md"
              >
                Search
              </button>
            </div>

            <!-- Filters -->
            <div class="relative">
              <button
                @click="toggleFilters"
                class="flex items-center space-x-2 bg-button text-cc-1 text-sm px-3 py-1 border border-default bg-button-hover rounded-md"
              >
                <FiltersIcon class="fill-current w-4 h-4 text-cc-1" />
                <span>Filters</span>
              </button>

              <div
                v-if="showFilters"
                class="absolute top-full left-0 mt-2 bg-panel border border-cc-13 rounded-md shadow-lg p-4 w-56 z-50"
              >
                <h3 class="text-sm font-semibold text-cc-1 mb-3">Filters</h3>
                <div class="mb-3">
                  <label class="block text-sm mb-1">Privacy</label>
                  <select
                    v-model="filters.privacy"
                    class="w-full px-2 py-1 bg-input text-cc-1 border border-default rounded-md"
                  >
                    <option>All</option>
                    <option>Public</option>
                    <option>Private</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Tags 按鈕-->
            <div>
              <button
                @click="showTags = !showTags"
                v-if="activeTab === 'Pens'"
                class="flex items-center space-x-1 bg-button text-cc-1 text-sm px-3 py-1 border border-default bg-button-hover rounded-md"
              >
                <TagsIcon class="fill-current w-4 h-4 text-cc-1" />
                <span>Tags</span>
              </button>
              <div class="relative">
                <div
                  v-if="showTags"
                  class="absolute z-50 bg-panel border border-default rounded shadow p-4 mt-2 w-64"
                >
                  <h3 class="text-sm font-semibold mb-2">Select Tags</h3>
                  <ul class="space-y-2 max-h-48 overflow-auto">
                    <li
                      v-for="tag in allTags"
                      :key="tag"
                      class="flex justify-between items-center"
                    >
                      <label class="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          :value="tag"
                          :checked="selectedTags.includes(tag)"
                          @change="toggleTag(tag)"
                        />
                        <span>{{ tag }}</span>
                      </label>
                    </li>
                  </ul>

                  <button
                    @click="selectedTags = []"
                    class="text-xs text-cc-9 hover:underline mt-3"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Controls -->
          <div class="flex items-center space-x-2">
            <!-- View Mode -->
            <div
              class="inline-flex rounded-md overflow-hidden border border-default"
            >
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
                  viewMode === 'list'
                    ? 'bg-grid-active'
                    : 'bg-button bg-list-hover',
                ]"
                @click="viewMode = 'list'"
              >
                <ListIcon
                  class="fill-current w-4 h-4"
                  :class="{
                    'text-cc-1': viewMode === 'list',
                    'text-cc-10': viewMode !== 'list',
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
              <option class="text-cc-20" value="popularity">Popularity</option>
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
        <div v-if="activeTab === 'Deleted'" class="flex w-full gap-4">
          <div class="flex-1 bg-page text-cc-1 p-6 rounded-md">
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

          <div
            class="w-64 bg-page text-cc-1 p-6 rounded-md flex flex-col items-start"
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

        <!-- Empty State -->
        <div
          v-else
          class="border border-dashed border-cc-13 px-10 py-10 text-center rounded-md"
        >
          <p class="text-lg font-semibold mb-4">{{ emptyStateMessage }}</p>
          <button
            @click="createPen"
            class="bg-cc-green text-cc-20 font-medium px-4 py-2 hover:bg-cc-green-dark rounded-md"
          >
            Go make one!
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

import PensIcon from "@/components/icons/PensIcon.vue";
import FiltersIcon from "@/components/icons/FiltersIcon.vue";
import TagsIcon from "@/components/icons/TagsIcon.vue";
import GridIcon from "@/components/icons/GridIcon.vue";
import ListIcon from "@/components/icons/ListIcon.vue";
import DescIcon from "@/components/icons/DescIcon.vue";
import AscIcon from "@/components/icons/AscIcon.vue";

// Tabs
const tabs = ["Pens", "Deleted"];
const activeTab = ref("Pens");

// Filters
const showFilters = ref(false);
const filters = ref({
  privacy: "All",
});

// View/sort state
const sortOption = ref("created");
const sortDirection = ref("desc");
const viewMode = ref("grid");

// Tags
const showTags = ref(false);
const allTags = ref(["Vue", "JavaScript", "CSS", "Tailwind", "DarkMode"]); //假資料
const selectedTags = ref([]);

// Tag method
function toggleTag(tag) {
  if (selectedTags.value.includes(tag)) {
    selectedTags.value = selectedTags.value.filter((t) => t !== tag);
  } else {
    selectedTags.value.push(tag);
  }
}

// Methods
function createPen() {
  alert(`Create new item in "${activeTab.value}"`);
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
</script>
