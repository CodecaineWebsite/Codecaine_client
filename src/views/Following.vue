<template>
  <section class="px-6 py-4 relative">
    <!-- Following 標題 -->
    <h2 class="text-blue-400 font-bold mb-4">Following</h2>

  <!-- 外層容器：整個頁面內容最大寬度 + 置中 -->
<div class="max-w-[1140px] mx-auto">
  <!-- Toggle 區塊貼齊左邊 -->
  <div
    class="bg-[#1E1F26] px-[18.75px] pt-[9.375px] pb-[7.5px] w-full rounded flex items-center"
  >
    <span :class="!isTop ? 'text-white' : 'text-gray-400'" class="text-sm mr-2">Recent</span>

    <label class="relative inline-block w-[30px] h-[16px] align-middle">
      <input type="checkbox" v-model="isTop" class="sr-only peer" />
      <span class="absolute inset-0 bg-[#3d3f42] rounded-full peer-checked:bg-[#3d3f42] transition"></span>
      <span class="absolute top-[2px] left-[2px] w-[12px] h-[12px] bg-white rounded-full transition-transform peer-checked:translate-x-[14px]"></span>
    </label>

    <span :class="isTop ? 'text-white' : 'text-gray-400'" class="text-sm ml-2">Top</span>
  </div>

  <!-- 下面卡片區域、其他內容 -->
  ...
</div>
    <!-- 上排卡片輪播 -->
    <Swiper
      :modules="[Navigation]"
      :slides-per-view="3"
      :slides-per-group="2"
      :space-between="30"
      :navigation="{ nextEl: '.swiper-next', prevEl: '.swiper-prev' }"
      class="w-full"
    >
      <SwiperSlide v-for="i in 12" :key="'row1-' + i">
        <PenCard />
      </SwiperSlide>
    </Swiper>

    <!-- 下排卡片輪播 -->
    <Swiper
      :modules="[Navigation]"
      :slides-per-view="3"
      :slides-per-group="2"
      :space-between="30"
      :navigation="{ nextEl: '.swiper-next', prevEl: '.swiper-prev' }"
      class="w-full mt-6"
    >
      <SwiperSlide v-for="i in 12" :key="'row2-' + i">
        <PenCard />
      </SwiperSlide>
    </Swiper>

      <!-- 共用左右箭頭 -->
      <button
  class="swiper-prev absolute inset-y-0 left-0 z-[11] w-[90px] flex items-center justify-start group"
>
  <!-- 箭頭按鈕 -->
   <div
    class="relative z-10 ml-3 w-[38px] h-[70px] rounded bg-[#2c2c2c] hover:bg-green-800 
           transition-colors flex items-center justify-center 
           ring-0 group-hover:ring-2 group-hover:ring-white"
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
      <path d="M15 19l-7-7 7-7" />
    </svg>
  </div>

  <!-- 遮罩 -->
  <span
    class="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
  ></span>
</button>


<button
  class="swiper-next absolute inset-y-0 right-0 z-[11] w-[90px] flex items-center justify-end group"
>
  <!-- 箭頭按鈕 -->
   <div
    class="relative z-10 ml-3 w-[38px] h-[70px] rounded bg-[#2c2c2c] hover:bg-green-800 
           transition-colors flex items-center justify-center 
           ring-0 group-hover:ring-2 group-hover:ring-white"
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
      <path d="M9 5l7 7-7 7" />
    </svg>
  </div>

  <!-- 遮罩 -->
  <span
    class="absolute inset-0 bg-gradient-to-l from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
  ></span>
</button>

    <!-- 👥 Interesting People to Follow 區塊 -->
    <div class="mt-16 max-w-[1200px] mx-auto">
      <h3 class="text-white font-bold text-sm uppercase border-t border-gray-700 pt-6 mb-4 tracking-wide">
        People You May Like
      </h3>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          v-for="person in people"
          :key="person.name"
          class="bg-[#1e1f26] rounded overflow-hidden"
        >
          <div class="flex items-center justify-between px-4 pt-4">
            <div class="flex items-center">
              <img :src="person.avatar" class="w-8 h-8 rounded-full mr-2" />
              <div>
                <p class="text-white text-sm font-bold flex items-center gap-1">
                  {{ person.name }}
                  <span class="bg-yellow-400 text-black text-[10px] font-bold px-1 rounded">PRO</span>
                </p>
                <p class="text-xs text-gray-400">{{ person.pens }} Pens</p>
              </div>
            </div>
            <button class="text-green-500 text-xs font-bold hover:underline">+ Follow</button>
          </div>
          <div class="grid grid-cols-2 gap-2 p-4">
            <img
              v-for="(thumb, idx) in person.thumbnails"
              :key="idx"
              :src="thumb"
              class="rounded w-full aspect-[4/3] object-cover bg-[#111]"
              alt="pen"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
  </template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import PenCard from '@/components/PenCard.vue'

// Follow 資料清單
const people = [
  {
    name: 'Natalia Davydova',
    pens: 210,
    avatar: 'https://assets.codepen.io/1280209/internal/avatars/users/default.png?fit=crop&format=auto&height=40&version=1682323234&width=40',
    thumbnails: [
      'https://shots.codepen.io/1280209/pen/MWwzQyp-512.webp?version=1682323234',
      'https://shots.codepen.io/1280209/pen/MWwzQyp-512.webp?version=1682323234',
    ],
  },
  {
    name: 'Miriam Suzanne',
    pens: 661,
    avatar: 'https://assets.codepen.io/3/internal/avatars/users/default.png?fit=crop&format=auto&height=40&version=1682323234&width=40',
    thumbnails: [
      'https://shots.codepen.io/3/pen/MWwzQyp-512.webp?version=1682323234',
      'https://shots.codepen.io/3/pen/MWwzQyp-512.webp?version=1682323234',
    ],
  },
  {
    name: 'Will Boyd',
    pens: 539,
    avatar: 'https://assets.codepen.io/200/internal/avatars/users/default.png?fit=crop&format=auto&height=40&version=1682323234&width=40',
    thumbnails: [
      'https://shots.codepen.io/200/pen/MWwzQyp-512.webp?version=1682323234',
      'https://shots.codepen.io/200/pen/MWwzQyp-512.webp?version=1682323234',
    ],
  },
]
</script>
