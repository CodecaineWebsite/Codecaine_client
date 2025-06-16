<template>
  <div
    @click="handleOverlayClick"
    class="fixed inset-0 bg-black/40 z-50  text-cc-20 overflow-auto"
  >
    <div
      @click.stop
      class="mx-auto mt-16 mb-10  w-[90%] max-w-4xl bg-white p-6 rounded shadow-lg relative"
    >
      <button class="absolute top-2 right-2" @click="$emit('close')">✕</button>

      <!-- modal 版 Header -->
      <!-- <PenDetailModalHeader v-if="from === 'card'" :pen="pen" /> -->
      <!-- iframe 預覽 -->
      <!-- <PenDetailPreviewIframe v-if="from === 'card'" :pen="pen" /> -->

      <PenDetailContent v-if="pen" :pen="pen" @close="close"/>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import  api  from "@/config/api.js"; 
import { useModalStore } from '@/stores/useModalStore.js'
import PenDetailModalHeader from "@/components/PenDetails/PenDetailModalHeader.vue";
import PenDetailPreviewIframe from "@/components/PenDetails/PenDetailPreviewIframe.vue";
import PenDetailContent from "@/components/PenDetails/PenDetailContent.vue"; 
const props = defineProps({
  penId: Number,
  from: String, // 'card' | 'editor'
});

const modalStore = useModalStore();
const pen = ref(null);

function close() {
  modalStore.closeModal()
}

function handleOverlayClick() {
  close()
}


async function fetchPenDetail() {
  try {
    const res = await api.get(`/api/pens/${props.penId}`);
    pen.value = res.data;
  } catch (err) {
    console.error("Failed to load works", err);
  }
}

onMounted(() => {
  fetchPenDetail();
});
</script>
