import { ref } from 'vue'
import { defineStore, storeToRefs } from "pinia";
import { useWorkStore } from './useWorkStore';
import api from '../config/api'

const workStore = useWorkStore()
const { currentWork } = storeToRefs(workStore)

export const useAIChatStore = defineStore('chat', () => {
  const historyMessages = ref([])
  const currentChat = ref({})
  const chatList = ref([])
  const isSending = ref(false);

  async function sendUserMessage({ content, html = false, css = false, js = false }) {
    if (!currentChat.value?.id) return;

    isSending.value = true;
  
    const codeParts = [];
    if (html) codeParts.push(currentWork.value.html.trim());
    if (css) codeParts.push(currentWork.value.css.trim());
    if (js) codeParts.push(currentWork.value.javascript.trim());
    const code = codeParts.join('\n');
  
    const userContent = `${code ? code + '\n' : ''}${content.trim()}`;
    if (!userContent.trim()) {
      isSending.value = false;
      return;
    }
  
    const payload = {
      content: userContent,
      chatId: currentChat.value.id,
      role: "user",
    };
  
    // 先建立臨時 user 訊息並推進畫面
    const tempUserMessage = {
      role: "user",
      content: userContent,
      status: 1,
      createdAt: new Date().toISOString(),
    };
    historyMessages.value.push(tempUserMessage);

    const pendingId = Date.now();
    const pendingMessage = {
      role: "assistant",
      content: "...",
      status: 0,
      tempId: pendingId,
    };
  
    historyMessages.value.push(pendingMessage);
    try {
      const res = await api.post('/api/ai/message', payload);
      const data = res.data;
      const index = historyMessages.value.findIndex(m => m.tempId === pendingId);
      if (index !== -1) historyMessages.value.splice(index, 1);

      const userMsg = data.messages.find(m => m.role === 'user');
      if (userMsg) {
        const index = historyMessages.value.findIndex(m => m.tempId === userMsg.tempId); // 或其他你能對應的 key
        if (index !== -1) {
          historyMessages.value.splice(index, 1, userMsg); // 用正式 user message 替換暫時的
        }
      }
  
      if (data?.messages?.length) {
        const assistantMsg = data.messages.find(m => m.role === 'assistant');
  
        // 如果有回覆就加入 historyMessages
        if (assistantMsg) {
          if (assistantMsg.status === 1) {
            historyMessages.value.push(assistantMsg);
          } else {
            historyMessages.value.push({
              role: 'assistant',
              content: 'AI was unable to respond. Please try again later.',
              status: 3,
            });
          }
        }
      } else {
        historyMessages.value.push({
          role: 'assistant',
          content: 'AI response failed. No message was received.',
          status: 3,
        });
      }
  
    } catch (err) {
      console.error('Failed to send message', err);
      
      const index = historyMessages.value.findIndex(m => m.tempId === pendingId);
      if (index !== -1) historyMessages.value.splice(index, 1);

      historyMessages.value.push({
        role: 'assistant',
        content: 'An error occurred while sending the message. Please try again later.',
        status: 3,
      });
    } finally {
      isSending.value = false;
      console.log(historyMessages.value);
    }
  }

  async function fetchChats() {
    try {
      const res = await api.get(`api/ai/chats`)
      chatList.value = res.data.chats;
      if(chatList.value.length === 0) {
        addNewChat()
      }
      return res.data.chats
    } catch (err) {
      console.error('Failed to fetch chats:', err)
    }
  }

  async function fetchMessages(chatId) {
    try {
      const res = await api.get(`/api/ai/messages/${chatId}`)
      historyMessages.value = res.data.messages || []
    } catch (err) {
      console.error('Failed to fetch messages:', err)
    }
  }

  async function addNewChat() {
    try {
      const res = await api.post(`/api/ai/chats`)
      changeCurrentChat(res.data.chat)
    } catch (err) {
      console.error('Failed to add new chat:', err)
    }
  }

  function changeCurrentChat(chat) {
    currentChat.value = chat;
    fetchMessages(currentChat.value.id)
  }

  async function renameChat(chatId, newTitle) {
    try {
      await api.patch(`/api/ai/chats/${chatId}`, { title: newTitle });
    } catch (error) {
      console.error('Rename chat failed:', error);
      throw error;
    }
  }

  async function deleteChat(chatId) {
    try {
      await api.delete(`/api/ai/chats/${chatId}`);
      // 刪除後更新聊天清單
      chatList.value = chatList.value.filter(chat => chat.id !== chatId);
      // 如果刪除的是當前聊天，改成第一筆或空
      if (currentChat.value.id === chatId) {
        if (chatList.value.length > 0) {
          changeCurrentChat(chatList.value[0]);
        } else {
          currentChat.value = {};
          historyMessages.value = [];
        }
      }
      fetchChats();
    } catch (err) {
      console.error('Failed to delete chat:', err);
    }
  }

  return {
    isSending,
    historyMessages,
    currentChat,
    chatList,
    changeCurrentChat,
    sendUserMessage,
    addNewChat,
    fetchChats,
    fetchMessages,
    renameChat,
    deleteChat
  }
})