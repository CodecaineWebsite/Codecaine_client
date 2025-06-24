<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" class="relative z-50" @close="closeModal">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/25"></div>
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div
          class="flex min-h-full items-center justify-center p-4 text-center"
        >
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
            >
              <DialogTitle
                as="h3"
                class="text-lg font-medium leading-6 text-gray-900 mb-4"
              >
                Upload and crop image
              </DialogTitle>
              <!-- 拖曳上傳區或剪裁區 -->
              <div
                v-if="!imageSrc"
                class="border border-dashed border-gray-300 p-8 text-center cursor-pointer hover:bg-gray-50"
                @dragover.prevent
                @drop.prevent="onDrop"
                @click="triggerFileInput"
              >
                <input
                  ref="fileInput"
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="onFileChange"
                />
                <p class="text-gray-500">
                  Drag and drop an image here, or click to select a file
                </p>
              </div>

              <div v-else>
                <Cropper
                  class="h-96 w-full bg-gray-100"
                  :src="imageSrc"
                  :stencil-props="{ aspectRatio: 1 }"
                  :auto-zoom="true"
                  :resize-image="{ enabled: true }"
                  ref="cropperRef"
                />
              </div>
              <!-- 底部操作列 -->
              <div class="mt-6 flex justify-end gap-2">
                <button
                  class="px-4 py-2 text-sm text-gray-700 hover:underline"
                  @click="closeModal"
                >
                  Cancel
                </button>
                <button
                  v-if="imageSrc"
                  class="px-4 py-2 bg-blue-600 text-white rounded-md"
                  @click="save"
                >
                  Save
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
<script setup>
import { ref } from "vue";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { Cropper } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";

const props = defineProps({
  isOpen: Boolean,
});
const emit = defineEmits(["close", "submit"]);

const imageSrc = ref(null);
const cropperRef = ref(null);
const fileInput = ref(null);

const closeModal = () => {
  imageSrc.value = null;
  emit("close");
};

const triggerFileInput = () => {
  fileInput.value.click();
};

const onFileChange = (e) => {
  const file = e.target.files[0];
  if (file) imageSrc.value = URL.createObjectURL(file);
  emit('filename', file.name);
};

const onDrop = (e) => {
  const file = e.dataTransfer.files[0];
  if (file) {
    imageSrc.value = URL.createObjectURL(file);
    emit('filename', file.name)
  }
};

const save = () => {
  const cropper = cropperRef.value;
  if (!cropper) return;
  const canvas = cropper.getResult().canvas;
  canvas.toBlob((blob) => {
    if (blob) emit("submit", blob);
    closeModal();
  }, "image/jpeg");
};
</script>
<style scoped>
/* 其他style */
</style>
