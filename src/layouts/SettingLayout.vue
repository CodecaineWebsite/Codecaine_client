<template>
  <div
    class="content flex flex-col md:flex-row mt-3 border-t-3 border-t-[#2C303A]"
  >
    <div
      class="bg-[#131417] text-white pt-2 md:pt-4 w-full md:w-[180px] border-b-3 md:border-b-0 md:border-r-3 border-[#2C303A] md:h-full"
    >
      <h2 class="text-xl font-bold mb-3 px-3 hidden md:block">Settings</h2>
      <nav>
        <ul class="flex flex-row md:flex-col text-gray-400 text-lg">
          <li
            class="flex-1 md:flex-none cursor-pointer p-1 px-2 md:pl-5 transition-all hover:bg-[#2C303A] hover:border-l-4 hover:border-[#05DF72] hover:text-white"
            :class="
              route.path === '/settings/profile'
                ? 'bg-[#2C303A] md:border-l-4 border-[#05DF72] text-white'
                : ''
            "
            @click="profile"
          >
            Profile
          </li>
          <li
            class="flex-1 md:flex-none cursor-pointer p-1 px-2 md:pl-5 transition-all hover:bg-[#2C303A] hover:border-l-4 hover:border-[#05DF72] hover:text-white"
            :class="
              route.path === '/settings/account'
                ? 'bg-[#2C303A] md:border-l-4 border-[#05DF72] text-white'
                : ''
            "
            @click="account"
          >
            Account
          </li>
          <li
            class="flex-1 md:flex-none cursor-pointer p-1 px-2 md:pl-5 transition-all hover:bg-[#2C303A] hover:border-l-4 hover:border-[#05DF72] hover:text-white"
            :class="
              route.path === '/settings/billing'
                ? 'bg-[#2C303A] md:border-l-4 border-[#05DF72] text-white'
                : ''
            "
            @click="bill"
          >
            Billing
          </li>
        </ul>
      </nav>
    </div>
    <div class="flex-1">
      <RouterView />
    </div>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();

const profile = () => {
  router.push("/settings/profile");
};
const account = () => {
  router.push("/settings/account");
};
const bill = () => {
  router.push("/settings/billing");
};
</script>
