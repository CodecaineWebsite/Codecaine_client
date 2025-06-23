<script setup>
import { computed } from 'vue';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css'; // 可依喜好更換主題

const props = defineProps({
  message: {
    type: Object
  }
})

// 設定 marked
marked.setOptions({
  breaks: true, // 支援換行
  highlight: (code, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value;
    } else {
      return hljs.highlightAuto(code).value;
    }
  }
})

// 轉為安全 HTML
const parsedContent = computed(() => {
  const rawHtml = marked.parse(props.message.content || '')
  return DOMPurify.sanitize(rawHtml)
})
</script>

<template>
  <li 
  class="inline-block p-2 px-4 py-2 rounded-2xl mb-3 prose prose-invert text-sm leading-relaxed break-words"
  :class="[
    message.role === 'user' ? 'bg-cc-13 mr-0 ml-auto max-w-[80%]' : 'max-w-none',
    message.status === 3 && message.role === 'assistant' ? 'text-red-400' : '',
    message.status === 3 && message.role === 'user' ? 'border border-red-400' : ''
  ]"
  v-html="parsedContent"
></li>
</template>