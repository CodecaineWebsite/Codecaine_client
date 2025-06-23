<script setup>
import axios from 'axios';
import { ref, watch } from 'vue';
import { debounce } from '@/utils/debounce'

const keyword = ref('');
const packages = ref([]);
const showSelectList = ref(false);
const emit = defineEmits(['select']);

// 當選擇套件
function selectPackage(p) {
  emit('select', p);
  showSelectList.value = false;
  keyword.value = '';

}

// 偵測輸入關鍵字變化（防抖）
const fetchPackages = debounce(async (value) => {
  if (!value) {
    showSelectList.value = false;
    packages.value = [];
    return;
  }

  try {
    const res = await axios.get(`https://api.cdnjs.com/libraries`, {
      params: {
        search: value,
        fields: 'filename,description,version,github',
        limit: 10
      }
    });
    packages.value = res.data.results;
    showSelectList.value = true;
  } catch (error) {
    console.error('Search failed：', error);
  }
} , 200);

// 監聽 keyword 輸入
watch(keyword, (value) => {
  fetchPackages(value);
});

// 點擊空白處關閉選單
function handleClickOutside(e) {
  if (!e.target.closest('.autocomplete')) {
    showSelectList.value = false;
  }
}

window.addEventListener('click', handleClickOutside);

// 組件卸載時清理事件
import { onUnmounted } from 'vue';
onUnmounted(() => {
  window.removeEventListener('click', handleClickOutside);
});
</script>
<template>
  <div class="w-full relative autocomplete">
    <input type="text" v-model="keyword" placeholder="Search CDNjs" class="appearance-none w-full border border-gray-300 rounded-sm px-4 py-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-500 mb-3">
    <ul
      v-if="showSelectList && packages.length"
      class="absolute bg-cc-14 shadow-md w-full z-10 max-h-64 overflow-y-auto"
    >
        <li v-for="p in packages" :key="p.name" class="px-5 py-2 -bottom-1 hover:bg-cc-16 cursor-pointer" @click="selectPackage(p)">
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
  </div>

</template>
