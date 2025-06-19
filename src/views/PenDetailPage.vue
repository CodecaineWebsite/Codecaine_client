<!-- 整頁式 detail 頁 -->
<template>
  <div class="min-h-screen p-6 bg-gray-100">
    <!-- 1. 整頁式 header -->
    <PenDetailPageHeader />
    <!-- 2. iframe 預覽 -->
    <PenDetailPreviewIframe :pen-id="penId" />
    <!-- 3. content -->
    <PenDetailContent :pen-id="penId" />
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import PenDetailPageHeader from '@/components/PenDetails/PenDetailPageHeader.vue'
import PenDetailPreviewIframe from '@/components/PenDetails/PenDetailPreviewIframe.vue'
import PenDetailContent from '@/components/PenDetails/PenContent.vue'

const route = useRoute()
const penId = route.params.pen_id
</script>
