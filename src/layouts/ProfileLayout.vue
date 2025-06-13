<template>
  <div>
    <div class="pt-4" v-if="userInfo">
      <header class="profile-header">
        <div class="pt-[110px] pb-[75px]">
          <div class="text-center text-4xl pb-3">
            {{ userInfo.display_name }}
            <span
              v-if="userInfo.is_pro"
              class="bg-yellow-300 text-black text-xl font-bold px-1 py-[1px] rounded"
              >PRO</span
            >
          </div>
          <div class="text-center pb-2 text-gray-400">
            @{{ userInfo.username }}
          </div>
        </div>
      </header>
      <div
        class="min-h-14 bg-black relative flex items-center justify-between p-4"
      >
        <div class="flex gap-4 text-gray-400">
          <a
            class="hover:text-white"
            v-if="userInfo.profile_link1"
            :href="userInfo.profile_link1"
            target="_blank"
            >{{ userInfo.profile_link1.split("/")[2] }}</a
          ><a
            class="hover:text-white"
            v-if="userInfo.profile_link2"
            :href="userInfo.profile_link2"
            target="_blank"
            >{{ userInfo.profile_link2.split("/")[2] }}</a
          ><a
            class="hover:text-white"
            v-if="userInfo.profile_link3"
            :href="userInfo.profile_link3"
            target="_blank"
            >{{ userInfo.profile_link3.split("/")[2] }}</a
          >
        </div>
        <div
          class="absolute left-1/2 -translate-x-1/2 bottom-0 w-[124px] h-[124px]"
        >
          <img
            :src="userInfo.profile_image_url || '/default-avatar.png'"
            alt="大頭貼"
            class="bg-black h-full w-full border-gray-700 border-6"
          />
        </div>
        <div class="flex justify-center items-center gap-4 text-gray-400">
          <a
            :href="`/${route.params.username}/following`"
            class="hover:text-white"
            ><span class="text-white">{{ userFollowings }}</span> Following</a
          >
          <a
            :href="`/${route.params.username}/followers`"
            class="hover:text-white"
            ><span class="text-white">{{ userFollowers }}</span> Followers</a
          >
          <FollowBtn
            v-if="userInfo.username != authStore.userProfile.username"
            :current-user="authStore.userProfile.id"
            :target-user="userInfo.username"
          />
        </div>
      </div>
      <div class="text-center py-4">
        <div>{{ userInfo.location }}</div>
        <div class="mt-2">{{ userInfo.bio }}</div>
      </div>
      <div class="mx-auto max-w-7xl">
        <div class="text-gray-400 border-b-6">
          <button
            class="cursor-pointer hover:text-white p-2"
            @click="caines"
            :class="route.path.includes('caines') ? 'text-white' : ''"
          >
            Caines
          </button>
          <button
            class="cursor-pointer hover:text-white p-2"
            @click="Following"
            :class="route.name === 'Profilefollowing' ? 'text-white' : ''"
          >
            Following
          </button>
          <button
            class="cursor-pointer hover:text-white p-2"
            @click="Followers"
            :class="route.name === 'Profilefollowers' ? 'text-white' : ''"
          >
            Followers
          </button>
        </div>
        <div>
          <RouterView />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { RouterView } from "vue-router";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "../stores/useAuthStore";
import api from "@/config/api";
import FollowBtn from "../components/FollowBtn.vue";
const router = useRouter();
const route = useRoute();
const userInfo = ref(null);
const authStore = useAuthStore();
const userFollowers = ref(0);
const userFollowings = ref(0);
const caines = () => {
  router.push(`/${route.params.username}/caines`);
};
const Following = () => {
  router.push(`/${route.params.username}/following`);
};
const Followers = () => {
  router.push(`/${route.params.username}/followers`);
};

const countFollowers = async () => {
  try {
    const res = await api.get(
      `/api/follows/followers/${route.params.username}`
    );
    if (res) {
      const { data } = res;
      userFollowers.value = data.followers.length;
    }
  } catch (e) {
    return 0;
  }
};
const countFollowing = async () => {
  try {
    const res = await api.get(
      `/api/follows/followings/${route.params.username}`
    );
    if (res) {
      const { data } = res;
      userFollowings.value = data.followings.length;
    }
  } catch (e) {
    return 0;
  }
};

const fetchUserInfo = async () => {
  try {
    const res = await api.get(`/api/users/${route.params.username}`);
    if (res) {
      const {
        display_name,
        username,
        bio,
        is_pro,
        location,
        profile_image_url,
        profile_link1,
        profile_link2,
        profile_link3,
      } = res.data;
      userInfo.value = {
        display_name,
        username,
        bio,
        is_pro,
        location,
        profile_image_url,
        profile_link1,
        profile_link2,
        profile_link3,
      };
    }
  } catch (e) {
    userInfo.value = null;
  }
};

onMounted(() => {
  fetchUserInfo();
  countFollowers();
  countFollowing();
});

watch(
  () => route.params.username,
  () => {
    fetchUserInfo();
    countFollowers();
    countFollowing();
  }
);
</script>

<style scoped>
.profile-header {
  background-image: url(https://cpwebassets.codepen.io/assets/packs/profile-bg-optimized-a5ca8f46aca292507f629c62b09630ad.svg);
  background-size: cover;
}
</style>
