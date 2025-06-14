import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/useAuthStore';
import { useWorkStore } from '@/stores/useWorkStore'; 

export function useHandleSave() {
  const router = useRouter();
  const authStore = useAuthStore();
  const workStore = useWorkStore();
  const { userProfile } = storeToRefs(authStore);
  const { currentWork } = storeToRefs(workStore);

  const handleSave = async () => {
    const work = currentWork.value;
    const userName = userProfile.value.username

    if (work.id) {
      workStore.saveCurrentWork(work);
      return;
    }

    try {
      const createdWork = await workStore.createNewWork(work);
      if (createdWork?.id) {
        await router.push({ path: `/${userName}/pen/${createdWork.id}` });
      } else {
        alert('建立失敗，請稍後再試');
      }
    } catch (error) {
      console.error('建立作品時發生錯誤：', error);
      alert('建立失敗，請稍後再試');
    }

  }
  return { handleSave };
};