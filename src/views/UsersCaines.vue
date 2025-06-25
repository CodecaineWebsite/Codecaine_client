<template>
  <div>
    <div class="text-gray-400 flex gap-4 bg-[#2C303A] p-4">
      <button
        class="cursor-pointer hover:text-white"
        @click="showcase"
        :class="route.name === 'dosesShowcase' ? 'text-white' : ''"
      >
        Showcase
      </button>
      <button
        class="cursor-pointer hover:text-white"
        @click="publicProfile"
        :class="route.name === 'cainesPublic' ? 'text-white' : ''"
      >
        {{
          authStore.userProfile &&
          route.params.username === authStore.userProfile.username
            ? "Public"
            : "All Caines"
        }}
      </button>
      <button
        v-if="
          authStore.userProfile &&
          route.params.username === authStore.userProfile.username
        "
        class="cursor-pointer hover:text-white"
        @click="privateProfile"
        :class="route.name === 'cainesPrivate' ? 'text-white' : ''"
      >
        Private
      </button>
      <button
        class="cursor-pointer hover:text-white"
        @click="loved"
        :class="route.name === 'cainesLoved' ? 'text-white' : ''"
      >
        Loved
      </button>
    </div>
    <RouterView />
  </div>
</template>

<script setup>
import { RouterView } from "vue-router";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "@/stores/useAuthStore";

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const showcase = () => {
  router.push(`/${route.params.username}/doses/showcase`);
};
const publicProfile = () => {
  router.push(`/${route.params.username}/caines/public`);
};
const loved = () => {
  router.push(`/${route.params.username}/caines/loved`);
};
const privateProfile = () => {
  router.push(`/${route.params.username}/caines/private`);
};
</script>
