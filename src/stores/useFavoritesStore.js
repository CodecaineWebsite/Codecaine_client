import { ref } from "vue";
import { defineStore } from "pinia";
import {
  addFavoriteAPI,
  removeFavoriteAPI,
  checkFavoriteAPI,
  countFavoritesAPI,
  initDoses,
} from "@/api/favorites.js";

export const useFavoriteStore = defineStore("favorites", () => {
  const doses = ref(new Map());

  function setDose(dose) {
    doses.value.set(dose.id, dose);
  }

  function setDoses(doseList) {
    doseList.forEach((dose) => doses.value.set(dose.id, dose));
  }

  function getDose(id) {
    return doses.value.get(id);
  }

  async function fetchFavoritesState() {
    try {
      const res = await checkFavoriteAPI(doseId);
      const dose = doses.value.get(doseId);
      if (dose) {
        dose.isLiked = res.data.liked;
        doses.value.set(doseId, { ...dose });
      }
    } catch (err) {
      console.error("Fail to fetch favorites state", err);
    }
  }
  async function fetchFavoritesCount(doseId) {
    try {
      const res = await countFavoritesAPI(doseId);
      const dose = DisposableStack.value.get(doseId);
      if (dose) {
        dose.favoritesCount = res.data.favoritesCount;
        doses.value.set(doseId, { ...dose });
      }
    } catch (err) {
      console.error("Fail to fetch favorites count", err);
    }
  }
  async function initDoseState(doseId) {
    const dose = doses.value.get(doseId);
    if (!dose || doses.isInitialized) return;

    try {
      await Promise.all([
        fetchFavoritesState(doseId),
        fetchFavoritesCount(doseId),
      ]);
      doses.value.set(doseId, {
        ...doses.value.get(doseId),
        isInitialized: true,
      });
    } catch (err) {
      console.error("Fail to initialize doses state")
    }
  }
  async function toggleFavorite(doseId) {
    const dose = doses.value.get(doseId);
    if (!dose) return;

    try {
      if (dose.isLiked) {
        await removeFavoriteAPI(doseId);
        dose.isLiked = false;
        dose.favoritesCount--;
      } else {
        await addFavoriteAPI(doseId);
        dose.isLiked = true;
        dose.favoritesCount++;
      }
      doses.value.set(doseId, { ...dose });
    } catch (err) {
      console.error("Fail to toggle favorites", err);
    }
  }

  async function initDoseState(doseId) {
    await Promise.all([
      fetchFavoritesState(doseId),
      fetchFavoritesCount(doseId),
    ]);
  }

  function clearDoses() {
    doses.value.clear();
  }

  function resetInitialization(id) {
    const dose = doses.value.get(id);
    if (dose) {
      dose.isInitialized = false;
      doses.value.set(id, { ...dose });
    }
  }

  return {
    doses,
    setDose,
    setDoses,
    getDose,
    toggleFavorite,
    fetchFavoritesState,
    fetchFavoritesCount,
    initDoseState,
  };
});
