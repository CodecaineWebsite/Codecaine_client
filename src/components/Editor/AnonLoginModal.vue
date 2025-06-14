<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Close from '@/components/icons/Close.vue';
import { useAuthStore } from '@/stores/useAuthStore';
import { loginWithEmail, registerWithEmail, resetPassword } from '@/utils/authCore';
import {
  getLoginErrorMessage,
  getResetErrorMessage,
} from "@/utils/errorHandlers";
import { syncUser } from "@/utils/user";
import { auth } from "@/config/firebase";
import { useHandleSave } from '@/utils/handleWorkSave';

const { handleSave } = useHandleSave();
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore();

const account = ref('')
const password = ref('')
const success = ref("")
const error = ref("")

const emailForResetPassword = ref('')
const resetError = ref("");
const resetSuccess = ref("");

const modalType = computed(() => route.query.modal)
const showModal = computed(() => modalType.value === 'login' || modalType.value === 'signup')

const isForgetPassword = ref(false)
const toggleIsForgetPassword = () => {
  isForgetPassword.value = !isForgetPassword.value
}

const close = () => {
  const newQuery = { ...route.query }
  delete newQuery.modal
  router.replace({ path: route.path, query: newQuery })
}

const handleLogIn = async() => {
  error.value = "";
  success.value = "";

  try {
    const { token } = await loginWithEmail(auth, account.value, password.value);
    authStore.setToken(token);
    await syncUser();

    handleSave();

    account.value = ""
    password.value = ""
  } catch (e) {
    error.value = getLoginErrorMessage(e.code);
    console.error(e);
  }
}

const handleSignUp = async() => {
  error.value = "";
  success.value = "";

  try {
    await registerWithEmail(auth, account.value, password.value);
    success.value = "You have successfully registered!";
    handleLogIn()
  } catch (e) {
    const msg = getRegisterErrorMessage(e.code);
    alert(msg);
    error.value = msg;
    console.error("註冊失敗:", e);
  }
}

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
  router.push({ path: route.path, query: { ...route.query, modal: 'login' } })
}
const handleToSignUp = () => {
  error.value = "";
  account.value = "";
  password.value = "";
  router.push({ path: route.path, query: { ...route.query, modal: 'signup' } })
}

</script>

<template>
  <div
    v-if="showModal"
    class="fixed inset-0 bg-black/50 flex justify-center items-start z-50"
    @click.self="close"
  >
    <div class="relative bg-white rounded-xl mt-8 w-80 shadow-lg flex flex-col min-w-lg min-h-[70vh] max-h-[80vh] pt-7.5 px-15 overflow-y-auto">
      <div class="absolute top-0 left-0 right-0 h-2 rounded-t-xl bg-green-400"></div>
      <button class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10" @click="close">
        <Close class="w-3 h-3 cursor-pointer" />
      </button>

      <div>
        <h2 class="font-bold mb-4 text-slate-700 text-center text-4xl">Hold up!</h2>
        <p class="text-slate-400 text-center text-sm mb-4 tracking-tight">
          You’ll have to Log In or Sign Up (for free!) to save your Pen.<br />
          Don’t worry! All your work will be saved to your account.
        </p>
      </div>

      <div v-show="error">
        <p class="bg-red-500 text-white text-sm p-2 my-1">{{ error }}</p>
      </div>

      <main v-if="modalType === 'login'" class="flex-1">
        <form class="flex flex-col gap-4 text-zinc-900 text-sm">
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
          <button type="button" class="w-full h-10 bg-emerald-400 rounded-md cursor-pointer" @click="handleLogIn">Log In</button>
          <a href="#" class="text-slate-400 text-center" @click.prevent="toggleIsForgetPassword">Forget Password?</a>
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
            <button type="button" class="w-full h-10 bg-slate-500 text-white hover:bg-slate-400 rounded-md" @click="handleResetPassword">
              Send Password Reset Email
            </button>
          </form>
        </div>
      </main>

      <main v-else-if="modalType === 'signup'" class="flex-1 mb-4">
        <form class="flex flex-col gap-4 text-zinc-900 text-sm" @submit.prevent="handleSignUp">
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
          <button type="submit" class="w-full h-10 bg-emerald-400 rounded-md cursor-pointer">Sign Up</button>
        </form>
      </main>

      <div class="relative w-full text-zinc-900 bg-white text-center p-5 before:content-[''] before:absolute before:top-0 before:h-[1px] before:bg-zinc-200 before:left-[-60px] before:right-[-60px]">
        <a v-if="modalType === 'login'" href="#" @click.prevent="handleToSignUp">
          Need to create an account?
          <span class="text-teal-700 text-sm">Sign Up for CodePen</span>
        </a>
        <a v-else-if="modalType === 'signup'" href="#" @click.prevent="handleToLogIn">
          Already have an account?
          <span class="text-teal-700 text-sm">Log In</span>
        </a>
      </div>
    </div>
  </div>
</template>
