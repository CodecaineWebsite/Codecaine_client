import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/stores/useAuthStore";
import { useWorkStore } from "@/stores/useWorkStore";
import { useToastStore } from "@/stores/useToastStore";
const toastStore = useToastStore();
const { showToast } = toastStore;

export function useHandleSave() {
  const router = useRouter();
  const authStore = useAuthStore();
  const workStore = useWorkStore();
  const { userProfile } = storeToRefs(authStore);
  const { currentWork } = storeToRefs(workStore);

  const handleSave = async () => {
    const work = currentWork.value;
    const userName = userProfile.value.username;

    if (work.id) {
      workStore.saveCurrentWork(work);
      return;
    }

    try {
      const createdWork = await workStore.createNewWork(work);
      if (createdWork?.id) {
        await router.push({ path: `/${userName}/dose/${createdWork.id}` });
      } else {
        showToast({
          message: "Failed to create. Please try again later.",
          variant: "danger",
        });
      }
    } catch (error) {
      showToast({
        message: "Failed to create. Please try again later.",
        variant: "danger",
      });
    }
  };
  return { handleSave };
}
