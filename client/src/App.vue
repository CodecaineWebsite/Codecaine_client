<script setup>
import { RouterLink, RouterView } from "vue-router";
import { onAuthStateChanged, getIdToken, onIdTokenChanged } from "firebase/auth";
import { auth } from "./config/firebase";
import { useAuthStore } from "./stores/useAuthStore";

// 初始化 user 狀態與 token（首次載入或切換帳號時）
onAuthStateChanged(auth, async (firebaseUser) => {
  const authStore = useAuthStore();

  if (firebaseUser) {
    const token = await getIdToken(firebaseUser);
    authStore.setUser(firebaseUser);
    authStore.setToken(token);
  } else {
    authStore.setUser(null);
    authStore.clearToken();
  }
});

// 監聽 token 自動刷新（Firebase 約每 1 小時自動換 token）
onIdTokenChanged(auth, async (firebaseUser) => {
  const authStore = useAuthStore();
  if (firebaseUser) {
    const token = await firebaseUser.getIdToken();
    authStore.setToken(token);
  }
});
</script>

<template>
  <RouterView />
</template>

<style scoped>
* {
  background-color: #131417;
  color: white;
}
</style>
