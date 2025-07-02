<template>
  <dl class="flex flex-wrap gap-4 text-cc-1 text-sm mb-4 px-4">
    <!-- Created -->
    <div class="flex-1">
      <dt class="font-normal text-sm">Created on</dt>
      <dd class="font-bold text-base">
        <time class="font-mono uppercase tracking-wide text-cc-8 text-xs">
          {{ formatDate(pen.created_at) }}
        </time>
      </dd>
    </div>
    <!-- Updated -->
    <div class="flex-1">
      <dt class="font-normal text-sm">Updated on</dt>
      <dd class="font-bold text-base">
        <time class="font-mono uppercase tracking-wide text-cc-8 text-xs">
          {{ formatDate(pen.updated_at) }}
        </time>
      </dd>
    </div>
  </dl>
</template>

<script setup>
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const props = defineProps({
  pen: {
    type: Object,
    required: true,
  },
});

function formatDate(isoString) {
  return dayjs.utc(isoString).local().format("MMMM D, YYYY").toUpperCase();
}
</script>