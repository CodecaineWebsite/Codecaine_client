<template>
  <div
    @click="handleOverlayClick"
    class="fixed inset-0 bg-black/40 z-50 text-cc-20 overflow-auto"
  >
    <div
      @click.stop
      class="mx-auto mt-16 mb-10 w-[90%] max-w-[800px] bg-cc-16 rounded-lg shadow-lg relative"
    >
      <button class="absolute top-2 right-2" @click="$emit('close')">✕</button>

      <!-- modal 版 Header -->
      <PenDetailModalHeader v-if="from === 'card'" :pen="pen" />
      <!-- iframe 預覽 -->
      <!-- <PenDetailPreviewIframe v-if="from === 'card'" :pen="pen" /> -->

      <PenDetailContent v-if="pen" :pen="pen" @close="close" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import api from "@/config/api.js";
import { useModalStore } from "@/stores/useModalStore.js";
import { useAuthStore } from "@/stores/useAuthStore";
import { useToastStore } from "@/stores/useToastStore";
import PenDetailModalHeader from "@/components/PenDetails/PenDetailModalHeader.vue";
import PenDetailPreviewIframe from "@/components/PenDetails/PenDetailPreviewIframe.vue";
import PenDetailContent from "@/components/PenDetails/PenContent.vue";
const props = defineProps({
  penId: Number,
  from: String, // 'card' | 'editor'
});

const modalStore = useModalStore();
const authStore = useAuthStore();
const toastStore = useToastStore()
const pen = ref(null);
const isOwner = computed(() => authStore.userProfile?.username === pen.value.username);
function close() {
  modalStore.closeModal();
}

function handleOverlayClick() {
  close();
}

async function fetchPenDetail() {
  try {
    const res = await api.get(`/api/pens/${props.penId}`);
    pen.value = res.data;
  } catch (err) {
    toastStore.showToast({
      message: "Failed to load works",
      variant: "danger"
    })
  }
}

onMounted(() => {
  fetchPenDetail();
});

//在這層檢查作品是不是自己的
</script>
