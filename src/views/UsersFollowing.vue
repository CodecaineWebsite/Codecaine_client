<template>
  <div class="content mt-6">
    <ul
      v-if="!isLoaded"
      class="grid grid-cols-6 gap-5 mb-12">
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
      class="grid grid-cols-6 gap-5 mb-12"
      v-else-if="users.length">
      <li
        v-for="user in pagedUsers"
        :key="user.id">
        <Usercard
          :username="user.username"
          :display-name="user.display_name"
          :profile-image="user.profile_image" />
      </li>
    </ul>
    <div
      class="content justify-center flex mt-6"
      v-else>
      <div class="text-4xl bg-gray-800 p-12 rounded-lg">
        <p>You haven't followed anyone yet.</p>
      </div>
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
import { ref, onMounted, computed, watch } from "vue";
import { useRoute } from "vue-router";
import Usercard from "@/components/UserCard.vue";
import api from "@/config/api";
import PaginationNav from "@/components/PaginationNav.vue";
const route = useRoute();
const isLoaded = ref(false);
const users = ref([]);
const page = ref(1);
const pageSize = 30;
const pagedUsers = computed(() =>
  users.value.slice((page.value - 1) * pageSize, page.value * pageSize)
);
const totalPages = computed(() => Math.ceil(users.value.length / pageSize));

const fetchFollowings = async () => {
  isLoaded.value = false;
  try {
    const res = await api.get(
      `/api/follows/followings/${route.params.username}`
    );
    users.value = res.data.followings || [];
  } catch (e) {
    users.value = [];
  } finally {
    isLoaded.value = true;
  }
};

onMounted(() => {
  fetchFollowings();
});

watch(
  () => route.params.username,
  () => {
    fetchFollowings();
  }
);
</script>
