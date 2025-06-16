<template>
  <tr class="group border-b border-gray-300 hover:bg-gray-900">
    <td class="py-2 px-4">
      <a :href="editorPageLink">{{ pen.title }}</a>
    </td>
    <td class="py-2 px-4">
      <button
        @click="openDetailModal"
        class="bg-black/50 rounded p-1 opacity-0 group-hover:opacity-100 transition"
      >
        <ExternalLinkIcon class="w-4 fill-white" />
      </button>
    </td>
    <td class="py-2 px-4">{{ formatDate(pen.created_at) }}</td>
    <td class="py-2 px-4">{{ formatDate(pen.updated_at) }}</td>
    <td class="py-2 px-4 flex">
      <div class="flex gap-2 mt-3">
        <button
          class="flex items-center gap-1 bg-card-button-primary hover-bg-card-hover text-white px-3 py-0.5 rounded-lg font-medium text-sm transition select-none"
        >
          <span>
            <HeartIcon class="w-4 fill-current" />
          </span>
          <span>{{ pen.favorites_count || 0 }}</span>
        </button>
        <button
          class="flex items-center gap-1 bg-card-button-primary hover-bg-card-hover text-white px-3 py-0.5 rounded-lg font-medium text-sm transition select-none"
        >
          <ChatBubbleIcon class="w-4 fill-current" />
          <span>{{ pen.comments_count || 0 }}</span>
        </button>
        <button
          class="flex items-center gap-1 bg-card-button-primary hover-bg-card-hover text-white px-3 py-0.5 rounded-lg font-medium text-sm transition select-none"
        >
          <EyeIcon class="w-4 fill-current" />
          <span>{{ pen.views_count || 0 }}</span>
        </button>
      </div>
    </td>
    <td class="py-2 px-4">
      <div class="flex items-center gap-2">
        <div class="relative">
          <button
            class="text-white text-xl font-bold hover:text-gray-300"
            @click.stop="emit('toggle', pen.id)"
          >
            •••
          </button>
          <!-- 下拉選單 -->
          <div
            v-if="isOpen"
            class="absolute right-0 mt-2 w-48 bg-card-menu text-sm rounded shadow-lg z-50 overflow-hidden border border-gray-700"
          >
            <a
              href="#"
              class="block px-4 py-2 hover-bg-card-hover text-blue-400 flex items-center gap-2"
            >
              <CheckIcon />
              Follow {{ "@" + pen.username }}
            </a>
          </div>
        </div>
      </div>
    </td>
  </tr>
</template>
<script setup>
import { ref } from "vue";
import { useModalStore } from "@/stores/useModalStore";
import ExternalLinkIcon from "./icons/ExternalLinkIcon.vue";
import ChatBubbleIcon from "./icons/ChatBubbleIcon.vue";
import HeartIcon from "./icons/HeartIcon.vue";
import EyeIcon from "./icons/EyeIcon.vue";
import CheckIcon from "./icons/CheckIcon.vue";

const modalStore = useModalStore();

const props = defineProps({
  pen: {
    type: Object,
    required: true,
  },
  isOpen: Boolean,
});

const emit = defineEmits(["toggle"]);
const workId = props.pen.id;
const userName = props.pen.username;
const editorPageLink = `/${userName}/pen/${workId}`;
// const menuOpen = ref(false);
// const toggleMenu = () => {
//   menuOpen.value = !menuOpen.value;
// };

function formatDate(datetime) {
  return new Date(datetime).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const openDetailModal = () => {
  modalStore.openModal(props.pen.id, "card");
};
</script>
