<template>
  <div class="min-h-screen bg-cc-17 text-cc-1 grid place-items-center p-8">
    <main class="max-w-[350px]">
      <h1 class="text-[110px] leading-[1.5] font-system-ui mb-6">404</h1>
      
      <p class="text-lg leading-[1.5] mb-4">
        I'm afraid you've found a page that doesn't exist on Codecaine. That can happen when you follow a link to something that has since been deleted. Or the link was incorrect to begin with.
      </p>
      
      <p class="text-lg leading-[1.5] mb-6">
        Sorry about that. We've logged the error for review, in case it's our fault.
      </p>
      
      <!-- 連結 -->
      <ul class="space-y-2">
        <li>
          <router-link 
            to="/" 
            class="text-cc-link-on-black hover:text-cc-link transition-colors"
          >
            Go to the homepage
          </router-link>
        </li>
      </ul>
    </main>
  </div>
</template>

<script setup>
defineOptions({ name: 'CodeCaine404' })
</script>

<style>
.font-system-ui {
  font-family: system-ui, sans-serif;
}
</style>