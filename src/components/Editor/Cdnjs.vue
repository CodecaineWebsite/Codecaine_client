<script setup>
import axios from 'axios';
import { ref, watch, nextTick, onUnmounted } from 'vue';
import { debounce } from '@/utils/debounce'

const keyword = ref('');
const packages = ref([]);
const showSelectList = ref(false);
const emit = defineEmits(['select']);
const selectedIndex = ref(-1); // 目前鍵盤選取的項目索引
const itemRefs = ref([]);
const isLoading = ref(false);
const cdnjsURL = "https://api.cdnjs.com/libraries"
// 當選擇套件
function selectPackage(p) {
  emit('select', p);
  reset();
}
function reset() {
  keyword.value = '';
  showSelectList.value = false;
  selectedIndex.value = -1;
  packages.value = [];
  itemRefs.value = [];
}
// 偵測輸入關鍵字變化（防抖）
const fetchPackages = debounce(async (value) => {
  if (!value.trim()) return reset();
  isLoading.value = true;
  try {
    const { data } = await axios.get(`${cdnjsURL}`, {
      params: {
        search: value,
        fields: 'filename,description,version',
        limit: 100
      }
    });
    const rawResults = data.results;
    const startsWith = rawResults.filter(pkg =>
      pkg.name.toLowerCase().startsWith(value.toLowerCase())
    );
    const includes = rawResults.filter(pkg =>
      pkg.name.toLowerCase().includes(value.toLowerCase()) &&
      !startsWith.includes(pkg)
    );
    packages.value = [...startsWith, ...includes].slice(0, 10); // 最多顯示前10筆
    showSelectList.value = true;
  } catch (error) {
    console.error('Search failed:', error);
    packages.value = [];
  } finally {
    isLoading.value = false;
  }
}, 200);
// 監聽 keyword 輸入
watch(keyword, (val) => {
  selectedIndex.value = -1;
  fetchPackages(val);
});

// 滾動至目前選取項目
watch(selectedIndex, async (newIdx) => {
  await nextTick(); // 等待 DOM 更新
  const el = itemRefs.value[newIdx];
  if (el?.scrollIntoView) {
    el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }
});

// 鍵盤控制選單
function handleKeydown(e) {
  if (!showSelectList.value || !packages.value.length) return;
  if (e.key === 'ArrowDown') {
    selectedIndex.value = (selectedIndex.value + 1) % packages.value.length;
    e.preventDefault();
  } else if (e.key === 'ArrowUp') {
    selectedIndex.value =
      (selectedIndex.value - 1 + packages.value.length) % packages.value.length;
    e.preventDefault();
  } else if (e.key === 'Enter' && selectedIndex.value >= 0) {
    selectPackage(packages.value[selectedIndex.value]);
    e.preventDefault();
  }
}

// 點擊外部關閉選單
function handleClickOutside(e) {
  if (!e.target.closest('.autocomplete')) {
    reset();
  }
}

// 組件卸載時清理事件
window.addEventListener('click', handleClickOutside);
onUnmounted(() => {
  window.removeEventListener('click', handleClickOutside);
});

</script>
<template>
  <div class="w-full relative autocomplete">
    <input 
    type="text" 
    v-model="keyword" 
    @keydown="handleKeydown"
    placeholder="Search CDNjs" 
    class="appearance-none w-full border border-gray-300 rounded-sm px-4 py-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-500 mb-3 placeholder:text-gray-500"
    >
    <ul
      v-if="showSelectList && packages.length"
      class="absolute bg-cc-14 shadow-md w-full z-10 max-h-64 overflow-y-auto"
    >
        <li 
          v-for="(p, index) in packages" 
          :key="p.name" 
          :ref="el => itemRefs[index] = el"
          @click="selectPackage(p)"
          :class="[
            'px-5 py-2 cursor-pointer',
            index === selectedIndex ? 'bg-cc-16' : 'hover:bg-cc-16'
          ]"
          >
          <div class="flex justify-between text-xl items-center pb-1">
            {{ p.name }}
            <span class="text-sm">
              {{ p.version }}
            </span>
          </div>
          <span class="text-xs line-clamp-3">
            {{ p.description }}
          </span>
        </li>
    </ul>
    <div
      v-else-if="showSelectList && keyword && !packages.length"
      class="absolute bg-cc-14 shadow-md w-full z-10 h-14 -bottom-13 px-2 py-4"
    >
      No matching packages found
    </div>
  </div>

</template>
