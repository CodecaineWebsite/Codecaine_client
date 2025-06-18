<script setup>
  import { ref, watch } from 'vue';
  import MonacoEditor from '@guolao/vue-monaco-editor';

  const props = defineProps({
    language: {
      type: String,
      required: true
    },
    code: {
      type: String,
      required: true,
    }
  })

  const emit = defineEmits(['update:code'])

  const language = ref(props.language);
  const theme = ref('vs-dark');

  const code = ref(props.code)
  watch(() => props.code, (newVal) => {
    code.value = newVal;
  }, { immediate: true });

  const editorOptions = ref({
    automaticLayout: true,
    scrollbar: {
      scrollDuration: 0 // 減少滾動動畫
    },
    fontSize: 14,
    tabSize: 2,
    minimap: { enabled: true },
    scrollBeyondLastLine: false,
    roundedSelection: false,
    autoClosingBrackets: 'always',
    renderLineHighlight: 'all',
    cursorBlinking: 'blink',
    wordWrap: 'on',
    parameterHints: { enabled: true },
  });

  watch(code, (newVal) => {
    emit('update:code', newVal)
  })
  
</script>

<template>
  <div class="w-full h-full md:h-[calc(100%-43px)]">
    <MonacoEditor
      v-model:value="code"
      :language="language"
      :theme="theme"
      :options="editorOptions"
    />
  </div>
</template>

<style>
  textarea.iPadShowKeyboard[widgetid="editor.contrib.ShowKeyboardWidget"] {
    bottom: 0px !important;
    right: 0px !important;
    z-index: 9999 !important;

    background-color: transparent !important;
    background-size: 50% 50% !important;
    background-repeat: no-repeat;
    background-position: center;
    border: none !important;
    outline: none;
    resize: none;
    opacity: 0.7;
    cursor: pointer;
  }
</style>
