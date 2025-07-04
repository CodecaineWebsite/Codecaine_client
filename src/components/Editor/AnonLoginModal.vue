<script setup>
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import Close from "@/components/icons/Close.vue";
import { useAuthStore } from "@/stores/useAuthStore";
import {
  loginWithEmail,
  registerWithEmail,
  resetPassword,
} from "@/utils/authCore";
import {
  getLoginErrorMessage,
  getResetErrorMessage,
} from "@/utils/errorHandlers";
import { syncUser } from "@/utils/user";
import { auth } from "@/config/firebase";
import { useHandleSave } from "@/utils/handleWorkSave";
import { useToastStore } from "@/stores/useToastStore";

const { handleSave } = useHandleSave();
const toastStore = useToastStore();
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const modal = ref(null);
const { showToast } = toastStore;
const account = ref("");
const password = ref("");
const success = ref("");
const error = ref("");

const emailForResetPassword = ref("");
const resetError = ref("");
const resetSuccess = ref("");

const modalType = computed(() => route.query.modal);
const showModal = computed(
  () => modalType.value === "login" || modalType.value === "signup"
);

const isForgetPassword = ref(false);
const toggleIsForgetPassword = () => {
  isForgetPassword.value = !isForgetPassword.value;
};

const startClick = (e) => {
  mouseDownInside = modal.value?.contains(e.target);
};

const checkClose = (e) => {
  const mouseUpInside = modal.value?.contains(e.target);

  if (!mouseDownInside && !mouseUpInside) {
    close();
  }
};

const close = () => {
  const newQuery = { ...route.query };
  delete newQuery.modal;
  router.replace({ path: route.path, query: newQuery });
};

let mouseDownInside = false;
const handleLogIn = async () => {
  error.value = "";
  success.value = "";

  try {
    const { token } = await loginWithEmail(auth, account.value, password.value);
    authStore.setToken(token);
    await syncUser();
    showToast({
      message: "Login successful！",
      variant: "success",
    });
    handleSave();

    account.value = "";
    password.value = "";
  } catch (e) {
    error.value = getLoginErrorMessage(e.code);
    console.error(e);
  }
};

const handleSignUp = async () => {
  error.value = "";
  success.value = "";

  try {
    await registerWithEmail(auth, account.value, password.value);
    success.value = "You have successfully registered!";
    showToast({
      message: "Registration successful！",
      variant: "success",
    });
    handleLogIn();
  } catch (e) {
    const msg = getRegisterErrorMessage(e.code);
    showToast({
      message: msg,
      variant: "danger",
    });
    error.value = msg;
    console.error("註冊失敗:", e);
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

const handleToLogIn = () => {
  error.value = "";
  account.value = "";
  password.value = "";
  router.push({ path: route.path, query: { ...route.query, modal: "login" } });
};
const handleToSignUp = () => {
  error.value = "";
  account.value = "";
  password.value = "";
  router.push({ path: route.path, query: { ...route.query, modal: "signup" } });
};

const initModal = () => {
  account.value = "";
  password.value = "";
  success.value = "";
  error.value = "";
  emailForResetPassword.value = "";
  resetError.value = "";
  resetSuccess.value = "";
  isForgetPassword.value = false;
};

watch(showModal, (val) => {
  if (val) {
    initModal();
  }
});
</script>

<template>
  <div
    v-if="showModal"
    class="fixed inset-0 bg-black/50 flex justify-center items-start z-150"
    @mousedown="startClick"
    @mouseup="checkClose"
  >
    <div
      ref="modal"
      class="relative bg-white rounded-xl mt-8 w-90 md:w-80 shadow-lg flex flex-col md:min-w-lg min-md-h-[70vh] max-h-[90vh] md:max-h-[80vh] pt-7.5 md:px-15 p-8 overflow-y-auto"
    >
      <div
        class="absolute top-0 left-0 right-0 h-2 rounded-t-xl bg-green-400"
      ></div>
      <button
        class="absolute top-5 right-4 hover:text-gray-700 z-20"
        @click="close"
      >
        <Close class="w-3 h-3 cursor-pointer text-slate-700" />
      </button>

      <div>
        <h2 class="font-bold mb-4 text-slate-700 text-center text-4xl">
          Hold up!
        </h2>
        <p class="text-slate-400 text-center text-sm mb-4 tracking-tight">
          You’ll have to Log In or Sign Up (for free!) to save your Dose.<br />
          Don’t worry! All your work will be saved to your account.
        </p>
      </div>

      <div v-show="error">
        <p class="bg-red-500 text-white text-sm p-2 my-1">{{ error }}</p>
      </div>

      <main v-if="modalType === 'login'" class="flex-1">
        <form class="flex flex-col gap-4 text-zinc-900 text-sm" @submit.prevent="handleLogIn">
          <div>
            <label for="account" class="text-slate-700">Email</label>
            <input
              type="text"
              class="p-2.5 mt-1 bg-gray-100 w-full rounded-md h-11 outline-none focus:ring-2 focus:ring-stone-300"
              v-model="account"
            />
          </div>
          <div>
            <label for="password" class="text-slate-700">Password</label>
            <input
              type="password"
              class="p-2.5 mt-1 bg-gray-100 w-full rounded-md h-11 outline-none focus:ring-2 focus:ring-stone-300"
              v-model="password"
            />
          </div>
          <button
            type="submit"
            class="w-full h-10 bg-emerald-400 rounded-md cursor-pointer"
          >
            Log In
          </button>
          <a
            href="#"
            class="text-slate-400 text-center"
            @click.prevent="toggleIsForgetPassword"
            >Forget Password?</a
          >
        </form>

        <div
          class="rounded bg-[#2C303A] my-4 overflow-hidden transition-all duration-500 ease-in-out"
          :class="isForgetPassword ? 'max-h-[500px]' : 'max-h-0'"
        >
          <form class="p-5">
            <h2 class="mb-2 text-white font-bold">Reset Your Password</h2>
            <label for="resetEmail" class="text-slate-400">Email</label>
            <input
              type="text"
              id="resetEmail"
              placeholder="your@email.com"
              class="p-2.5 mt-1 mb-3 bg-gray-100 w-full rounded-md h-12 outline-none focus:ring-2 focus:ring-stone-300 text-black"
              v-model="emailForResetPassword"
            />
            <button
              type="button"
              class="w-full h-10 bg-slate-500 text-white hover:bg-slate-400 rounded-md"
              @click="handleResetPassword"
            >
              Send Password Reset Email
            </button>
          </form>
        </div>
      </main>

      <main v-else-if="modalType === 'signup'" class="flex-1 mb-4">
        <form
          class="flex flex-col gap-4 text-zinc-900 text-sm"
          @submit.prevent="handleSignUp"
        >
          <div>
            <label for="email" class="text-slate-700">Email</label>
            <input
              type="text"
              id="email"
              class="p-2.5 mt-1 bg-gray-100 w-full rounded-md h-11 outline-none focus:ring-2 focus:ring-stone-300"
              v-model="account"
            />
          </div>
          <div>
            <label for="password" class="text-slate-700">Choose Password</label>
            <input
              type="password"
              id="password"
              class="p-2.5 mt-1 bg-gray-100 w-full rounded-md h-11 outline-none focus:ring-2 focus:ring-stone-300"
              v-model="password"
            />
          </div>
          <button
            type="submit"
            class="w-full h-10 bg-emerald-400 rounded-md cursor-pointer"
          >
            Sign Up
          </button>
        </form>
      </main>

      <div
        class="relative w-full text-zinc-900 bg-white text-center pt-5 before:content-[''] before:absolute before:top-0 before:h-[1px] before:bg-zinc-200 before:left-[-60px] before:right-[-60px]"
      >
        <a
          v-if="modalType === 'login'"
          href="#"
          @click.prevent="handleToSignUp"
        >
          Need to create an account?
          <span class="text-teal-700 text-sm">Sign Up for Codecaine</span>
        </a>
        <a
          v-else-if="modalType === 'signup'"
          href="#"
          @click.prevent="handleToLogIn"
        >
          Already have an account?
          <span class="text-teal-700 text-sm">Log In</span>
        </a>
      </div>
    </div>
  </div>
</template>
