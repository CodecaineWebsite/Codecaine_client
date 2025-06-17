<template>
  <!-- grid layout -->
  <div
    v-if="props.mode === 'grid'"
    class="grid [grid-template-columns:repeat(auto-fill,minmax(30%,1fr))] gap-12"
  >
    <PenCard
      v-for="pen in pens"
      :key="pen.id"
      :pen="pen"
      @delete="handleDeletePen"
      @privacy-changed="handlePrivacyChanged"
    />
  </div>
  <!-- table layout -->
  <div v-else-if="props.mode === 'table'">
    <table class="table-auto w-full border-collapse">
      <thead>
        <tr class="text-left border-b border-gray-400">
          <th class="py-2 px-4">Title</th>
          <th class="py-2 px-4"></th>
          <th class="py-2 px-4">Created</th>
          <th class="py-2 px-4">Last Updated</th>
          <th class="py-2 px-4">Stats</th>
          <th class="py-2 px-4"></th>
        </tr>
      </thead>
      <tbody>
        <PenCardRow
          v-for="pen in pens"
          :key="pen.id"
          :pen="pen"
          :is-open="openedDropdownId === pen.id"
          @toggle="toggleDropdown"
        />
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import PenCardRow from "./PenCardRow.vue";
import PenCard from "./PenCard.vue";

const menuOpen = ref(false);
const openedDropdownId = ref(null);

const props = defineProps({
  pens: {
    type: Array,
    required: true,
  },
  mode: {
    type: String,
    default: "grid",
  },
  filter: {
    type: String,
    default: "all",
  },
});

function handleDeletePen(deletedId) {
  const index = props.pens.findIndex((pen) => pen.id === deletedId);
  if (index !== -1) {
    props.pens.splice(index, 1);
  }
}

function handleClickOutside(event) {
  // 點擊不是按鈕或選單內容時，關閉 dropdown
  if (
    !event.target.closest(".dropdown-toggle") &&
    !event.target.closest(".dropdown-menu")
  ) {
    openedDropdownId.value = null;
  }
}

function handlePrivacyChanged({ id, is_private }) {
  console.log("handlePrivacyChanged", id, is_private);
  if (props.filter === "private" && !is_private) {
    const index = props.pens.findIndex((pen) => pen.id === id);
    if (index !== -1) {
      props.pens.splice(index, 1);
    }
  }
  if (props.filter === "public" && is_private) {
    const index = props.pens.findIndex((pen) => pen.id === id);
    if (index !== -1) {
      props.pens.splice(index, 1);
    }
  }
}

function removePen(id) {}

function toggleDropdown(id) {
  if (openedDropdownId.value === id) {
    // 如果點的是已經開啟的那一筆，就關掉
    openedDropdownId.value = null;
  } else {
    // 否則就打開這一筆
    openedDropdownId.value = id;
  }
}

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});
onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>
