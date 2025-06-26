import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/stores/useAuthStore";
import { useWorkStore } from "@/stores/useWorkStore";
import { useToastStore } from "@/stores/useToastStore";


export function useHandleSave() {
  const router = useRouter();
  const authStore = useAuthStore();
  const workStore = useWorkStore();
  const toastStore = useToastStore();
  const { showToast } = toastStore;
  const { userProfile } = storeToRefs(authStore);
  const { currentWork } = storeToRefs(workStore);

  const handleSave = async () => {
    const work = currentWork.value;
    const userName = userProfile.value.username;

    if (work.id) {
      try {
        await workStore.saveCurrentWork(work);
        showToast({
          message: "Saved.",
          variant: "success",
        });
      } catch (err) {
        showToast({
          message: "Failed to save. Please try again.",
          variant: "danger",
        });
      }
      return;
    }

    try {
      const createdWork = await workStore.createNewWork(work);
      if (createdWork?.id) {
        showToast({
          message: "Saved.",
          variant: "success",
        });
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
