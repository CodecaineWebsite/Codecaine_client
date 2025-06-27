import { onMounted, onBeforeUnmount } from 'vue';

export function useEscapeToClose(callback) {
  const handler = (e) => {
    if (e.key === 'Escape') {
      callback();
    }
  };

  onMounted(() => window.addEventListener('keydown', handler));
  onBeforeUnmount(() => window.removeEventListener('keydown', handler));
}
