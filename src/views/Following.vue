<<<<<<< HEAD
<<template>
  <section class="px-6 py-4 relative">
    <!-- Following 標題 -->
    <h2 class="text-blue-400 font-bold mb-4">Following</h2>
    <!-- Toggle 開關 -->
    <section class="following-toggle">
      <span>{{ isTop ? "Top" : "Recent" }}</span>
      <label>
        <input type="checkbox" v-model="isTop" />
        <span class="slider"></span>
      </label>
    </section>

    <!-- 上排卡片輪播 -->
    <Swiper
      :modules="[Navigation]"
      :slides-per-view="2"
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
      :slides-per-view="2"
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
      class="swiper-prev absolute top-1/2 left-2 -translate-y-1/2 z-20 w-[38px] h-[70px] rounded bg-[#2c2c2c] hover:bg-green-800 transition-colors flex items-center justify-center before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-r before:from-black/30 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white z-10" fill="currentColor" viewBox="0 0 24 24">
        <path d="M15 19l-7-7 7-7" />
      </svg>
    </button>

    <button
      class="swiper-next absolute top-1/2 right-2 -translate-y-1/2 z-20 w-[38px] h-[70px] rounded bg-[#2c2c2c] hover:bg-green-800 transition-colors flex items-center justify-center before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-l before:from-black/30 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white z-10" fill="currentColor" viewBox="0 0 24 24">
        <path d="M9 5l7 7-7 7" />
      </svg>
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
=======
<template>
	<div class="content">
		<h1>Followers</h1>
		<div>123</div>
		lorem
	</div>
	<!--內容一定要寫在div class="content"裡面!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! 不然會跑掉-->
>>>>>>> 6308fa5ae93bce10793eda41ba4e96b8edc2c014
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
