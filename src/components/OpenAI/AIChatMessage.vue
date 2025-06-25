<script setup>
import { computed, nextTick, onMounted, watch } from 'vue';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';

const props = defineProps({
  message: {
    type: Object
  }
})

marked.setOptions({
  breaks: true,
  highlight: false
});

const parsedContent = computed(() => {
  if (!props.message?.content) return '';
  
  try {
    const rawHtml = marked.parse(props.message.content);
    return DOMPurify.sanitize(rawHtml);
  } catch (err) {
    console.error('Markdown parsing error:', err);
    return props.message.content;
  }
});

const applyHighlight = async () => {
  await nextTick();
  
  const codeBlocks = document.querySelectorAll('pre code');
  
  codeBlocks.forEach((block) => {
    if (!block.classList.contains('hljs')) {

      const langClass = Array.from(block.classList).find(cls => cls.startsWith('language-'));
      const language = langClass ? langClass.replace('language-', '') : null;
      
      if (language && hljs.getLanguage(language)) {
        try {
          const result = hljs.highlight(block.textContent, { language });
          block.innerHTML = result.value;
          block.classList.add('hljs', `language-${language}`);
        } catch (err) {
          console.error(`Error highlighting ${language}:`, err);
          hljs.highlightElement(block);
        }
      } else {
        hljs.highlightElement(block);
      }
    }
  });
};

watch(parsedContent, () => {
  if (props.message?.role === 'assistant') {
    applyHighlight();
  }
}, { immediate: true });

onMounted(() => {
  if (props.message?.role === 'assistant') {
    applyHighlight();
  }
});
</script>

<template>
  <li 
    class="inline-block p-2 px-4 py-2 rounded-2xl mb-3 prose prose-invert text-base leading-relaxed break-words"
    :class="[
      message.role === 'user' ? 'bg-cc-13 mr-0 ml-auto max-w-[80%]' : 'max-w-none',
      message.status === 3 && message.role === 'assistant' ? 'text-red-400' : '',
      message.status === 3 && message.role === 'user' ? 'border border-red-400' : ''
    ]"
  >
    <template v-if="message.role === 'assistant'">
      <div v-html="parsedContent" class="message-content"></div>
    </template>
    <template v-else>
      <div style="white-space: pre-wrap;">{{ message.content }}</div>
    </template>
  </li>
</template>