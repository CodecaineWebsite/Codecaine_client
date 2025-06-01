<script setup>
  import { ref } from 'vue'; 
  defineProps({
    show: Boolean,
  })

  const emit = defineEmits(['modalClose'])
  const close = () => {
    emit('modalClose')
  }

  const isForgetPassword = ref(false)
  const toggleIsForgetPassword = () => {
    isForgetPassword.value = !isForgetPassword.value;
  }
</script>
<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black/50 flex justify-center items-start z-50"
    @click.self="close"
  >
    <div
      class="relative bg-white rounded-xl m-6 w-40 shadow-lg transition-all flex flex-col min-w-lg min-h-[70vh] max-h-[80vh] overflow-hidden"
    >
      <div class="absolute top-0 left-0 right-0 h-2 rounded-t-xl bg-green-400"></div>

      <button
        class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
        @click="close"
      >
        x
      </button>

      <div class="pt-6 px-8">
        <h2 class="font-bold mb-4 text-slate-700 text-center text-4xl">Hold up!</h2>
        <p class="text-slate-400 text-center text-sm mb-4 tracking-tight">
          You’ll have to Log In or Sign Up (for free!) to save your Pen.<br>
          Don’t worry! All your work will be saved to your account.
        </p>
      </div>

      <main class="flex-1 overflow-y-auto px-8 pb-4">
        <!-- 登入表單 -->
        <form class="flex flex-col gap-4 text-zinc-900 text-sm">
          <div>
            <label for="account" class="text-slate-700">Username or Email</label>
            <input
              type="text"
              class="p-2.5 mt-1 bg-gray-100 w-full rounded-md h-12 outline-none focus:ring-2 focus:ring-stone-300"
            />
          </div>
          <div>
            <label for="password" class="text-slate-700">Password</label>
            <input
              type="password"
              class="p-2.5 mt-1 bg-gray-100 w-full rounded-md h-12 outline-none focus:ring-2 focus:ring-stone-300"
            />
          </div>
          <button type="button" class="w-full h-10 bg-emerald-400 rounded-md">Log In</button>
          <a
            href="#"
            class="text-slate-400 text-center"
            @click.prevent="toggleIsForgetPassword"
          >
            Forget Password
          </a>
        </form>

        <!-- 忘記密碼表單 -->
        <div
          class="rounded bg-[#2C303A] mt-4 overflow-hidden transition-[max-height,padding,opacity] duration-500 ease-in-out"
          :class="isForgetPassword ? 'max-h-[500px]' : 'max-h-0'"
        >
          <!-- 內層form保持不動 -->
          <form class="p-5">
            <h2 class="mb-2 text-white">Reset Your Password</h2>
            <label for="resetEmail" class="text-slate-400">Username or Email</label>
            <input
              type="text"
              id="resetEmail"
              placeholder="your@email.com"
              class="p-2.5 mt-1 mb-3 bg-gray-100 w-full rounded-md h-12 outline-none focus:ring-2 focus:ring-stone-300 text-black"
            />
            <button type="button" class="w-full h-10 bg-emerald-400 rounded-md">
              Send Password Reset Email
            </button>
          </form>
        </div>
        
      </main>

      <div class="border-t border-stone-300 px-6 py-3 text-zinc-900 bg-white text-center">
        <a href="">
          Need to create an account?
          <span class="text-teal-700 text-sm">Sign Up for CodePen</span>
        </a>
      </div>
    </div>
  </div>
</template>
