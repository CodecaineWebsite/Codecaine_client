<script setup>
  import { ref, onMounted } from 'vue';
  import { storeToRefs } from 'pinia'
  import { useAIChatStore } from '@/stores/useAIChatStore';
  import AIChatMessage from './AIChatMessage.vue';
  import Arrow from '@/assets/arrow.vue';
  import TrashCanIcon from '../icons/TrashCanIcon.vue';

  const aiChatStore = useAIChatStore();
  const { addNewChat, fetchChats, fetchMessages, deleteChat, sendUserMessage } = aiChatStore;
  const { isSending, historyMessages, currentChat, chatList } = storeToRefs(aiChatStore);

  const showChatDropdown = ref(false)
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

  const handleAddNewChat = () => {
    showChatDropdown.value = false;
    addNewChat();
  }

const toggleChatDropdown = async () => {
  showChatDropdown.value = !showChatDropdown.value
  if (showChatDropdown.value) {
    await fetchChats(); // 會更新 store 中的 chatList
  }
}

const switchChat = (chat) => {
  showChatDropdown.value = false
  currentChat.value = chat
  aiChatStore.fetchMessages(chat.id)
}

const handleEnter = (e) => {
  if (e.shiftKey) return; // Shift + Enter = 換行
  sendMessage();
};

onMounted(async() => {
  await fetchChats();
  if (chatList.value.length === 0) {
    await addNewChat();
  } else {
    await fetchMessages(chatList.value[0].id);
  }
})

const sendMessage = async () => {
  const trimmed = messageInput.value.trim();
  const payload = {
    content: trimmed,
    html: withHtmlCode.value,
    css: withCssCode.value,
    js: withJSCode.value,
    chatId: currentChat.value?.id
  };

  // 清空輸入欄
  messageInput.value = '';
  sendUserMessage(payload)
};
  
</script>

<template>
  <div class="flex flex-col h-full bg-cc-chat-bg relative">
    <header class="mb-1">
      <div class="text-center p-2">OpenAI Chat</div>
      <div class="p-2 flex justify-between items-center relative  border-y-2 border-cc-editor-column-border">
        <div class="py-1 px-2 truncate max-w-[150px]">{{ currentChat?.title || 'Choose a Chat' }}</div>
        <div>
          <button
            class="py-1 px-2 hover:cursor-pointer hover:text-cc-1 text-cc-editor-column-tab-text"
            @click="handleAddNewChat"
          >
            +
          </button>
          <button
            class="py-1 px-2 hover:cursor-pointer hover:text-cc-1 text-cc-editor-column-tab-text"
            @click="toggleChatDropdown"
          >
            <Arrow class="w-2.5 h-2.5 fill-current" />
          </button>

          <!-- Dropdown 選單 -->
          <ul
            v-if="showChatDropdown"
            class="absolute right-0 top-full shadow-md rounded w-full z-10 border-2 border-cc-editor-column-border bg-cc-chat-bg"
          >
            <li
              v-for="chat in chatList"
              :key="chat.id"
              @click="switchChat(chat)"
              class="w-full px-3 py-2 hover:bg-gray-500 cursor-pointer truncate flex justify-between items-center"
              :class="currentChat.id === chat.id? 'text-cc-1':'text-cc-editor-column-tab-text'"
            >
              <div>{{ chat.title }}</div>
              <button class="p-2 hover:text-cc-red fill-current" @click.stop="deleteChat(chat.id)">
                <TrashCanIcon class="w-3 h-3"/>
              </button>             
            </li>
          </ul>
        </div>
      </div>
    </header>

    <main class="flex-1 px-2 overflow-y-auto bg-cc-chat-bg">
      <ul class="flex flex-col">
        <AIChatMessage v-for="message in historyMessages" :message="message" :key="message.id" />
      </ul>
    </main>

    <footer class="p-3 border-t-2 border-cc-editor-column-border ">
      <textarea
        class="w-full py-2 px-1 outline-none placeholder-gray-500 resize-none"
        v-model="messageInput"
        placeholder="How can I help you?"
        @keydown.enter.prevent="handleEnter"
      ></textarea>
      <div class="flex justify-between mt-2">
        <div class="flex gap-1">
          <button
            class="rounded px-3 py-1 hover:cursor-pointer"
            :class="withHtmlCode ? 'text-cc-1 bg-[#47cf73]' : 'bg-cc-13 text-cc-editor-column-tab-text hover:bg-gray-500 hover:text-cc-1'"
            @click="toggleWithCode('html')"
          >
            HTML
          </button>
          <button
            class="rounded px-3 py-1 hover:cursor-pointer"
            :class="withCssCode ? 'text-cc-1 bg-[#47cf73]' : 'bg-cc-13 text-cc-editor-column-tab-text hover:bg-gray-500 hover:text-cc-1'"
            @click="toggleWithCode('css')"
          >
            CSS
          </button>
          <button
            class="rounded px-3 py-1 hover:cursor-pointer"
            :class="withJSCode ? 'text-cc-1 bg-[#47cf73]' : 'bg-cc-13 text-cc-editor-column-tab-text hover:bg-gray-500 hover:text-cc-1'"
            @click="toggleWithCode('js')"
          >
            JavaScript
          </button>
        </div>
        <button
          class="hover:cursor-pointer hover:text-cc-green p-2 transition duration-150 ease-in-out disabled:opacity-50"
          @click="sendMessage"
          :disabled="isSending"
        >
          {{ isSending ? 'Sending...' : 'Send' }}
        </button>
      </div>
    </footer>
  </div>
</template>

<style scoped>
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background-color: #1e1e1e;
}

::-webkit-scrollbar-thumb {
  background-color: #888;
  border-radius: 4px;
}
</style>