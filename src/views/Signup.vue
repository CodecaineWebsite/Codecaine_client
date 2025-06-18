<template>
  <div class="flex justify-center items-start min-h-screen bg py-24 px-4">
    <div class="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
      <form class="mb-4">
        <input type="hidden" name="authenticity_token" value="..." />
        <button
          type="button"
          @click="() => socialSignIn(new GoogleAuthProvider())"
          class="w-full flex items-center justify-center gap-2 bg-gray-700 text-white font-bold py-3 rounded-md cursor-pointer hover:bg-black transition duration-200"
        >
          <img
            src="https://img.icons8.com/color/16/000000/google-logo.png"
            alt="Google logo"
          />
          <span>Sign Up with Google</span>
        </button>
        <button
          type="button"
          @click="() => socialSignIn(new GithubAuthProvider())"
          class="w-full flex items-center justify-center gap-2 bg-gray-700 text-white font-bold py-3 rounded-md cursor-pointer hover:bg-black transition duration-200 mt-3"
        >
          <img
            src="https://img.icons8.com/ios-glyphs/24/ffffff/github.png"
            alt="GitHub logo"
          />
          <span>Sign Up with GitHub</span>
        </button>
      </form>

      <p class="text-center text-gray-600 font-bold my-4">Or,</p>

      <button
        @click="showEmailForm = !showEmailForm"
        class="w-full bg-gray-700 text-white font-bold py-3 rounded-md mb-4 cursor-pointer hover:bg-black transition duration-200"
      >
        Sign Up with Email
      </button>

      <transition
        @before-enter="beforeEnter"
        @enter="enter"
        @leave="leave"
        :css="false"
      >
        <div v-show="showEmailForm" ref="emailSection">
          <form @submit.prevent="register">
            <input type="hidden" value="..." />

            <div class="mb-4">
              <label
                for="email"
                class="block text-sm font-bold text-gray-700 mb-1"
                >Email</label
              >
              <input
                v-model="email"
                type="email"
                id="email"
                required
                autocomplete="email"
                maxlength="20"
                class="w-full border border-gray-300 rounded px-3 py-2 text-black bg-gray-200 hover:bg-white transition"
              />
            </div>

            <div class="mb-4">
              <label
                for="password"
                class="block text-sm font-bold text-gray-700 mb-1"
                >Choose Password</label
              >
              <input
                v-model="password"
                id="password"
                type="password"
                autocomplete="new-password"
                required
                class="w-full border border-gray-300 rounded px-3 py-2 text-black bg-gray-200 hover:bg-white transition"
              />

              <ul class="text-xs text-gray-600 mt-2 list-disc pl-5">
                <li>Include an <strong>UPPER</strong> and lowercase letter</li>
                <li>Include a number</li>
                <li>
                  Include special characters: <code>@$!%*#?&><()^+_-</code>
                </li>
                <li>8–100 characters</li>
              </ul>
            </div>

            <button
              type="submit"
              class="w-full bg-green-500 text-white font-bold py-3 rounded-md mt-4 cursor-pointer hover:bg-gray-600 transition duration-200"
            >
              Submit
            </button>
          </form>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { GithubAuthProvider, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/config/firebase";
import { registerWithEmail, loginWithProvider } from "@/utils/authCore";
import {
  getRegisterErrorMessage,
  getSocialSignInErrorMessage,
} from "@/utils/errorHandlers";
import { syncUser } from "@/utils/user.js";
import { useAuthStore } from "@/stores/useAuthStore";

const authStore = useAuthStore();
const router = useRouter();
const showEmailForm = ref(false);
const email = ref("");
const password = ref("");
const error = ref("");
const success = ref("");

const register = async () => {
  error.value = "";
  success.value = "";
  try {
    await registerWithEmail(auth, email.value, password.value);
    success.value = " Registration successful！";
    alert(success.value);
    await syncUser();
    router.push("/trending");
  } catch (e) {
    const msg = getRegisterErrorMessage(e.code);
    alert(msg);
    error.value = msg;
    console.error("Registration failed:", e);
  }
};

const socialSignIn = async (provider) => {
  try {
    const { token } = await loginWithProvider(auth, provider);
    authStore.setToken(token);
    await syncUser();
    alert(
      `${
        provider.providerId.includes("google") ? "Google" : "GitHub"
      } sign in successful!`
    );
    router.push("/trending");
  } catch (e) {
    alert(getSocialSignInErrorMessage(e.code, provider.providerId));
    console.error(e);
  }
};

function beforeEnter(el) {
  el.style.height = "0";
  el.style.opacity = "0";
}

function enter(el, done) {
  el.style.transition = "all 0.3s ease";
  const height = el.scrollHeight;
  el.style.height = height + "px";
  el.style.opacity = "1";
  setTimeout(() => {
    el.style.height = "auto";
    done();
  }, 300);
}

function leave(el, done) {
  el.style.transition = "all 0.3s ease";
  el.style.height = el.scrollHeight + "px";
  requestAnimationFrame(() => {
    el.style.height = "0";
    el.style.opacity = "0";
  });
  setTimeout(done, 300);
}
</script>

<style scoped>
.bg {
  background-image: url("/bg-pattern.png");
}
</style>
