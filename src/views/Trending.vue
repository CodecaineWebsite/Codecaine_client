<template>
  <section class="px-6 py-4 relative group">
    <!-- Trending 標題 -->
    <h2 class="text-orange-500 font-bold mb-4">Trending</h2>

    <!-- 卡片輪播 Swiper -->
    <Swiper
      :modules="[Navigation]"
      :slides-per-view="1"
      :space-between="30"
      :navigation="{ nextEl: '.swiper-next', prevEl: '.swiper-prev' }"
      class="w-full max-w-[1140px] mx-auto"
    >
      <SwiperSlide v-for="(group, index) in chunkedCards" :key="'group-' + index">
        <div class="grid grid-cols-2 gap-6">
          <PenCard v-for="card in group" :key="card.id" :pen="card" />
        </div>
      </SwiperSlide>
    </Swiper>

    <!-- 左右箭頭 -->
    <button class="swiper-prev absolute inset-y-0 left-0 z-[11] w-[90px] flex items-center justify-start group">
      <div class="relative z-10 ml-3 w-[38px] h-[70px] rounded bg-[#2c2c2c] hover:bg-green-800 transition-colors flex items-center justify-center ring-0 group-hover:ring-2 group-hover:ring-white">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M15 19l-7-7 7-7" />
        </svg>
      </div>
      <span class="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></span>
    </button>

    <button class="swiper-next absolute inset-y-0 right-0 z-[11] w-[90px] flex items-center justify-end group">
      <div class="relative z-10 mr-3 w-[38px] h-[70px] rounded bg-[#2c2c2c] hover:bg-green-800 transition-colors flex items-center justify-center ring-0 group-hover:ring-2 group-hover:ring-white">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M9 5l7 7-7 7" />
        </svg>
      </div>
      <span class="absolute inset-0 bg-gradient-to-l from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></span>
    </button>

    <!-- 👥 Interesting People to Follow 區塊 -->
    <div class="mt-16 max-w-[1200px] mx-auto">
      <h3 class="text-blue-500 font-bold text-sm uppercase border-t border-gray-700 pt-6 mb-4 tracking-wide">
        Interesting People to Follow
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
import { ref, computed } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import PenCard from '@/components/penCard.vue'

const isTop = ref(false)

const topPenCards = ref(Array.from({ length: 12 }, (_, i) => ({
  id: `top-${i}`,
  author: `TopUser ${i}`,
  avatar: 'https://assets.codepen.io/1280209/internal/avatars/users/default.png',
  image: 'https://shots.codepen.io/1280209/pen/MWwzQyp-512.webp'
})))

const recentCards = ref(Array.from({ length: 12 }, (_, i) => ({
  id: `recent-${i}`,
  author: `RecentUser ${i}`,
  avatar: 'https://assets.codepen.io/1280209/internal/avatars/users/default.png',
  image: 'https://shots.codepen.io/1280209/pen/MWwzQyp-512.webp'
})))

const chunkedCards = computed(() => {
  const cards = isTop.value ? topPenCards.value : recentCards.value
  const result = []
  for (let i = 0; i < cards.length; i += 4) {
    result.push(cards.slice(i, i + 4))
  }
  return result
})

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