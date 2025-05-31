<script setup>
  import Close from '../assets/close.svg';
  defineProps({
    show: Boolean,
  })
  const emit = defineEmits(['modalClose'])

  const close = () => {
    emit('modalClose')
  }

</script>
<template>
  <!-- 遮罩層與 Modal -->
  <div
    v-if="show"
    class="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50"
    @click.self="close"
  >
   
    <div
      class="overflow-hidden relative bg-white rounded-xl px-15 py-7.5 w-3/8 shadow-lg transform transition-all h-4/5 flex flex-col"
    >
      <div class="absolute top-0 left-0 right-0 h-2 rounded-t-xl bg-green-400"></div>
      <button
        class="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        @click="close"
      >
        x
      </button>
      <!-- Modal 內容 -->
      <h2 class="font-bold mb-4 text-slate-700 text-center text-4xl">Hold up!</h2>
      <p class="text-slate-400 text-center font-size-15 mb-8">
        You’ll have to Log In or Sign Up (for free!) to save your Pen.
        <br>
        Don’t worry! All your work will be saved to your account.
      </p>
      <form action="" class="flex flex-col gap-4 pb-2 text-zinc-900 text-sm">
        <div>
          <label for="account" class="text-slate-700">Username or Email</label>
          <input
            type="text"
            class="p-2.5 mt-1 bg-gray-100 w-full rounded-md h-12
                  outline-none ring-inset focus:ring-2 focus:ring-stone-300"
          />
        </div>
        <div>
          <label for="password" class="text-slate-700">Password</label>
          <input
            type="text"
            class="p-2.5 mt-1 bg-gray-100 w-full rounded-md h-12
                  outline-none ring-inset focus:ring-2 focus:ring-stone-300"
          />
        </div>
        <button class="w-full h-10 bg-emerald-400">Log In</button>
        <a href="" class="text-slate-400 text-center">Forget Password</a>
      </form>
      <div class="absolute h-1/9 left-0 bottom-0 border-t-1 border-stone-300 w-full text-zinc-900 flex justify-center items-center">
        <a href="">
          Need to create an account?
          <span class="text-teal-700 font-size-15">Sign Up for CodePen</span>
        </a>
      </div>
    </div>

  </div>
</template>