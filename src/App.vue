<script setup>
import { RouterLink, RouterView } from "vue-router";
import {
  onAuthStateChanged,
  getIdToken,
  onIdTokenChanged,
} from "firebase/auth";
import { auth } from "./config/firebase";
import { useAuthStore } from "./stores/useAuthStore";
import { syncUser } from "./utils/user.js";
const authStore = useAuthStore();
// 初始化 user 狀態與 token（首次載入或切換帳號時）
//近期使用時發現bug 一小時後的 token 會失效，導致無法正常使用 儲存在pinia的就會有bug
// 這裡會在使用者登入或登出時自動更新狀態 目前還在測試階段 如果回去開發使用有碰到任何問題再提出來!!
//先從login複製放在這裡 等login拆成utils再做修改

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
  <!--登入狀態因為是一個非同步的function 所以在F5(重新整理)時會得到一瞬間未登入的狀態 為了解決這個畫面的不連貫性 所以使用以下的v-if去做判斷-->
  <div v-if="authStore.isAuthReady">
    <RouterView />
  </div>
  <div
    v-else
    class="w-full h-screen flex items-center justify-center">
    <!-- 可以放 loading spinner -->
    <p class="text-white">正在載入頁面</p>
  </div>
</template>

<style scoped>
* {
  background-color: #131417;
  color: white;
  background-color: #131417;
  color: white;
}
</style>
