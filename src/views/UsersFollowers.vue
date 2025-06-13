<template>
  <div class="content mt-6">
    <ul class="grid grid-cols-6 gap-5 mb-12">
      <li v-for="user in pagedUsers">
        <Usercard :username="user.username" :display-name="user.display_name" />
      </li>
    </ul>
  </div>
  <div>
    <PaginationNav
      :currentPage="page"
      :totalPages="totalPages"
      @prev="page--"
      @next="page++"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import Usercard from "@/components/UserCard.vue";
import api from "@/config/api";
import PaginationNav from "@/components/PaginationNav.vue";
const route = useRoute();

const users = ref([]);
const page = ref(1);
const pageSize = 30; //
const pagedUsers = computed(() =>
  users.value.slice((page.value - 1) * pageSize, page.value * pageSize)
);
const totalPages = computed(() => Math.ceil(users.value.length / pageSize));

const test = async () => {
  const res = await api.get(`/api/follows/followings/${route.params.username}`);
  console.log("這人追蹤了誰", res.data);
};
console.log(test());
const testv2 = async () => {
  const res = await api.get(`/api/follows/followers/${route.params.username}`);
  console.log("誰追蹤這人", res.data);
};
console.log(testv2());

onMounted(() => {
  users.value = [
    { id: 1, display_name: null, username: "alice", profile_image: "" },
    { id: 2, display_name: "Bob", username: "bob", profile_image: "" },
    { id: 2, display_name: "Bob", username: "bob", profile_image: "" },
    { id: 1, display_name: "Alice", username: "alice", profile_image: "" },
    { id: 2, display_name: "Bob", username: "bob", profile_image: "" },
    { id: 2, display_name: "Bob", username: "bob", profile_image: "" },
    { id: 1, display_name: "Alice", username: "alice", profile_image: "" },
    { id: 2, display_name: "Bob", username: "bob", profile_image: "" },
    { id: 2, display_name: "Bob", username: "bob", profile_image: "" },
    { id: 1, display_name: "Alice", username: "alice", profile_image: "" },
    { id: 2, display_name: "Bob", username: "bob", profile_image: "" },
    { id: 2, display_name: "Bob", username: "bob", profile_image: "" },
    { id: 1, display_name: "Alice", username: "alice", profile_image: "" },
    { id: 2, display_name: "Bob", username: "bob", profile_image: "" },
    { id: 2, display_name: "Bob", username: "bob", profile_image: "" },
    { id: 1, display_name: "Alice", username: "alice", profile_image: "" },
    { id: 2, display_name: "Bob", username: "bob", profile_image: "" },
    { id: 2, display_name: "Bob", username: "bob", profile_image: "" },
    { id: 1, display_name: "Alice", username: "alice", profile_image: "" },
    { id: 2, display_name: "Bob", username: "bob", profile_image: "" },
    { id: 2, display_name: "Bob", username: "bob", profile_image: "" },
    { id: 1, display_name: "Alice", username: "alice", profile_image: "" },
    { id: 2, display_name: "Bob", username: "bob", profile_image: "" },
    { id: 2, display_name: "Bob", username: "bob", profile_image: "" },
    { id: 1, display_name: "Alice", username: "alice", profile_image: "" },
    { id: 2, display_name: "Bob", username: "bob", profile_image: "" },
    { id: 2, display_name: "Bob", username: "bob", profile_image: "" },
    { id: 1, display_name: "Alice", username: "alice", profile_image: "" },
    { id: 2, display_name: "Bob", username: "bob", profile_image: "" },
    { id: 2, display_name: "Bob", username: "bob", profile_image: "" },
    { id: 1, display_name: "Alice", username: "alice", profile_image: "" },
    { id: 2, display_name: "Bob", username: "bob", profile_image: "" },
    { id: 2, display_name: "Bob", username: "bob", profile_image: "" },
    { id: 1, display_name: "Alice", username: "alice", profile_image: "" },
    { id: 2, display_name: "Bob", username: "bob", profile_image: "" },
    { id: 2, display_name: "Bob", username: "bob", profile_image: "" },
    { id: 1, display_name: "Alice", username: "alice", profile_image: "" },
    { id: 2, display_name: "Bob", username: "bob", profile_image: "" },
    { id: 2, display_name: "Bob", username: "bob", profile_image: "" },
    { id: 1, display_name: "Alice", username: "alice", profile_image: "" },
    { id: 2, display_name: "Bob", username: "bob", profile_image: "" },
    { id: 2, display_name: "Bob", username: "bob", profile_image: "" },
    { id: 1, display_name: "Alice", username: "alice", profile_image: "" },
    { id: 2, display_name: "Bob", username: "bob", profile_image: "" },
    { id: 2, display_name: "Bob", username: "bob", profile_image: "" },
    { id: 1, display_name: "Alice", username: "alice", profile_image: "" },
    { id: 2, display_name: "Bob", username: "bob", profile_image: "" },
    { id: 2, display_name: "Bob", username: "bob", profile_image: "" },
    { id: 1, display_name: "Alice", username: "alice", profile_image: "" },
    { id: 2, display_name: "Bob", username: "bob", profile_image: "" },
    { id: 2, display_name: "Bob", username: "bob", profile_image: "" },
    { id: 1, display_name: "Alice", username: "alice", profile_image: "" },
    { id: 2, display_name: "Bob", username: "bob", profile_image: "" },
    { id: 2, display_name: "Bob", username: "bob", profile_image: "" },
    { id: 1, display_name: "Alice", username: "alice", profile_image: "" },
    { id: 2, display_name: "Bob", username: "bob", profile_image: "" },
    { id: 2, display_name: "Bob", username: "bob", profile_image: "" },
    { id: 1, display_name: "Alice", username: "alice", profile_image: "" },
    { id: 2, display_name: "Bob", username: "bob", profile_image: "" },
    { id: 2, display_name: "Bob", username: "bob", profile_image: "" },
    { id: 1, display_name: "Alice", username: "alice", profile_image: "" },
    { id: 2, display_name: "Bob", username: "bob", profile_image: "" },
    { id: 2, display_name: "Bob", username: "bob", profile_image: "" },
    { id: 1, display_name: "Alice", username: "alice", profile_image: "" },
    { id: 2, display_name: "Bob", username: "bob", profile_image: "" },
    { id: 2, display_name: "Bob", username: "bob", profile_image: "" },
    { id: 1, display_name: "Alice", username: "alice", profile_image: "" },
    { id: 2, display_name: "Bob", username: "bob", profile_image: "" },
    { id: 2, display_name: "Bob", username: "bob", profile_image: "" },
    { id: 1, display_name: "Alice", username: "alice", profile_image: "" },
    { id: 2, display_name: "Bob", username: "bob", profile_image: "" },
    { id: 2, display_name: "Bob", username: "bob", profile_image: "" },
    { id: 1, display_name: "Alice", username: "alice", profile_image: "" },
    { id: 2, display_name: "Bob", username: "bob", profile_image: "" },
    { id: 2, display_name: "Bob", username: "bob", profile_image: "" },
    { id: 1, display_name: "Alice", username: "alice", profile_image: "" },
    { id: 2, display_name: "Bob", username: "bob", profile_image: "" },
    { id: 2, display_name: "Bob", username: "bob", profile_image: "" },
    { id: 1, display_name: "Alice", username: "alice", profile_image: "" },
    { id: 2, display_name: "Bob", username: "bob", profile_image: "" },
    { id: 2, display_name: "Bob", username: "bob", profile_image: "" },
    { id: 1, display_name: "Alice", username: "alice", profile_image: "" },
    { id: 2, display_name: "Bob", username: "bob", profile_image: "" },
    { id: 2, display_name: "last", username: "bob", profile_image: "" },
  ];
});
</script>
