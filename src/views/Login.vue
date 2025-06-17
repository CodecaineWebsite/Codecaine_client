<template>
  <div class="flex flex-col text-white font-sans bg pt-16">
    <div class="mx-auto">
      <div class="max-w-[960px] w-full pl-28 pr-0">
        <div class="text-xl font-bold text-white tracking-wide select-none">
          Codecaine
        </div>
        <div class="text-[4.5rem] font-extrabold select-none">Log In</div>
      </div>

      <div class="flex max-w-[960px] w-full rounded-lg overflow-hidden px-8">
        <div class="flex-1 pr-16 flex flex-col items-end">
          <button
            @click="() => socialSignIn(new GoogleAuthProvider())"
            class="w-3/4 flex items-center py-3 px-4 mb-4 bg-[#444857] rounded cursor-pointer transition hover:bg-[black]">
            <GoogleIcon class="w-5 h-5 mr-3" />
            Log In with Google
          </button>
          <button
            @click="() => socialSignIn(new GithubAuthProvider())"
            class="w-3/4 flex items-center py-3 px-4 mb-4 bg-[#444857] rounded cursor-pointer transition hover:bg-[black]">
            <GithubIcon class="w-5 h-5 mr-3" />
            Log In with GitHub
          </button>

          <div
            class="w-3/4 rounded overflow-hidden transition"
            :class="{ 'bg-[#323444]': infoOpen }">
            <div
              class="cursor-pointer font-medium text-base leading-tight px-4 py-2 select-none relative"
              @click="toggleInfo">
              <span
                class="inline-block text-2xl mr-2 align-middle transition-transform"
                :class="{ 'rotate-90': infoOpen }"
                >▸</span
              >
              How social log in works
            </div>
            <div
              class="transition-all duration-500 ease-in-out overflow-hidden pt-1 pb-4 px-4"
              :class="
                infoOpen ? 'max-h-40 opacity-100 ' : 'max-h-0 opacity-0 py-0'
              "
              ref="infoContent">
              <p class="leading-tight text-sm">
                If the email address associated with your social account matches
                the email address of your CodePen account, you'll be logged in.
                You aren't locked to any particular social account. Questions?
              </p>
            </div>
          </div>
        </div>

        <div class="relative flex items-center justify-center self-stretch w-8">
          <div
            class="absolute top-0 left-1/2 -translate-x-1/2 w-px h-[41%] bg-[white]"></div>
          <span
            class="absolute w-12 h-[18%] left-1/2 top-[41%] -translate-x-1/2 border-2 border-white text-center flex items-center justify-center rounded-[10px] text-lg leading-[30px] bg-[#1e1f26] text-gray"
            >OR</span
          >
          <div
            class="absolute left-1/2 -translate-x-1/2 w-px h-[41%] bg-white top-[59%]"></div>
        </div>

        <div class="flex-1 flex flex-col px-16 pb-8">
          <form @submit.prevent="login">
            <div class="mb-5">
              <label
                for="username"
                class="block mb-1 text-sm"
                >Email</label
              >
              <input
                v-model="email"
                id="username"
                type="text"
                class="w-full py-3 px-4 rounded bg-[#b3b4ba] text-black border-none focus:bg-[white] focus:outline-none focus:ring-2 focus:ring-[#38c172] text-base" />
            </div>
            <div class="mb-5">
              <label
                for="password"
                class="block mb-1 text-sm"
                >Password</label
              >
              <input
                v-model="password"
                id="password"
                type="password"
                autocomplete="off"
                class="w-full py-3 px-4 rounded bg-[#b3b4ba] text-black border-none focus:bg-[white] focus:outline-none focus:ring-2 focus:ring-[#38c172] text-base" />
            </div>
            <p
              v-if="error"
              class="text-red-500 mt-4">
              {{ error }}
            </p>
            <button
              type="submit"
              class="w-full py-3 bg-[#38c172] rounded text-[#1e1f26] text-base font-medium cursor-pointer transition hover:bg-[#248C46] hover:text-white">
              Log In
            </button>
          </form>

          <div class="text-center mt-8 text-sm">
            <a
              href="#"
              @click.prevent="toggleReset"
              class="text-blue-300 hover:text-white cursor-pointer"
              >Forgot Password?</a
            >
          </div>

          <div
            id="reset-box"
            :class="
              resetOpen
                ? 'max-h-[300px] opacity-100 p-6 mt-6'
                : 'max-h-0 opacity-0 p-0 mt-0'
            "
            class="overflow-hidden transition-all duration-500 ease-in-out bg-[#323444] rounded"
            ref="resetBox">
            <h2 class="mt-0 text-2xl font-semibold mb-4">
              Reset Your Password
            </h2>
            <form>
              <div class="mb-5">
                <label
                  for="reset-email"
                  class="block mb-1 text-sm"
                  >Email</label
                >
                <input
                  v-model="resetEmail"
                  id="reset-email"
                  type="text"
                  placeholder="your@email.com"
                  class="w-full py-3 px-4 rounded bg-[#b3b4ba] text-black border-none focus:bg-[white] focus:outline-none focus:ring-2 focus:ring-[#38c172] text-base" />
              </div>
              <button
                type="button"
                @click="handleResetPassword"
                class="w-full py-3 bg-[#3a3c46] text-[#ececf1] rounded text-base cursor-pointer transition hover:bg-[#4b4e5a]">
                Send Password Reset Email
              </button>
              <p
                v-if="resetError"
                class="text-red-400 mt-2">
                {{ resetError }}
              </p>
              <p
                v-if="resetSuccess"
                class="text-green-400 mt-2">
                {{ resetSuccess }}
              </p>
            </form>
          </div>
        </div>
      </div>

      <footer
        class="max-w-[960px] w-full p-4 flex justify-center items-center mt-4">
        <div class="text-sm text-[#ececf1]">
          Need an account?
          <span
            @click="goSignup"
            class="text-blue-300 font-medium underline hover:text-white cursor-pointer"
            >Sign up now!</span
          >
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import { auth } from "../config/firebase";
import { GithubAuthProvider, GoogleAuthProvider } from "firebase/auth";
import {
  loginWithEmail,
  loginWithProvider,
  resetPassword,
} from "@/utils/authCore";
import { syncUser } from "@/utils/user";
import {
  getLoginErrorMessage,
  getResetErrorMessage,
} from "@/utils/errorHandlers";
import { useAuthStore } from "../stores/useAuthStore";

import GoogleIcon from "@/components/icons/GoogleIcon.vue";
import GithubIcon from "@/components/icons/GithubIcon.vue";

const authStore = useAuthStore();
const email = ref("");
const password = ref("");
const error = ref("");
const infoOpen = ref(false);
const infoContent = ref(null);

const resetOpen = ref(false);
const resetBox = ref(null);

const router = useRouter();
const route = useRoute();

const resetEmail = ref("");
const resetError = ref("");
const resetSuccess = ref("");

const login = async () => {
  try {
    const { token } = await loginWithEmail(auth, email.value, password.value);
    authStore.setToken(token);
    await syncUser();
    alert("登入成功！");
    router.push(route.query.redirect || "/");
  } catch (e) {
    error.value = getLoginErrorMessage(e.code);
    console.error(e);
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
    router.push(route.query.redirect || "/");
  } catch (e) {
    alert(getSocialSignInErrorMessage(e.code, provider.providerId));
    console.error(e);
  }
};

const handleResetPassword = async () => {
  resetError.value = "";
  resetSuccess.value = "";
  if (!resetEmail.value) {
    resetError.value = "Please enter your email.";
    return;
  }
  try {
    await resetPassword(auth, resetEmail.value);
    resetSuccess.value = "Password reset email sent!";
    resetEmail.value = "";
  } catch (e) {
    resetError.value = getResetErrorMessage(e.code);
  }
};

const goSignup = () => {
  router.push("/signup");
};

const toggleInfo = () => {
  if (!infoOpen.value) {
    infoOpen.value = true;
    nextTick(() => {
      const el = infoContent.value;
      el.style.maxHeight = el.scrollHeight + "px";
      el.style.opacity = "1";
    });
  } else {
    const el = infoContent.value;
    el.style.maxHeight = "0";
    el.style.opacity = "0";
    setTimeout(() => {
      infoOpen.value = false;
    }, 500);
  }
};

const toggleReset = () => {
  resetOpen.value = !resetOpen.value;
  nextTick(() => {
    const el = resetBox.value;
    if (resetOpen.value) {
      el.style.opacity = "1";
    } else {
      el.style.opacity = "0";
    }
  });
};
</script>

<style scoped>
.bg {
  background-image: url("https://cpwebassets.codepen.io/assets/logos/codepen-logo-pattern-b477875ac66ffc21e4485a989358c220fac283caf17e602346a50d4250970254.png");
}
</style>
