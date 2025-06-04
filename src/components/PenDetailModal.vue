<template>
  <div
    @click="handleOverlayClick"
    class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center text-cc-20"
  >
    <div
      @click.stop
      class="bg-white w-[90%] max-w-4xl p-6 rounded shadow-lg relative"
    >
      <button class="absolute top-2 right-2" @click="$emit('close')">✕</button>

      <!-- modal 版 Header -->
      <PenDetailModalHeader v-if="from === 'card'" :pen-id="penId" />
      <!-- iframe 預覽 -->
      <PenDetailPreviewIframe v-if="from === 'card'" :pen-id="penId" />

      <PenDetailContent :pen-id="penId" />
    </div>
  </div>
</template>

<script setup>
import { useModalStore } from '@/stores/useModalStore.js'
import PenDetailModalHeader from "./PenDetailModalHeader.vue";
import PenDetailPreviewIframe from "./PenDetailPreviewIframe.vue";
import PenDetailContent from "@/components/PenDetailContent.vue";
const props = defineProps({
  penId: String,
  from: String, // 也可以是類型 'card' | 'editor'
});

const modalStore = useModalStore()
function close() {
  modalStore.closeModal()
}
// 這個其實可以不寫，但如果你未來要擴充（例如點背景播放音效），就保留 function 寫法
function handleOverlayClick() {
  close()
}
</script>
