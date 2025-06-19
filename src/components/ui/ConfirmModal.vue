<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div
    class="p-6 rounded-md max-w-sm w-full border-8"
    :class="styleClasses.container"
    >

     <p class="font-bold mb-2 text-lg" v-if="$slots.title">
      <slot name="title" />
     </p>


      <div class="text-xs text-cc-1 mb-4">
        <slot name="message" />
      </div>

       <div class="flex text-sm justtify-start space-x-2">
         <button
          :disabled="confirming"
          @click="onConfirm"
          :class="styleClasses.confirm"
         >
         {{ confirming ? loadingText : confirmText }}
         </button>
         <button
         @click="onCancel"
         class="bg-cc-13 px-4.5 py-2.5 rounded"
         >
         {{ cancleText }}
         </button>
       </div>
    </div>
  </div>
</template>
<script setup>
import { computed } from "vue";

const props = defineProps({
  confirmText: {
    type: String,
    default: "Confirm"
  },
  cancelText: {
    type: String,
    default: "Cancel"
  },
  confirming: {
    type: Boolean,
    default: false
  },
  loadingText: {
    type: String,
    default: "Processing"
  },
  variant: {
    type: String,
    default: "danger", // or 'warning'
    validator: (v) => ["danger","warning"].includes(v),
  }
});

const emit = defineEmits(["confirm", "cancel"]);

const onConfirm = () => emit("confirm");
const onCancel = () => emit("cancle");

const styleClasses = computed(() => {
  let container = "";
  let confirm = "";

  switch (props.variant) {
    case "danger":
      container = "bg-cc-17 border-cc-red text-cc-1";
      confirm = "bg-cc-red text-white px-4.5 py-2.5 rounded hover:bg-cc-red-dark";
      break;
    case "warning":
      container = "bg-cc-17 border-cc-yellow text-cc-1";
      confirm = "bg-cc-yellow text-black px-4.5 py-2.5 rounded hover:bg-cc-yellow-dark hover:text-white";
      break;
  }

  return { container, confirm };
});
</script>