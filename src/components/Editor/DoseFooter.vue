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
    const confirmed = window.confirm('確定要將這個作品移至垃圾桶嗎？此操作可以在垃圾桶中還原。');
    if (!confirmed) return;
		try {
			const id = currentId.value;
			const success = await moveToTrash(id);

			if (success) {
				console.log(`作品 ID: ${id} 已丟入垃圾桶`);
				await router.push({ path: '/your-work' });
			} else {
				console.warn(`移動失敗：伺服器未回傳成功狀態`);
				alert('無法丟入垃圾桶，請稍後再試');
			}
		} catch (error) {
			console.error('丟入垃圾桶失敗：', error);
			alert('無法丟入垃圾桶');
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