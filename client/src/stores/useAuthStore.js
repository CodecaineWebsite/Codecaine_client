import { defineStore } from "pinia";
import { ref } from "vue";

export const useAuthStore = defineStore("auth", () => {
  const isAuthReady = ref(false);
  const idToken = ref("");
  const user = ref(null);
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
  function setAuthReady(ready) {
    isAuthReady.value = ready;
  }
  return {
    idToken,
    user,
    setToken,
    clearToken,
    setUser,
    isAuthReady,
    setAuthReady,
  };
});
