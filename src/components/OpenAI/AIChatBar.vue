<script setup>
  import { ref } from 'vue';

  const messageInput = ref('')
  const withHtmlCode = ref(false)
  const withCssCode = ref(false)
  const withJSCode = ref(false)

  const toggleWithCode = (language) => {
    if(language === 'html') {
      withHtmlCode.value = !withHtmlCode.value
    }
    else if(language === 'css') {
      withCssCode.value = !withCssCode.value
    }
    else {
      withJSCode.value = !withJSCode.value
    }
  }
</script>

<template>
  <div
    class="flex flex-col w-md h-full bg-cc-chat-bg"
  >
    <header>
      <div class="text-center p-2">OpenAI Chat</div>
      <div class="p-2">[Chat Name]</div>
    </header>
    <main class="flex-1"></main>
    <footer class="p-3 border-t-1 border-cc-editor-column-border">
      <textarea 
        class="w-full py-2 px-1 outline-none placeholder-gray-500 resize-none"
        v-model="messageInput"
        placeholder="How can I help you ?" >
      </textarea>
      <div class="flex  justify-between">
        <div class="flex gap-1">
          <button 
            class="rounded px-3 py-1 hover:cursor-pointer"
            :class="withHtmlCode? 
              'text-cc-1 bg-[#47cf73]':
              'bg-[#444857] text-cc-editor-column-tab-text hover:bg-gray-500 hover:text-cc-1'"
            @click="toggleWithCode('html')"
          >
            HTML
          </button>
          <button
            class="rounded px-3 py-1 hover:cursor-pointer"
            :class="withCssCode? 
              'text-cc-1 bg-[#47cf73]':
              'bg-[#444857] text-cc-editor-column-tab-text hover:bg-gray-500 hover:text-cc-1'"
            @click="toggleWithCode('css')"
          >
            CSS
          </button>
          <button
            class="rounded px-3 py-1 hover:cursor-pointer"
            :class="withJSCode? 
              'text-cc-1 bg-[#47cf73]':
              'bg-[#444857] text-cc-editor-column-tab-text hover:bg-gray-500 hover:text-cc-1'"
            @click="toggleWithCode('js')"
          >
            JavaScript
          </button>
        </div>
        <button class="hover:cursor-pointer hover:text-[#47cf73] p-2 transition duration-150 ease-in-out">
          Send
        </button>
      </div>
    </footer>
  </div>
</template>