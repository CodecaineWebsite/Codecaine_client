<template>
  <div class="space-y-6">
    <!-- 喜歡數 -->
    <div class="mb-4 clear-both">
      <h3 class="text-cc-7 text-base mb-2 flex items-center">
        <HeartIcon class="w-4 h-4 fill-current mr-1" />
        <span class="font-bold mr-1">{{ likes.length }}</span> Loves
      </h3>
      <div class="pl-6 font-bold flex flex-wrap items-center">
        <a
          v-for="(user, index) in visibleLikes"
          :key="user.id"
          :href="`/${user.username}`"
          class="relative w-[35px] h-[35px] inline-block mr-2 mb-2 group z-0"
        >
          <img
            :src="user.profile_image_url || '/default-avatar.png'"
            alt="user avatar"
            class="w-full h-full object-cover rounded"
          />
          <div
            class="absolute top-[75%] left-[-80px] right-[-80px] text-center
                   opacity-0 group-hover:opacity-100 group-hover:translate-y-1
                   transition pointer-events-none z-10"
          >
            <div
              class="inline-block bg-cc-20 text-white rounded px-2 py-1 text-xs max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap"
            >
              {{ user.display_name }}
              <svg viewBox="-137.8 144.15 30.2 27.5" xmlns="http://www.w3.org/2000/svg" class="inline-block ml-1 w-4 h-3 fill-current">
                <path d="M-108.3 159.8c.1-.1.1-.1.1-.2 0 0 0-.1.1-.1.3-.4.5-.9.5-1.5s-.2-1.1-.5-1.5v-.1l-.1-.1c0-.1-.1-.1-.1-.2l-11.2-11.2c-1-1-2.6-1-3.6 0s-1 2.6 0 3.6l6.9 6.9h-19.1c-1.4 0-2.5 1.1-2.5 2.5s1.1 2.5 2.5 2.5h19.1l-6.9 6.9c-1 1-1 2.6 0 3.6s2.6 1 3.6 0z"/>
              </svg>
            </div>
          </div>
        </a>
        <span
          v-if="likes.length > maxVisible"
          class="text-sm text-cc-7 ml-1 mt-1"
        >
          +{{ likes.length - maxVisible }} more
        </span>
      </div>
    </div>

    <!-- 瀏覽數 -->
    <div class="mb-4 clear-both">
      <h3 class="text-cc-7 text-base mb-2 flex items-center">
        <EyeIcon class="w-4 h-4 fill-current mr-1" />
        <span class="font-bold mr-1">{{ pen.favoritesCount }}</span> Views
      </h3>
    </div>
  </div>
</template>

<script setup>
import api from "@/config/api.js"
import { ref, computed, watch } from "vue";
import { useFavoritesStore } from "@/stores/useFavoritesStore";
import HeartIcon from "@/components/icons/HeartIcon.vue";
import EyeIcon from "@/components/icons/EyeIcon.vue";

const favoritesStore = useFavoritesStore();
const props = defineProps({
  pen: {
    type: Object,
    required: true
  },
  likes: {
    type: Array,
    default: () => [], // [{ id, username, display_name, profile_image_url }]
  },
});

const maxVisible = 6;
const likes = ref(props.likes)
const visibleLikes = computed(() => likes.value.slice(0, maxVisible));

async function fetchLikes() {
  try {
    const res = await api.get(`/api/pens/${props.pen.id}`);
    console.log(res.data.favorites);
    likes.value = res.data.favorites;
  } catch (err) {
    console.error("Failed to fetch likes", err);
  }
}


watch(
  () => favoritesStore.getFavorite(props.pen.id)?.isLiked,
  async (newVal, oldVal) => {
    console.log(newVal, oldVal);
    if (newVal !== oldVal) {
      await fetchLikes();
    }
  }
);

</script>