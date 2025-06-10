<template>
  <div>
    <div class="text-gray-400 flex gap-4 bg-[#2C303A] p-4">
      <button
        class="cursor-pointer hover:text-white"
        @click="showcase"
        :class="
          route.path === '/' + route.params.username + '/caines/showcase'
            ? 'text-white'
            : ''
        ">
        Showcase
      </button>
      <button
        class="cursor-pointer hover:text-white"
        @click="publicProfile"
        :class="
          route.path === '/' + route.params.username + '/caines/public'
            ? 'text-white'
            : ''
        ">
        Public
      </button>
      <button
        class="cursor-pointer hover:text-white"
        @click="privateProfile"
        :class="
          route.path === '/' + route.params.username + '/caines/private'
            ? 'text-white'
            : ''
        ">
        Private
      </button>
      <button
        class="cursor-pointer hover:text-white"
        @click="loved"
        :class="
          route.path === '/' + route.params.username + '/caines/loved'
            ? 'text-white'
            : ''
        ">
        Loved
      </button>
    </div>
    <RouterView />
  </div>
</template>

<script setup>
import { RouterView } from "vue-router";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();
const showcase = () => {
  router.push(`/${route.params.username}/caines/showcase`);
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

<style scoped></style>
