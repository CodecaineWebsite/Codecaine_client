<template>
  <div v-if="authStore.isAuthReady">
    <RouterView />
  </div>
  <div v-else class="w-full h-screen flex items-center justify-center">
    <p class="text-white">正在載入頁面</p>
  </div>
</template>

<script setup>
import { RouterLink, RouterView } from "vue-router";
import {
  onAuthStateChanged,
  getIdToken,
  onIdTokenChanged,
} from "firebase/auth";
import { auth } from "@/config/firebase";
import { useAuthStore } from "@/stores/useAuthStore";
import { syncUser } from "@/utils/user.js";
const authStore = useAuthStore();

onAuthStateChanged(auth, async (firebaseUser) => {
  try {
    if (firebaseUser) {
      const token = await getIdToken(firebaseUser);
      authStore.setUser(firebaseUser);
      authStore.setToken(token);
      const res = await syncUser();
      authStore.setUserProfile(res.user);
    } else {
      authStore.setUser(null);
      authStore.setUserProfile(null);
      authStore.clearToken();
    }
  } catch (err) {
    console.error("onAuthStateChanged 發生錯誤：", err);
    authStore.setUser(null);
    authStore.setUserProfile(null);
    authStore.clearToken();
  } finally {
    authStore.setAuthReady(true);
  }
});

onIdTokenChanged(auth, async (firebaseUser) => {
  const authStore = useAuthStore();
  if (firebaseUser) {
    const token = await firebaseUser.getIdToken();
    authStore.setToken(token);
  }
});
</script>

<style scoped>
* {
  background-color: #131417;
  color: white;
  background-color: #131417;
  color: white;
}
</style>
