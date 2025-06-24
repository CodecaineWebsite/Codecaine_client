<script setup>
  import { storeToRefs } from 'pinia'
  import { useWorkStore } from '@/stores/useWorkStore';
	import EditorSmallButton from './EditorSmallButton.vue';
  import { useRoute, useRouter } from 'vue-router';
	import PenDetailModal from '../PenDetails/PenDetailModal.vue';
	import { useModalStore } from '@/stores/useModalStore';
	
	const route = useRoute();
  const router = useRouter();
  const workStore = useWorkStore();
  const modalStore = useModalStore();

  const { moveToTrash } = workStore; 
  const { currentWork, currentId } = storeToRefs(workStore);
	function openPenDetailModal() {
		modalStore.openModal(currentId.value, "editor")
	}
	
  const handleMoveToTrash = async () => {
    const confirmed = window.confirm('Are you sure you want to move this work to the trash? You can restore it later from the trash.');
    if (!confirmed) return;
		try {
			const id = currentId.value;
			const success = await moveToTrash(id);

			if (success) {
				console.log(`Work ID: ${id} has been moved to the trash`);
				await router.push({ path: '/your-work' });
			} else {
				console.warn(`Move failed: server did not return a success status`);
				alert('Failed to move to trash. Please try again later.');
			}
		} catch (error) {
			console.error('Failed to move to trash:', error);
			alert('Failed to move to trash.');
		}
	};

	defineProps({
		isConsoleShow: Boolean
	})
	const emit = defineEmits(['toggle-console'])

	const handleToggleConsole = () => {
		emit("toggle-console")
	}
</script>
<template>
	<PenDetailModal v-if="modalStore.showDetailModal" :pen-id="Number(currentId)" />

	<footer class="h-8 w-full flex relative justify-between items-center py-[.2rem] px-3 bg-cc-14 text-white">
		<div class="flex items-center h-full">
			<EditorSmallButton class="hover:bg-cc-12" @buttonClick="handleToggleConsole">Console</EditorSmallButton>
		</div>
		<div class="flex items-center h-full gap-2">
			<EditorSmallButton class="hover:bg-cc-12" @click="openPenDetailModal">comment</EditorSmallButton>
			<EditorSmallButton class="hover:bg-cc-red" @click.prevent="handleMoveToTrash">Delete</EditorSmallButton>
		</div>
	</footer>
</template>