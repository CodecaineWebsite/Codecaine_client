<script setup>
import Arrow from '@/assets/arrow.vue';
defineProps({
  expanded: Boolean
});
</script>
<template>
  <button class="flex md:hidden text-[aliceblue] rounded px-1 py-1 bg-[#444857] editorSmallButton-hover-bgc cursor-pointer" >
    <div class="h-7 flex justify-between w-6 items-center">
      <div class="transition-transform h-0.5 bg-gray-200 relative before:content-[''] before:w-1.5 before:h-0.5 before:bg-gray-200 before:absolute before:-top-1.5 before:left-0 after:content-[''] after:w-3.5 after:h-0.5 after:bg-gray-200 after:absolute after:-bottom-1.5 after:left-0" :class="expanded ? 'before:w-2 w-1.5' : 'before:w-1.5 w-2.5'"></div>
      <Arrow class="w-3 h-3 fill-current transition-transform self-start mt-1.5" :class=" {'scale-y-[-1]':expanded}"/>
    </div>
  </button>
</template>