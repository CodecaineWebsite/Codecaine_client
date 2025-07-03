<template>
  <div class="content mt-6">
    <ul
      v-if="!isLoaded"
      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-5 mb-12">
      <li
        v-for="n in pageSize"
        :key="'skeleton-' + n"
        class="bg-gray-700 h-[60px] rounded-md p-1 flex flex-row items-center gap-1 animate-pulse">
        <div class="w-12 h-12 overflow-hidden p-1 rounded-lg">
          <div class="w-full h-full bg-gray-600 rounded"></div>
        </div>
        <div class="flex flex-col justify-center gap-1 overflow-hidden">
          <div class="h-4 bg-gray-600 rounded w-[120px]"></div>
          <div class="h-3 bg-gray-600 rounded w-[80px]"></div>
        </div>
      </li>
    </ul>
    <ul
      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-5 mb-12"
      v-else-if="users.length">
      <li v-for="user in users">
        <Usercard
          :username="user.username"
          :display-name="user.display_name"
          :profile-image="user.profile_image" />
      </li>
    </ul>
        <div
      class="max-w-xl p-8 mb-5 mx-auto bg-cc-14 text-center rounded"
      v-else>
      <h1 class="mb-2 leading-[1.1] font-archivo text-4xl">
        You don't have any followers yet.
      </h1>
    </div>
  </div>
  <div>
    <PaginationNav
      :currentPage="page"
      :totalPages="totalPages"
      @prev="page--"
      @next="page++" />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import Usercard from "@/components/UserCard.vue";
import api from "@/config/api";
import PaginationNav from "@/components/PaginationNav.vue";

const route = useRoute();
const isLoaded = ref(false);
const users = ref([]);
const page = ref(1);
const pageSize = 24;
const totalPages = ref(1);

const fetchFollowers = async () => {
  isLoaded.value = false;
  try {
    const res = await api.get(
      `/api/follows/followers/${route.params.username}`,
      {
        params: { page: page.value },
      }
    );
    users.value = res.data.followers || [];
    totalPages.value = res.data.totalPages || 1;
  } catch (e) {
    users.value = [];
    totalPages.value = 1;
  } finally {
    isLoaded.value = true;
  }
};

watch(
  () => [route.params.username, page.value],
  () => {
    fetchFollowers();
  }
);

onMounted(() => {
  setTimeout(() => {
    fetchFollowers();
  }, 600);
});
</script>
