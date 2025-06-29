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
      @delete="handleDeletePen"
      @privacy-changed="handlePrivacyChanged"
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
          @toggle="toggleDropdown"
          @delete="handleDeletePen"
          @privacy-changed="handlePrivacyChanged"
        />
      </tbody>
    </table>
  </div>
</template>

<script setup>
import PenCardRow from "./PenCardRow.vue";
import PenCard from "./PenCards/PenCard.vue";

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
</script>
