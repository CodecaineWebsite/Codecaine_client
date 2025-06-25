<template>
  <footer class="bg-[#0d0d0d] text-xs py-8">
    <div
      class="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center md:items-start gap-8"
    >
      <div class="flex flex-row gap-4 w-full md:w-auto md:flex-col">
        <div class="flex flex-wrap items-center">
          <span
            class="font-bold text-white tracking-wide text-sm md:text-base mr-2 mb-2"
          >
            CodeCaine Members
          </span>
          <a
            href="https://github.com/ViviSun0725"
            class="mr-2 mb-2 text-gray-400 hover:text-white transition"
            target="_blank"
            >Vi vi Sun</a
          >
          <a
            href="https://github.com/k890120"
            target="_blank"
            class="mr-2 mb-2 text-gray-400 hover:text-white transition"
            >Happy</a
          >
          <a
            href="https://github.com/kaiadu"
            target="_blank"
            class="mr-2 mb-2 text-gray-400 hover:text-white transition"
            >Kaia</a
          >
          <a
            href=" https://github.com/lllBarry"
            class="mr-2 mb-2 text-gray-400 hover:text-white transition"
            target="_blank"
            >Barry</a
          >
          <a
            href="https://github.com/chinyuting"
            target="_blank"
            class="mr-2 mb-2 text-gray-400 hover:text-white transition"
            >郁婷</a
          >
          <a
            href="https://github.com/WeyTing"
            target="_blank"
            class="mr-2 mb-2 text-gray-400 hover:text-white transition"
            >威廷</a
          >
          <a
            href="#"
            class="mr-2 mb-2 text-gray-400 hover:text-white transition"
            >Primitive</a
          >
        </div>
        <div class="flex flex-wrap items-center">
          <span
            class="font-bold text-white tracking-wide text-sm md:text-base mr-2 mb-2"
            >Resources</span
          >
          <a
            href="https://cdnjs.com/"
            target="_blank"
            class="mr-2 mb-2 text-gray-400 hover:text-white transition"
            >CDNJS</a
          >
          <a
            href="https://vuejs.org/"
            target="_blank"
            class="mr-2 mb-2 text-gray-400 hover:text-white transition"
            >Vue.js</a
          >
          <a
            href="https://aws.amazon.com/tw/?nc2=h_lg"
            target="_blank"
            class="mr-2 mb-2 text-gray-400 hover:text-white transition"
            >AWS</a
          >
          <a
            href="https://firebase.google.com"
            target="_blank"
            class="mr-2 mb-2 text-gray-400 hover:text-white transition"
            >Firebase</a
          >
        </div>
      </div>
      <div
        class="flex flex-col items-center text-[11px] text-gray-400 w-full md:w-auto md:items-end"
      >
        <div class="flex items-center justify-center h-10">
          <CodecaineIcon class="w-24 md:w-36 cursor-pointer" @click="goHome" />
        </div>
        <p class="text-white text-xs md:text-lg">©2025 CodeCaine</p>
        <p class="italic mt-1 text-xs md:text-sm">Demo or it didn’t happen.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import CodecaineIcon from "@/components/icons/CodecaineIcon.vue";
import { useRouter } from "vue-router";
const router = useRouter();
const goHome = () => {
  router.push("/");
};
</script>
