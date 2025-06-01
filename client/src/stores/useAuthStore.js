import { defineStore } from "pinia";
import { ref } from "vue";

export const useAuthStore = defineStore("auth", () => {
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
  return { idToken, user, setToken, clearToken, setUser};
});
