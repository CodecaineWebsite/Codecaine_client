<template>
  <div class="min-h-screen bg-cc-17 text-cc-1 grid place-items-center p-8">
    <main class="max-w-[350px] text-center">
      <h1 class="text-[110px] leading-[1.5] font-system-ui mb-6">500</h1>

      <p class="text-lg leading-[1.5] mb-4 font-semibold">
        Unexpected Error
      </p>

      <p class="text-lg leading-[1.5] mb-6">
        You can go back to our 
        <router-link 
          to="/" 
          class="text-cc-link-on-black hover:text-cc-link transition-colors underline ml-1"
        >
          Homepage
        </router-link>.
      </p>
    </main>
  </div>
</template>

<script setup>
defineOptions({ name: 'CodeCaine500' })
</script>

<style>
.font-system-ui {
  font-family: system-ui, sans-serif;
}
</style>