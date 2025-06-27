<template>
  <!-- grid layout -->
  <div
    v-if="props.mode === 'grid'"
    class="grid grid-cols-1 sm:[grid-template-columns:repeat(auto-fill,minmax(30%,1fr))] gap-12"
  >
    <PenCard
      v-for="pen in pens"
      :key="pen.id"
      :pen="pen"
      :is-open="openedDropdownId === pen.id"
      @delete="handleDeletePen"
      @privacy-changed="handlePrivacyChanged"
      @toggle="toggleDropdown"
    />
  </div>
  <!-- table layout -->
  <div v-else-if="props.mode === 'table'">
    <table
      class="table-fixed w-full border-separate lg:border-spacing-0.5 text-left"
    >
      <thead class="hidden lg:table-header-group">
        <tr class="text-left">
          <th class="py-1 px-2 whitespace-nowrap">Title</th>
          <th class="py-1 px-2 w-[30px] whitespace-nowrap"></th>
          <th class="py-1 px-2 w-[150px] whitespace-nowrap">Created</th>
          <th class="py-1 px-2 w-[150px] whitespace-nowrap">Last Updated</th>
          <th class="py-1 px-2 w-[180px] text-center whitespace-nowrap">
            Stats
          </th>
          <th class="py-1 px-2 w-[60px] whitespace-nowrap"></th>
        </tr>
      </thead>
      <tbody>
        <PenCardRow
          v-for="pen in pens"
          :key="pen.id"
          :pen="pen"
          :is-open="openedDropdownId === pen.id"
          @toggle="toggleDropdown"
          @delete="handleDeletePen"
          @privacy-changed="handlePrivacyChanged"
        />
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import PenCardRow from "./PenCardRow.vue";
import PenCard from "./PenCards/PenCard.vue";

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
