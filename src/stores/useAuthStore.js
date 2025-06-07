import { defineStore } from "pinia";
import { ref } from "vue";

export const useAuthStore = defineStore("auth", () => {
  const isAuthReady = ref(false);
  const idToken = ref(null);
  const user = ref(null);
  const userProfile = ref(null);
  function setToken(token) {
    idToken.value = token;
    localStorage.setItem("idToken", token);
  }

  function clearToken() {
    idToken.value = "";
    localStorage.removeItem("idToken");
  }
  function setUser(u) {
    user.value = u;
  }
  function setUserProfile(profile) {
    userProfile.value = profile;
  }
  function setAuthReady(ready) {
    isAuthReady.value = ready;
  }

  // 初始化時讀取 localStorage
  function initAuth() {
    const token = localStorage.getItem("idToken");
    if (token) {
      idToken.value = token;
    }
    isAuthReady.value = true;
  }

  // 呼叫初始化
  initAuth();

  return {
    idToken,
    user,
    userProfile,
    setToken,
    clearToken,
    setUser,
    isAuthReady,
    setAuthReady,
    setUserProfile,
  };
});
