<script setup>
  import { ref, onMounted, onUnmounted, nextTick } from 'vue';
  import { storeToRefs } from 'pinia'
  import { useAIChatStore } from '@/stores/useAIChatStore';
  import AIChatMessage from './AIChatMessage.vue';
  import Arrow from '@/assets/arrow.vue';
  import Edit from '@/assets/edit.vue';
  import TrashCanIcon from '../icons/TrashCanIcon.vue';

  const aiChatStore = useAIChatStore();
  const { addNewChat, fetchChats, fetchMessages, deleteChat, sendUserMessage, changeCurrentChat } = aiChatStore;
  const { isSending, historyMessages, currentChat, chatList } = storeToRefs(aiChatStore);

  const showScrollButton = ref(false);
  const showChatDropdown = ref(false)
  const messageInput = ref('')
  const withHtmlCode = ref(false)
  const withCssCode = ref(false)
  const withJSCode = ref(false)
  const editingChatId = ref(null);
  const editedTitle = ref('');

  const chatContainer = ref(null);

  const scrollToBottom = (smooth = false) => {
    nextTick(() => {
      const el = chatContainer.value;
      if (el) {
        el.scrollTo({
          top: el.scrollHeight,
          behavior: smooth ? 'smooth' : 'auto',
        });
        handleScroll();
      }
    });
  };

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
    await sendUserMessage(payload)
    scrollToBottom(true)
  };
  
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

  const handleChatRename = async (chat) => {
    if (editingChatId.value === chat.id) {
      // 點第二次 → 強制提交並離開編輯模式
      await submitChatRename(chat, { forceSubmit: true });
    } else {
      editingChatId.value = chat.id;
      editedTitle.value = chat.title;

      nextTick(() => {
        const input = document.querySelector(`.chat-input-${chat.id}`);
        input?.focus();
      });
    }
  };

  const submitChatRename = async (chat, options = {}) => {
    const trimmed = editedTitle.value.trim();

    const isSame = trimmed === chat.title;
    const isEmpty = trimmed === '';

    if (!options.forceSubmit && (isEmpty || isSame)) {
      editingChatId.value = null;
      return;
    }

    try {
      if (!isSame && !isEmpty) {
        await aiChatStore.renameChat(chat.id, trimmed);
        chat.title = trimmed;
      }
    } catch (error) {
      console.error('Failed to rename chat:', error);
    } finally {
      editingChatId.value = null;
    }
  };

  const switchChat = async(chat) => {
    if (editingChatId.value !== null) return;
    showChatDropdown.value = false
    currentChat.value = chat
    await aiChatStore.fetchMessages(chat.id)
    scrollToBottom()
  }

  const isComposing = ref(false);

  const handleEnter = (e) => {
    if (isComposing.value) return;
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  onMounted(async() => {
    await fetchChats();
    changeCurrentChat(chatList.value[0])
    scrollToBottom();
    if (chatList.value.length === 0) {
      await addNewChat();
    } else {
      await fetchMessages(chatList.value[0].id);
    }
    const el = chatContainer.value;
    if (!el) return;

    el.addEventListener('scroll', handleScroll);
  })

  onUnmounted(() => {
    const el = chatContainer.value;
    if (!el) return;

    el.removeEventListener('scroll', handleScroll);
  });

  const handleScroll = () => {
    const el = chatContainer.value;
    if (!el) return;

    const threshold = 100; // 離底部多遠時顯示按鈕
    const isBottom = el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
    showScrollButton.value = !isBottom;
  };
</script>

<template>
  <div class="flex flex-col h-full bg-cc-chat-bg relative">
    <header class="mb-2">
      <div class="text-center p-2">OpenAI Chat</div>
      <div class="p-2 flex justify-between items-center relative  border-y-2 border-cc-editor-column-border">
        <div class="py-1 px-2 truncate max-w-full">{{ currentChat?.title || 'Choose a Chat' }}</div>
        <div class="shrink-0">
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
            class="absolute right-0 top-full shadow-md rounded w-full z-10 border-2 border-cc-editor-column-border bg-cc-chat-bg text-sm"
          >
            <li
              v-for="chat in chatList"
              :key="chat.id"
              @click="switchChat(chat)"
              class="w-full px-3 py-2 hover:bg-gray-500 cursor-pointer truncate flex justify-between items-center"
              :class="currentChat.id === chat.id? 'text-cc-1':'text-cc-editor-column-tab-text'"
            >
              <div v-if="editingChatId !== chat.id" class="shrink-1 overflow-hidden">
                <div class="truncate max-w-full">{{ chat.title }}</div>
              </div>
              <input
                v-else
                v-model="editedTitle"
                class="bg-gray-800 rounded text-white p-1 w-full outline-none"
                @blur="submitChatRename(chat)"
                @keydown.enter.prevent="submitChatRename(chat)"
              />
              <div class="shrink-0">
                <button class="p-2 hover:text-cc-1 fill-current text-cc-editor-column-tab-text" @click.stop="handleChatRename(chat)">
                  <Edit class="w-3 h-3 block"/>
                </button>    
                
                <button class="p-2 hover:text-cc-red fill-current text-cc-editor-column-tab-text" @click.stop="deleteChat(chat.id)">
                  <TrashCanIcon class="w-3 h-3"/>
                </button>     
              </div>
            </li>
          </ul>
        </div>
      </div>
    </header>

    <main class="relative flex-1 px-2 overflow-y-auto bg-cc-chat-bg" ref="chatContainer">
      <ul class="flex flex-col">
        <AIChatMessage v-for="message in historyMessages" :message="message" :key="message.id" />
      </ul>
      <button
        v-if="showScrollButton"
        @click="scrollToBottom(true)"
        class="sticky block shadow-lg shadow-black/30 bottom-3 mx-auto bg-cc-13 bg-opacity-70 hover:bg-gray-500 text-cc-editor-column-tab-text text-cc-1 hover:text-cc-1 px-4 py-1 rounded-2xl shadow transition"
      >
        Go to Latest
      </button>
    </main>
    

    <footer class="p-3 border-t-2 border-cc-editor-column-border ">
      <textarea
        class="w-full px-1 outline-none placeholder-gray-500 resize-none"
        v-model="messageInput"
        placeholder="How can I help you?"
        :disabled="isSending"
        @keydown.enter.prevent="handleEnter"
        @compositionstart="isComposing = true"
        @compositionend="isComposing = false"
      ></textarea>
      <p class="text-xs text-gray-400">
        Select code to include in your message
      </p>
      <div class="flex justify-between mt-2">
        <div class="flex gap-1">
          <button
            title="Include current HTML code"
            class="rounded px-3 py-1 hover:cursor-pointer"
            :class="withHtmlCode ? 'text-cc-1 bg-[#47cf73]' : 'bg-cc-13 text-cc-editor-column-tab-text hover:bg-gray-500 hover:text-cc-1'"
            @click="toggleWithCode('html')"
            :disabled="isSending"
          >
            HTML
          </button>
          <button
            title="Include current CSS code"
            class="rounded px-3 py-1 hover:cursor-pointer"
            :class="withCssCode ? 'text-cc-1 bg-[#47cf73]' : 'bg-cc-13 text-cc-editor-column-tab-text hover:bg-gray-500 hover:text-cc-1'"
            @click="toggleWithCode('css')"
            :disabled="isSending"
          >
            CSS
          </button>
          <button
            class="rounded px-3 py-1 hover:cursor-pointer"
            :class="withJSCode ? 'text-cc-1 bg-[#47cf73]' : 'bg-cc-13 text-cc-editor-column-tab-text hover:bg-gray-500 hover:text-cc-1'"
            @click="toggleWithCode('js')"
            :disabled="isSending"
          >
            JavaScript
          </button>
        </div>
        <button
          title="Include current JavaScript code"
          class="hover:cursor-pointer hover:text-cc-green px-2 py-1 transition duration-150 ease-in-out disabled:opacity-50 disabled:hover:text-current disabled:hover:bg-none"
          :disabled="isSending"
          @click="sendMessage"
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